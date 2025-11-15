# Screen Time Investment Tracker

A React web application that tracks screen time on social media and entertainment apps, charges users based on usage, and automatically invests the money. Users can compete on a leaderboard and compare their progress with others.

## 🎯 Features

- **Screen Time Tracking**: Monitor time spent on selected apps (Instagram, TikTok, YouTube, etc.)
- **Automatic Charging**: £2 per hour on tracked apps
- **Auto-Investment**: Money is automatically invested based on risk preference
- **Leaderboard**: Compete and compare with other users
- **Investment Dashboard**: Track portfolio performance and holdings
- **Auth0 Integration**: Secure Google OAuth authentication

## 🛠 Tech Stack

- **Frontend**: React 18, Tailwind CSS, Recharts
- **Backend**: Python Flask, SQLAlchemy
- **Database**: PostgreSQL
- **Authentication**: Auth0
- **Deployment**: Docker, Docker Compose

## 📋 Prerequisites

- Node.js 18+ and npm
- Python 3.11+
- PostgreSQL 15+
- Docker and Docker Compose (for containerized deployment)
- Auth0 account (for authentication)

## 🚀 Quick Start

### Option 1: Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd FYH-2025
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and fill in your Auth0 credentials and database settings.

3. **Start with Docker Compose**
   ```bash
   docker-compose up -d
   ```

4. **Initialize database**
   ```bash
   docker-compose exec backend python init_db.py
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Option 2: Local Development

#### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   Create a `.env` file in the `backend` directory:
   ```env
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/screen_time_db
   AUTH0_DOMAIN=your-auth0-domain.auth0.com
   AUTH0_CLIENT_ID=your-auth0-client-id
   AUTH0_CLIENT_SECRET=your-auth0-client-secret
   JWT_SECRET=your-secret-key
   FLASK_ENV=development
   ```

5. **Initialize database**
   ```bash
   python init_db.py
   ```

6. **Run the server**
   ```bash
   python app.py
   ```

#### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the `frontend` directory:
   ```env
   REACT_APP_API_URL=http://localhost:5000
   REACT_APP_AUTH0_DOMAIN=your-auth0-domain.auth0.com
   REACT_APP_AUTH0_CLIENT_ID=your-auth0-client-id
   ```

4. **Start development server**
   ```bash
   npm start
   ```

## 📁 Project Structure

```
FYH-2025/
├── backend/
│   ├── app.py                 # Flask application
│   ├── init_db.py             # Database initialization and seeding
│   ├── requirements.txt       # Python dependencies
│   ├── Dockerfile             # Backend Docker image
│   └── migrations/            # Database migrations
├── frontend/
│   ├── src/
│   │   ├── pages/             # Page components
│   │   ├── components/        # Reusable components
│   │   ├── services/          # API services
│   │   └── App.js             # Main app component
│   ├── public/
│   ├── package.json
│   └── Dockerfile             # Frontend Docker image
├── docker-compose.yml         # Docker Compose configuration
├── .env.example               # Environment variables template
└── README.md
```

## 🔐 Auth0 Setup

1. **Create an Auth0 account** at https://auth0.com

2. **Create an Application**
   - Go to Applications → Create Application
   - Choose "Single Page Web Application"
   - Add `http://localhost:3000` to Allowed Callback URLs
   - Add `http://localhost:3000` to Allowed Logout URLs

3. **Get your credentials**
   - Domain: `your-tenant.auth0.com`
   - Client ID: Found in Application settings
   - Client Secret: Not needed for SPA (but needed for backend if using API)

4. **Update `.env` files** with your Auth0 credentials

## 📊 Database Schema

### Users Table
- `user_id` (Primary Key)
- `name`, `email`, `pfp`
- `targeted_apps_time_weekly`, `amount_charged_weekly`, `total_invested`
- `leaderboard_position`, `investment_risk_level`
- `tracked_apps` (JSON array)
- `created_at`

### AppTimeHistory Table
- `history_id` (Primary Key)
- `user_id` (Foreign Key)
- `date`, `app_name`
- `time_spent_hours`, `amount_charged`

### InvestmentHistory Table
- `investment_id` (Primary Key)
- `user_id` (Foreign Key)
- `date`, `portfolio_value`

## 🧪 Dummy Data

The application comes pre-seeded with 3 dummy accounts:

1. **Sarah Chen** - Medium risk, 28 hours/week
2. **Marcus Johnson** - High risk, 42 hours/week (Leader)
3. **Emma Williams** - Low risk, 21 hours/week

To re-seed the database:
```bash
docker-compose exec backend python init_db.py
# Or locally:
cd backend && python init_db.py
```

## 🌐 API Endpoints

### Authentication
- `POST /auth/login` - Handle Auth0 callback

### User
- `GET /user/profile` - Get user profile
- `GET /user/apps` - Get tracked apps
- `PUT /user/apps` - Update tracked apps
- `GET /user/apptime` - Get app time history
- `POST /user/apptime` - Update app time data

### Leaderboard
- `GET /leaderboard` - Get all leaderboard data

### Investments
- `GET /investments/portfolio` - Get portfolio data
- `POST /investments/setup` - Set risk level
- `GET /investments/history` - Get investment history

### Health
- `GET /health` - Health check endpoint

## 🚢 Deployment

### Vercel (Frontend)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   cd frontend
   vercel
   ```

3. **Set environment variables** in Vercel dashboard

### Railway (Backend)

1. **Connect repository** to Railway
2. **Set environment variables** in Railway dashboard
3. **Deploy** - Railway will auto-detect and deploy

### Render

1. **Use `render.yaml`** configuration
2. **Connect repository** to Render
3. **Set environment variables**
4. **Deploy**

### AWS (EC2/ECS)

1. **Build Docker images**
   ```bash
   docker build -t screen-time-backend ./backend
   docker build -t screen-time-frontend ./frontend
   ```

2. **Push to ECR** (or use Docker Hub)
3. **Deploy using ECS** or run on EC2 with docker-compose

### Heroku

1. **Install Heroku CLI**
2. **Create apps**
   ```bash
   heroku create screen-time-backend
   heroku create screen-time-frontend
   ```

3. **Set environment variables**
   ```bash
   heroku config:set DATABASE_URL=... -a screen-time-backend
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

## 🔧 Environment Variables

### Backend
- `DATABASE_URL` - PostgreSQL connection string
- `AUTH0_DOMAIN` - Auth0 domain
- `AUTH0_CLIENT_ID` - Auth0 client ID
- `AUTH0_CLIENT_SECRET` - Auth0 client secret
- `JWT_SECRET` - Secret key for JWT tokens
- `FLASK_ENV` - Flask environment (development/production)
- `PORT` - Server port (default: 5000)

### Frontend
- `REACT_APP_API_URL` - Backend API URL
- `REACT_APP_AUTH0_DOMAIN` - Auth0 domain
- `REACT_APP_AUTH0_CLIENT_ID` - Auth0 client ID

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest tests/
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📝 Development

### Running Migrations

```bash
# Using Alembic
cd backend
flask db upgrade
```

### Adding New Features

1. Create feature branch
2. Make changes
3. Test locally
4. Submit pull request

## 🐛 Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check `DATABASE_URL` in `.env`
- Verify database exists: `createdb screen_time_db`

### Auth0 Issues
- Verify callback URLs in Auth0 dashboard
- Check environment variables match Auth0 settings
- Ensure CORS is configured correctly

### Docker Issues
- Check logs: `docker-compose logs`
- Rebuild images: `docker-compose build --no-cache`
- Reset volumes: `docker-compose down -v`

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

**Built with ❤️ for FYH 2025**
