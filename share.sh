#!/bin/bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT_DIR"

BACKEND_PORT=${BACKEND_PORT:-3001}
FRONTEND_PORT=${FRONTEND_PORT:-5173}

cleanup() {
  echo ""
  echo "🛑 Shutting down..."
  if [[ -n "${TAIL_PID:-}" ]]; then kill "$TAIL_PID" 2>/dev/null || true; fi
  if [[ -n "${TUNNEL_PID:-}" ]]; then kill "$TUNNEL_PID" 2>/dev/null || true; fi
  if [[ -n "${VITE_PID:-}" ]]; then kill "$VITE_PID" 2>/dev/null || true; fi
  if [[ -n "${BACKEND_PID:-}" ]]; then kill "$BACKEND_PID" 2>/dev/null || true; fi
}
trap cleanup EXIT

echo "🧹 Cleaning up old processes..."
pkill -f "cloudflared" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true
pkill -f "src/server.js" 2>/dev/null || true
sleep 1

if [ ! -d "server/node_modules" ]; then
  echo "📦 Installing backend dependencies..."
  (cd server && npm install)
fi

if [ ! -d "node_modules" ]; then
  echo "📦 Installing frontend dependencies..."
  npm install
fi

echo "🚀 Starting backend on port ${BACKEND_PORT}..."
(cd server && PORT=$BACKEND_PORT npm run dev > /tmp/zuno-backend.log 2>&1 &)
BACKEND_PID=$!

for i in {1..20}; do
  if lsof -i :$BACKEND_PORT >/dev/null 2>&1; then
    echo "   ✅ Backend ready (logs: /tmp/zuno-backend.log)"
    break
  fi
  sleep 1
done

if ! lsof -i :$BACKEND_PORT >/dev/null 2>&1; then
  echo "❌ Backend failed to start. Check /tmp/zuno-backend.log"
  exit 1
fi

echo "⚙️  Starting frontend dev server on port ${FRONTEND_PORT}..."
(PORT=$FRONTEND_PORT VITE_API_URL=/api npm run dev > /tmp/vite.log 2>&1 &)
VITE_PID=$!

for i in {1..15}; do
  if lsof -i :$FRONTEND_PORT >/dev/null 2>&1; then
    echo "   ✅ Frontend ready (logs: /tmp/vite.log)"
    break
  fi
  sleep 1
done

if ! lsof -i :$FRONTEND_PORT >/dev/null 2>&1; then
  echo "❌ Frontend failed to start. Check /tmp/vite.log"
  exit 1
fi

echo ""
echo "🌐 Creating public tunnel..."
cloudflared tunnel --url http://localhost:$FRONTEND_PORT > /tmp/tunnel.log 2>&1 &
TUNNEL_PID=$!

sleep 6
URL=$(grep -oE "https://[a-z0-9-]+\.trycloudflare\.com" /tmp/tunnel.log 2>/dev/null | head -1 || true)

if [[ -z "${URL}" ]]; then
  echo "❌ Could not retrieve tunnel URL. Check /tmp/tunnel.log"
  exit 1
fi

echo ""
echo "════════════════════════════════════════════════════════════"
echo "  ✅ YOUR PUBLIC URL (share with anyone):"
echo "  ${URL}"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "Frontend logs  : tail -f /tmp/vite.log"
echo "Backend logs   : tail -f /tmp/zuno-backend.log"
echo "Tunnel logs    : tail -f /tmp/tunnel.log"
echo "Press Ctrl+C to stop everything."
echo ""

tail -f /tmp/tunnel.log &
TAIL_PID=$!

wait $TUNNEL_PID
