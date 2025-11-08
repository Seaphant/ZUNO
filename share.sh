#!/bin/bash
cd "$(dirname "$0")"

# Kill old processes
echo "🧹 Cleaning up..."
pkill -9 cloudflared 2>/dev/null
pkill -9 vite 2>/dev/null
pkill -9 node 2>/dev/null
lsof -ti:5173,5174,5175 2>/dev/null | xargs kill -9 2>/dev/null
sleep 2

echo "🚀 Starting dev server on port 5173..."
PORT=5173 npm run dev > /tmp/vite.log 2>&1 &
VITE_PID=$!

echo "⏳ Waiting for server to start..."
for i in {1..10}; do
  if lsof -i :5173 > /dev/null 2>&1; then
    echo "✅ Server is ready on port 5173!"
    break
  fi
  sleep 1
done

# Check if server started
if ! lsof -i :5173 > /dev/null 2>&1; then
  echo "❌ Server failed to start. Check /tmp/vite.log"
  kill $VITE_PID 2>/dev/null
  exit 1
fi

echo ""
echo "🌐 Creating public tunnel..."
echo ""

# Start tunnel in background and capture URL
cloudflared tunnel --url http://localhost:5173 > /tmp/tunnel.log 2>&1 &
TUNNEL_PID=$!

# Wait for URL
sleep 8
URL=$(grep -oE "https://[a-z0-9-]+\.trycloudflare\.com" /tmp/tunnel.log 2>/dev/null | head -1)

if [ ! -z "$URL" ]; then
  echo ""
  echo "════════════════════════════════════════════════════════════"
  echo "  ✅ YOUR PUBLIC URL (share with everyone):"
  echo "  $URL"
  echo "════════════════════════════════════════════════════════════"
  echo ""
  echo "Server and tunnel are running in the background."
  echo "Press Ctrl+C to stop, or run: pkill -9 cloudflared vite"
  echo ""
  echo "Tunnel output: tail -f /tmp/tunnel.log"
  echo ""
  
  # Keep script running
  wait $TUNNEL_PID
else
  echo "❌ Could not get tunnel URL. Check /tmp/tunnel.log"
  kill $VITE_PID $TUNNEL_PID 2>/dev/null
  exit 1
fi

# Cleanup on exit
trap "kill $VITE_PID $TUNNEL_PID 2>/dev/null; exit" INT TERM
wait

