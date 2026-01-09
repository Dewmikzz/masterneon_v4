#!/bin/bash
# Script to add all environment variables to Vercel at once
# Usage: ./add-vercel-env.sh

echo "🚀 Adding environment variables to Vercel..."
echo ""

# Make sure you're logged in to Vercel CLI
# Run: vercel login (if not already logged in)

# Add each variable for all environments (Production, Preview, Development)
vercel env add DESIGNER_EMAIL production preview development <<< "denuwanyasanga9@gmail.com"
vercel env add SMTP_HOST production preview development <<< "smtp.gmail.com"
vercel env add SMTP_PORT production preview development <<< "465"
vercel env add SMTP_USER production preview development <<< "masterneonweb@gmail.com"
vercel env add SMTP_PASS production preview development <<< "yijiukrobphbbewj"
vercel env add ALLOW_ORIGINS production preview development <<< "https://your-project.vercel.app,http://localhost:5173"
vercel env add MONGO_URI production preview development <<< "mongodb+srv://masterneonweb_db_user:zaENG4gt0rZHES8V@masterneon.yis7ked.mongodb.net/?appName=MasterNeon"
vercel env add JWT_SECRET production preview development <<< "your_jwt_secret_key_change_this_in_production"

echo ""
echo "✅ All environment variables added!"
echo "📝 Note: Update ALLOW_ORIGINS with your actual Vercel domain after first deployment"

