#!/bin/bash
cd "$(dirname "$0")"

# Kill any existing processes
echo "🧹 Cleaning up old processes..."
pkill -9 cloudflared 2>/dev/null
pkill -9 vite 2>/dev/null
sleep 2

# Start dev server
echo "🚀 Starting dev server on port 5173..."
npm run dev > /tmp/vite.log 2>&1 &
VITE_PID=$!

# Wait for server to be ready
echo "⏳ Waiting for server to start..."
sleep 5

# Check if server started
if ! lsof -i :5173 > /dev/null 2>&1; then
  echo "❌ Server failed to start. Check /tmp/vite.log"
  exit 1
fi

echo "✅ Dev server is running!"
echo ""
echo "🌐 Creating public tunnel..."
echo ""

# Start tunnel (this will run in foreground so you can see the URL)
cloudflared tunnel --url http://localhost:5173

# Cleanup on exit
echo ""
echo "🛑 Stopping dev server..."
kill $VITE_PID 2>/dev/null

