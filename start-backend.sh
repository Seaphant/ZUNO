#!/bin/bash

# Start Zuno Backend Server

cd "$(dirname "$0")/server"

echo "🚀 Starting Zuno Backend Server..."
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  Creating .env file..."
    cat > .env << 'EOF'
MONGODB_URI=mongodb://localhost:27017/zuno
PORT=3001
NODE_ENV=development
EOF
fi

# Check if node_modules exists
if [ ! -d node_modules ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB doesn't appear to be running"
    echo "   Start MongoDB with: brew services start mongodb-community"
    echo "   Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas"
    echo ""
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Start server
echo "✅ Starting server on http://localhost:3001"
echo ""
npm run dev

