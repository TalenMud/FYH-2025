# Quick Backend Test Script for Windows
Write-Host "🚀 Setting up backend for testing..." -ForegroundColor Green

# Check if we're in the right directory
if (-Not (Test-Path "backend\app.py")) {
    Write-Host "❌ Error: Please run this script from the project root directory" -ForegroundColor Red
    exit 1
}

# Navigate to backend
Set-Location backend

# Check if virtual environment exists
if (-Not (Test-Path "venv")) {
    Write-Host "📦 Creating virtual environment..." -ForegroundColor Yellow
    python -m venv venv
}

# Activate virtual environment
Write-Host "🔧 Activating virtual environment..." -ForegroundColor Yellow
& .\venv\Scripts\Activate.ps1

# Install dependencies
Write-Host "📥 Installing dependencies..." -ForegroundColor Yellow
pip install -r requirements.txt

# Set environment variable for SQLite (quick testing)
$env:USE_SQLITE = "true"
$env:JWT_SECRET = "test-secret-key-for-development"
$env:FLASK_ENV = "development"

# Initialize database
Write-Host "🗄️  Initializing database..." -ForegroundColor Yellow
python init_db.py

# Start server
Write-Host "✅ Starting server on http://localhost:5000" -ForegroundColor Green
Write-Host "📝 Test the API at: http://localhost:5000/health" -ForegroundColor Cyan
Write-Host "🛑 Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

python app.py

