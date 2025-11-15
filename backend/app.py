from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
import jwt
from functools import wraps

load_dotenv()

app = Flask(__name__)

# Handle DATABASE_URL from environment or construct from components
# For quick testing, use SQLite if no PostgreSQL is available
database_url = os.getenv('DATABASE_URL')
if not database_url:
    # Check if we should use SQLite for quick testing
    use_sqlite = os.getenv('USE_SQLITE', 'false').lower() == 'true'
    if use_sqlite:
        database_url = 'sqlite:///test.db'
    else:
        db_user = os.getenv('DB_USER', 'postgres')
        db_password = os.getenv('DB_PASSWORD', 'postgres')
        db_host = os.getenv('DB_HOST', 'localhost')
        db_port = os.getenv('DB_PORT', '5432')
        db_name = os.getenv('DB_NAME', 'screen_time_db')
        database_url = f'postgresql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}'

app.config['SQLALCHEMY_DATABASE_URI'] = database_url
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET'] = os.getenv('JWT_SECRET', 'your-secret-key-change-in-production')

db = SQLAlchemy(app)
migrate = Migrate(app, db)
# CORS configuration - allow all origins in development, restrict in production
cors_origins = os.getenv('CORS_ORIGINS', 'http://localhost:3000,http://localhost:80').split(',')
CORS(app, origins=cors_origins)

