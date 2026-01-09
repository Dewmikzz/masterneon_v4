# PowerShell script to add all environment variables to Vercel
# Usage: .\add-vercel-env.ps1

Write-Host "🚀 Adding environment variables to Vercel..." -ForegroundColor Green
Write-Host ""

# Make sure you're logged in to Vercel CLI first
# Run: vercel login (if not already logged in)

# Navigate to project directory
Set-Location $PSScriptRoot

# Add each variable for all environments
Write-Host "Adding DESIGNER_EMAIL..." -ForegroundColor Yellow
echo "denuwanyasanga9@gmail.com" | vercel env add DESIGNER_EMAIL production preview development

Write-Host "Adding SMTP_HOST..." -ForegroundColor Yellow
echo "smtp.gmail.com" | vercel env add SMTP_HOST production preview development

Write-Host "Adding SMTP_PORT..." -ForegroundColor Yellow
echo "465" | vercel env add SMTP_PORT production preview development

Write-Host "Adding SMTP_USER..." -ForegroundColor Yellow
echo "masterneonweb@gmail.com" | vercel env add SMTP_USER production preview development

Write-Host "Adding SMTP_PASS..." -ForegroundColor Yellow
echo "yijiukrobphbbewj" | vercel env add SMTP_PASS production preview development

Write-Host "Adding ALLOW_ORIGINS..." -ForegroundColor Yellow
echo "https://your-project.vercel.app,http://localhost:5173" | vercel env add ALLOW_ORIGINS production preview development

Write-Host "Adding MONGO_URI..." -ForegroundColor Yellow
echo "mongodb+srv://masterneonweb_db_user:zaENG4gt0rZHES8V@masterneon.yis7ked.mongodb.net/?appName=MasterNeon" | vercel env add MONGO_URI production preview development

Write-Host "Adding JWT_SECRET..." -ForegroundColor Yellow
echo "your_jwt_secret_key_change_this_in_production" | vercel env add JWT_SECRET production preview development

Write-Host ""
Write-Host "✅ All environment variables added!" -ForegroundColor Green
Write-Host "📝 Note: Update ALLOW_ORIGINS with your actual Vercel domain after first deployment" -ForegroundColor Cyan

