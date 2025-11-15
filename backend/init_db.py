from app import app, db, User, AppTimeHistory, InvestmentHistory
from datetime import datetime, timedelta
import random

def seed_dummy_data():
    """Seed the database with 3 dummy accounts"""
    
    with app.app_context():
        # Clear existing data (optional - comment out if you want to keep existing data)
        db.drop_all()
        db.create_all()
        
        # Account 1 - Sarah Chen
        sarah = User(
            user_id='sarah.chen@example.com',
            name='Sarah Chen',
            email='sarah.chen@example.com',
            pfp='https://ui-avatars.com/api/?name=Sarah+Chen&background=4f46e5&color=fff',
            targeted_apps_time_weekly=28.0,
            amount_charged_weekly=56.0,
            total_invested=784.0,
            leaderboard_id='sarah.chen@example.com',
            leaderboard_position=2,
            investment_risk_level='medium',
            tracked_apps=['Instagram', 'TikTok', 'YouTube'],
            created_at=datetime.utcnow() - timedelta(days=60)
        )
        db.session.add(sarah)
        
        # Account 2 - Marcus Johnson
        marcus = User(
            user_id='marcus.j@example.com',
            name='Marcus Johnson',
            email='marcus.j@example.com',
            pfp='https://ui-avatars.com/api/?name=Marcus+Johnson&background=059669&color=fff',
            targeted_apps_time_weekly=42.0,
            amount_charged_weekly=84.0,
            total_invested=1176.0,
            leaderboard_id='marcus.j@example.com',
            leaderboard_position=1,
            investment_risk_level='high',
            tracked_apps=['Instagram', 'Twitter', 'Reddit', 'YouTube'],
            created_at=datetime.utcnow() - timedelta(days=60)
        )
        db.session.add(marcus)
        
        # Account 3 - Emma Williams
        emma = User(
            user_id='emma.w@example.com',
            name='Emma Williams',
            email='emma.w@example.com',
            pfp='https://ui-avatars.com/api/?name=Emma+Williams&background=dc2626&color=fff',
            targeted_apps_time_weekly=21.0,
            amount_charged_weekly=42.0,
            total_invested=546.0,
            leaderboard_id='emma.w@example.com',
            leaderboard_position=3,
            investment_risk_level='low',
            tracked_apps=['Instagram', 'Facebook'],
            created_at=datetime.utcnow() - timedelta(days=60)
        )
        db.session.add(emma)
        
        db.session.commit()
        
        # Generate AppTimeHistory for last 7 days for each user
        today = datetime.now().date()
        
        # Sarah's app time history (medium usage)
        for day_offset in range(7):
            date = today - timedelta(days=day_offset)
            # Instagram: 1-2 hours/day
            insta_hours = round(random.uniform(1.0, 2.0), 1)
            db.session.add(AppTimeHistory(
                user_id=sarah.user_id,
                date=date,
                app_name='Instagram',
                time_spent_hours=insta_hours,
                amount_charged=insta_hours * 2.0
            ))
            
            # TikTok: 1-2 hours/day
            tiktok_hours = round(random.uniform(1.0, 2.0), 1)
            db.session.add(AppTimeHistory(
                user_id=sarah.user_id,
                date=date,
                app_name='TikTok',
                time_spent_hours=tiktok_hours,
                amount_charged=tiktok_hours * 2.0
            ))
            
            # YouTube: 1-1.5 hours/day
            yt_hours = round(random.uniform(1.0, 1.5), 1)
            db.session.add(AppTimeHistory(
                user_id=sarah.user_id,
                date=date,
                app_name='YouTube',
                time_spent_hours=yt_hours,
                amount_charged=yt_hours * 2.0
            ))
        
        # Marcus's app time history (high usage)
        for day_offset in range(7):
            date = today - timedelta(days=day_offset)
            # Instagram: 1.5-2 hours/day
            insta_hours = round(random.uniform(1.5, 2.0), 1)
            db.session.add(AppTimeHistory(
                user_id=marcus.user_id,
                date=date,
                app_name='Instagram',
                time_spent_hours=insta_hours,
                amount_charged=insta_hours * 2.0
            ))
            
            # Twitter: 1-2 hours/day
            twitter_hours = round(random.uniform(1.0, 2.0), 1)
            db.session.add(AppTimeHistory(
                user_id=marcus.user_id,
                date=date,
                app_name='Twitter',
                time_spent_hours=twitter_hours,
                amount_charged=twitter_hours * 2.0
            ))
            
            # Reddit: 1.5-2 hours/day
            reddit_hours = round(random.uniform(1.5, 2.0), 1)
            db.session.add(AppTimeHistory(
                user_id=marcus.user_id,
                date=date,
                app_name='Reddit',
                time_spent_hours=reddit_hours,
                amount_charged=reddit_hours * 2.0
            ))
            
            # YouTube: 1.5-2 hours/day
            yt_hours = round(random.uniform(1.5, 2.0), 1)
            db.session.add(AppTimeHistory(
                user_id=marcus.user_id,
                date=date,
                app_name='YouTube',
                time_spent_hours=yt_hours,
                amount_charged=yt_hours * 2.0
            ))
        
        # Emma's app time history (low usage)
        for day_offset in range(7):
            date = today - timedelta(days=day_offset)
            # Instagram: 1-1.5 hours/day
            insta_hours = round(random.uniform(1.0, 1.5), 1)
            db.session.add(AppTimeHistory(
                user_id=emma.user_id,
                date=date,
                app_name='Instagram',
                time_spent_hours=insta_hours,
                amount_charged=insta_hours * 2.0
            ))
            
            # Facebook: 1-1.5 hours/day
            fb_hours = round(random.uniform(1.0, 1.5), 1)
            db.session.add(AppTimeHistory(
                user_id=emma.user_id,
                date=date,
                app_name='Facebook',
                time_spent_hours=fb_hours,
                amount_charged=fb_hours * 2.0
            ))
        
        db.session.commit()
        
        # Generate InvestmentHistory for last 30 days
        # Sarah (medium risk): Starting at £650, ending at £784 (+20.6% growth)
        sarah_start = 650.0
        sarah_end = 784.0
        sarah_growth = (sarah_end - sarah_start) / sarah_start  # ~20.6%
        
        for day_offset in range(30):
            date = today - timedelta(days=day_offset)
            progress = (30 - day_offset) / 30
            base_value = sarah_start + (sarah_growth * sarah_start * progress)
            # Add moderate daily fluctuations (±2%)
            fluctuation = random.uniform(-0.02, 0.02)
            value = base_value * (1 + fluctuation)
            db.session.add(InvestmentHistory(
                user_id=sarah.user_id,
                date=date,
                portfolio_value=round(value, 2)
            ))
        
        # Marcus (high risk): Starting at £920, ending at £1176 (+27.8% growth)
        marcus_start = 920.0
        marcus_end = 1176.0
        marcus_growth = (marcus_end - marcus_start) / marcus_start  # ~27.8%
        
        for day_offset in range(30):
            date = today - timedelta(days=day_offset)
            progress = (30 - day_offset) / 30
            base_value = marcus_start + (marcus_growth * marcus_start * progress)
            # Add high daily fluctuations (±4%)
            fluctuation = random.uniform(-0.04, 0.04)
            value = base_value * (1 + fluctuation)
            db.session.add(InvestmentHistory(
                user_id=marcus.user_id,
                date=date,
                portfolio_value=round(value, 2)
            ))
        
        # Emma (low risk): Starting at £480, ending at £546 (+13.75% growth)
        emma_start = 480.0
        emma_end = 546.0
        emma_growth = (emma_end - emma_start) / emma_start  # ~13.75%
        
        for day_offset in range(30):
            date = today - timedelta(days=day_offset)
            progress = (30 - day_offset) / 30
            base_value = emma_start + (emma_growth * emma_start * progress)
            # Add low daily fluctuations (±0.5%)
            fluctuation = random.uniform(-0.005, 0.005)
            value = base_value * (1 + fluctuation)
            db.session.add(InvestmentHistory(
                user_id=emma.user_id,
                date=date,
                portfolio_value=round(value, 2)
            ))
        
        db.session.commit()
        print("✅ Database seeded with dummy data!")

if __name__ == '__main__':
    seed_dummy_data()

