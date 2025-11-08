#!/bin/bash

# Zuno Deployment Script
# This script helps you deploy Zuno to the cloud

echo "🚀 Zuno Cloud Deployment Helper"
echo "================================"
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

echo "Choose deployment option:"
echo "1) Deploy Backend to Vercel"
echo "2) Deploy Frontend to Vercel"
echo "3) Deploy Both"
echo "4) Setup MongoDB Atlas (Guide)"
read -p "Enter choice (1-4): " choice

case $choice in
    1)
        echo "🔧 Deploying Backend..."
        cd server
        vercel
        ;;
    2)
        echo "🔧 Deploying Frontend..."
        vercel
        ;;
    3)
        echo "🔧 Deploying Backend..."
        cd server
        vercel
        echo ""
        echo "🔧 Deploying Frontend..."
        cd ..
        vercel
        ;;
    4)
        echo "📖 MongoDB Atlas Setup Guide:"
        echo "1. Go to: https://www.mongodb.com/cloud/atlas"
        echo "2. Create free account"
        echo "3. Create free cluster"
        echo "4. Create database user"
        echo "5. Whitelist IP (Allow from anywhere)"
        echo "6. Get connection string"
        echo "7. Use connection string in Vercel environment variables"
        ;;
    *)
        echo "Invalid choice"
        ;;
esac

echo ""
echo "✅ Done! Check QUICK_DEPLOY.md for detailed instructions"

