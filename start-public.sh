#!/bin/bash
cd "$(dirname "$0")"

# Kill any existing processes
pkill -f "vite|cloudflared" 2>/dev/null
sleep 2

# Start dev server in background
echo "🚀 Starting dev server..."
npm run dev > /tmp/vite.log 2>&1 &
VITE_PID=$!

# Wait for server to be ready
sleep 5

# Start tunnel
echo "🌐 Creating public tunnel..."
echo ""
echo "=========================================="
echo "  Your site is starting..."
echo "  Waiting for public URL..."
echo "=========================================="
echo ""

cloudflared tunnel --url http://localhost:5173 2>&1 | while IFS= read -r line; do
  echo "$line"
  if [[ "$line" == *"https://"*"trycloudflare.com"* ]]; then
    URL=$(echo "$line" | grep -oE "https://[a-z0-9-]+\.trycloudflare\.com" | head -1)
    if [ ! -z "$URL" ]; then
      echo ""
      echo "✅ SUCCESS! Share this URL with your groupmates:"
      echo "   $URL"
      echo ""
      echo "Press Ctrl+C to stop both the server and tunnel"
      echo ""
    fi
  fi
done

# Cleanup on exit
kill $VITE_PID 2>/dev/null