# Models
class User(db.Model):
    __tablename__ = 'users'
    
    user_id = db.Column(db.String(255), primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    pfp = db.Column(db.String(500))
    targeted_apps_time_weekly = db.Column(db.Float, default=0.0)
    amount_charged_weekly = db.Column(db.Float, default=0.0)
    total_invested = db.Column(db.Float, default=0.0)
    leaderboard_id = db.Column(db.String(255))
    leaderboard_position = db.Column(db.Integer)
    investment_risk_level = db.Column(db.String(50), default='standard')
    tracked_apps = db.Column(db.JSON)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    app_time_history = db.relationship('AppTimeHistory', backref='user', lazy=True)
    investment_history = db.relationship('InvestmentHistory', backref='user', lazy=True)

class AppTimeHistory(db.Model):
    __tablename__ = 'app_time_history'
    
    history_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.String(255), db.ForeignKey('users.user_id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    app_name = db.Column(db.String(255), nullable=False)
    time_spent_hours = db.Column(db.Float, nullable=False)
    amount_charged = db.Column(db.Float, nullable=False)

class InvestmentHistory(db.Model):
    __tablename__ = 'investment_history'
    
    investment_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.String(255), db.ForeignKey('users.user_id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    portfolio_value = db.Column(db.Float, nullable=False)

# Auth helpers
def get_token_from_header():
    auth_header = request.headers.get('Authorization')
    if auth_header and auth_header.startswith('Bearer '):
        return auth_header.split(' ')[1]
    return None

def verify_token(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = get_token_from_header()
        if not token:
            return jsonify({'error': 'No token provided'}), 401
        
        try:
            # In production, verify with Auth0
            # For now, we'll use a simple JWT decode
            decoded = jwt.decode(token, app.config['JWT_SECRET'], algorithms=['HS256'])
            request.user_id = decoded.get('sub')
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401
        
        return f(*args, **kwargs)
    return decorated_function

# Routes
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'}), 200

@app.route('/auth/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    name = data.get('name')
    user_id = data.get('user_id') or data.get('sub')
    pfp = data.get('picture')
    
    if not email or not name:
        return jsonify({'error': 'Email and name required'}), 400
    
    user = User.query.filter_by(email=email).first()
    
    if not user:
        user = User(
            user_id=user_id or email,
            name=name,
            email=email,
            pfp=pfp,
            tracked_apps=[],
            leaderboard_id=user_id or email
        )
        db.session.add(user)
        db.session.commit()
    
    # Generate JWT token
    token = jwt.encode({
        'sub': user.user_id,
        'email': user.email,
        'exp': datetime.utcnow() + timedelta(days=7)
    }, app.config['JWT_SECRET'], algorithm='HS256')
    
    return jsonify({
        'token': token,
        'user': {
            'user_id': user.user_id,
            'name': user.name,
            'email': user.email,
            'pfp': user.pfp
        }
    }), 200

@app.route('/user/profile', methods=['GET'])
@verify_token
def get_profile():
    user = User.query.filter_by(user_id=request.user_id).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify({
        'user_id': user.user_id,
        'name': user.name,
        'email': user.email,
        'pfp': user.pfp,
        'targeted_apps_time_weekly': user.targeted_apps_time_weekly,
        'amount_charged_weekly': user.amount_charged_weekly,
        'total_invested': user.total_invested,
        'leaderboard_position': user.leaderboard_position,
        'investment_risk_level': user.investment_risk_level,
        'tracked_apps': user.tracked_apps or []
    }), 200

@app.route('/user/apps', methods=['GET'])
@verify_token
def get_apps():
    user = User.query.filter_by(user_id=request.user_id).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify({'tracked_apps': user.tracked_apps or []}), 200

@app.route('/user/apps', methods=['PUT'])
@verify_token
def update_apps():
    user = User.query.filter_by(user_id=request.user_id).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    data = request.json
    tracked_apps = data.get('tracked_apps', [])
    
    user.tracked_apps = tracked_apps
    db.session.commit()
    
    return jsonify({'tracked_apps': user.tracked_apps}), 200

@app.route('/user/apptime', methods=['GET'])
@verify_token
def get_apptime():
    user = User.query.filter_by(user_id=request.user_id).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    days = request.args.get('days', 7, type=int)
    end_date = datetime.now().date()
    start_date = end_date - timedelta(days=days)
    
    history = AppTimeHistory.query.filter(
        AppTimeHistory.user_id == user.user_id,
        AppTimeHistory.date >= start_date,
        AppTimeHistory.date <= end_date
    ).order_by(AppTimeHistory.date).all()
    
    result = []
    for entry in history:
        result.append({
            'date': entry.date.isoformat(),
            'app_name': entry.app_name,
            'time_spent_hours': entry.time_spent_hours,
            'amount_charged': entry.amount_charged
        })
    
    return jsonify({'history': result}), 200

@app.route('/user/apptime', methods=['POST'])
@verify_token
def update_apptime():
    user = User.query.filter_by(user_id=request.user_id).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    data = request.json
    date_str = data.get('date')
    app_name = data.get('app_name')
    time_spent_hours = data.get('time_spent_hours', 0)
    
    if not date_str or not app_name:
        return jsonify({'error': 'Date and app_name required'}), 400
    
    date = datetime.strptime(date_str, '%Y-%m-%d').date()
    amount_charged = time_spent_hours * 2.0  # £2 per hour
    
    # Check if entry exists
    entry = AppTimeHistory.query.filter_by(
        user_id=user.user_id,
        date=date,
        app_name=app_name
    ).first()
    
    if entry:
        entry.time_spent_hours = time_spent_hours
        entry.amount_charged = amount_charged
    else:
        entry = AppTimeHistory(
            user_id=user.user_id,
            date=date,
            app_name=app_name,
            time_spent_hours=time_spent_hours,
            amount_charged=amount_charged
        )
        db.session.add(entry)
    
    # Update weekly totals
    week_start = date - timedelta(days=date.weekday())
    week_end = week_start + timedelta(days=6)
    
    week_history = AppTimeHistory.query.filter(
        AppTimeHistory.user_id == user.user_id,
        AppTimeHistory.date >= week_start,
        AppTimeHistory.date <= week_end
    ).all()
    
    user.targeted_apps_time_weekly = sum(h.time_spent_hours for h in week_history)
    user.amount_charged_weekly = sum(h.amount_charged for h in week_history)
    
    db.session.commit()
    
    return jsonify({
        'date': date.isoformat(),
        'app_name': app_name,
        'time_spent_hours': time_spent_hours,
        'amount_charged': amount_charged
    }), 200

@app.route('/leaderboard', methods=['GET'])
@verify_token
def get_leaderboard():
    users = User.query.order_by(User.total_invested.desc()).all()
    
    result = []
    for idx, user in enumerate(users, 1):
        user.leaderboard_position = idx
        result.append({
            'user_id': user.user_id,
            'name': user.name,
            'pfp': user.pfp,
            'targeted_apps_time_weekly': user.targeted_apps_time_weekly,
            'amount_charged_weekly': user.amount_charged_weekly,
            'total_invested': user.total_invested,
            'leaderboard_position': idx,
            'tracked_apps': user.tracked_apps or []
        })
    
    db.session.commit()
    
    return jsonify({'leaderboard': result}), 200

@app.route('/investments/portfolio', methods=['GET'])
@verify_token
def get_portfolio():
    user = User.query.filter_by(user_id=request.user_id).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    # Get latest portfolio value
    latest = InvestmentHistory.query.filter_by(
        user_id=user.user_id
    ).order_by(InvestmentHistory.date.desc()).first()
    
    # Get previous day for 24h change
    if latest:
        previous = InvestmentHistory.query.filter(
            InvestmentHistory.user_id == user.user_id,
            InvestmentHistory.date < latest.date
        ).order_by(InvestmentHistory.date.desc()).first()
        
        change_24h = 0
        if previous:
            change_24h = ((latest.portfolio_value - previous.portfolio_value) / previous.portfolio_value) * 100
        
        return jsonify({
            'total_value': latest.portfolio_value,
            'change_24h': round(change_24h, 2),
            'risk_level': user.investment_risk_level,
            'total_invested': user.total_invested
        }), 200
    
    return jsonify({
        'total_value': 0,
        'change_24h': 0,
        'risk_level': user.investment_risk_level,
        'total_invested': user.total_invested
    }), 200

@app.route('/investments/setup', methods=['POST'])
@verify_token
def setup_investments():
    user = User.query.filter_by(user_id=request.user_id).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    data = request.json
    risk_level = data.get('risk_level', 'standard')
    
    if risk_level not in ['standard', 'low', 'medium', 'high']:
        return jsonify({'error': 'Invalid risk level'}), 400
    
    user.investment_risk_level = risk_level
    db.session.commit()
    
    return jsonify({'risk_level': user.investment_risk_level}), 200

@app.route('/investments/history', methods=['GET'])
@verify_token
def get_investment_history():
    user = User.query.filter_by(user_id=request.user_id).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    days = request.args.get('days', 30, type=int)
    end_date = datetime.now().date()
    start_date = end_date - timedelta(days=days)
    
    history = InvestmentHistory.query.filter(
        InvestmentHistory.user_id == user.user_id,
        InvestmentHistory.date >= start_date,
        InvestmentHistory.date <= end_date
    ).order_by(InvestmentHistory.date).all()
    
    result = []
    for entry in history:
        result.append({
            'date': entry.date.isoformat(),
            'portfolio_value': entry.portfolio_value
        })
    
    return jsonify({'history': result}), 200

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=5000, debug=True)

