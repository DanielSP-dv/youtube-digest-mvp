#!/usr/bin/env bash
set -e
trap 'kill 0' EXIT

echo "🚀 Starting YouTube Digest MVP Sandbox..."
echo "📦 Building client..."
cd client && npm install && npm run build
cd ..

echo "🌐 Starting backend server on port 5001..."
node server.js &
BACKEND_PID=$!

echo "🎨 Starting frontend dev server on port 3000..."
cd client && npm start &
FRONTEND_PID=$!

echo "✅ Sandbox is running!"
echo "🔗 Frontend: http://localhost:3000"
echo "🔗 Backend: http://localhost:5001"
echo "📊 API: http://localhost:5001/api"
echo ""
echo "Press Ctrl+C to stop all services"

wait
