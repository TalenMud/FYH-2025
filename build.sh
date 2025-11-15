#!/bin/bash

set -e

echo "🚀 Building Screen Time Investment Tracker..."

# Build backend
echo "📦 Building backend..."
cd backend
pip install -r requirements.txt
cd ..

# Build frontend
echo "📦 Building frontend..."
cd frontend
npm install
npm run build
cd ..

echo "✅ Build complete!"

