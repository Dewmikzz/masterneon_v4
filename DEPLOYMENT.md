# 🚀 Vercel Deployment Guide

This guide will walk you through deploying the Master Neon project to Vercel.

## 📋 Prerequisites

1. **GitHub Account** - Your code should be in a GitHub repository
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com) (free tier available)
3. **Email Service** (Optional) - For email notifications:
   - Gmail with App Password, OR
   - SendGrid account

## 🔧 Step 1: Prepare Your Repository

1. Make sure all your code is committed and pushed to GitHub:
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

## 🌐 Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com)
   - Sign in with your GitHub account

2. **Import Your Project**
   - Click "Add New..." → "Project"
   - Select your GitHub repository
   - Click "Import"

3. **Configure Project Settings**
   - **Root Directory**: Set to `masterneonweb-main/Project` (or just `Project` if that's your root)
   - **Framework Preset**: Vite (should auto-detect)
   - **Build Command**: `cd client && npm install && npm run build`
   - **Output Directory**: `client/dist`
   - **Install Command**: `cd client && npm install`

4. **Environment Variables**
   Click "Environment Variables" and add:
   
   **Required (for email functionality):**
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password
   DESIGNER_EMAIL=designer@masterneon.com
   ```
   
   **Optional (for SendGrid instead of SMTP):**
   ```
   SENDGRID_API_KEY=your_sendgrid_api_key
   ```
   
   **Optional (for MongoDB - if you want database):**
   ```
   MONGO_URI=your_mongodb_connection_string
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete (usually 2-5 minutes)

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Navigate to Project Root**
   ```bash
   cd masterneonweb-main/Project
   ```

4. **Deploy**
   ```bash
   vercel
   ```
   
   Follow the prompts:
   - Link to existing project or create new
   - Set root directory to `Project` (or current directory)
   - Confirm settings

5. **Set Environment Variables**
   ```bash
   vercel env add SMTP_USER
   vercel env add SMTP_PASS
   vercel env add DESIGNER_EMAIL
   # ... add other variables as needed
   ```

6. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## ✅ Step 3: Verify Deployment

1. **Check Your Deployment**
   - Vercel will provide you with a URL like: `https://your-project.vercel.app`
   - Visit the URL to see your live site

2. **Test API Endpoints**
   - Health check: `https://your-project.vercel.app/api/health`
   - Should return: `{"status":"ok","timestamp":"..."}`

3. **Test Frontend**
   - Navigate through your site
   - Try submitting a contact form
   - Try creating a neon design request

## 🔄 Step 4: Update Frontend API URL (If Needed)

The frontend is configured to use relative API paths (`/api`), which should work automatically on Vercel. However, if you need to override it:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add:
   ```
   VITE_API_URL=https://your-project.vercel.app/api
   ```
3. Redeploy

## 📧 Step 5: Configure Email (Important!)

### Option A: Gmail Setup

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account → Security → 2-Step Verification → App passwords
   - Create app password for "Mail"
   - Copy the 16-character password
3. **Add to Vercel Environment Variables**:
   ```
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_16_char_app_password
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   DESIGNER_EMAIL=designer@masterneon.com
   ```

### Option B: SendGrid Setup

1. **Sign up for SendGrid** (free tier: 100 emails/day)
2. **Create API Key**:
   - Go to SendGrid Dashboard → Settings → API Keys
   - Create API Key with "Full Access"
   - Copy the key
3. **Add to Vercel Environment Variables**:
   ```
   SENDGRID_API_KEY=your_sendgrid_api_key
   SMTP_USER=your_verified_sender_email@domain.com
   DESIGNER_EMAIL=designer@masterneon.com
   ```

## 🎯 Project Structure for Vercel

```
Project/
├── api/                    # Vercel serverless functions
│   ├── neon-request.js
│   ├── contact.js
│   └── health.js
├── client/                 # React frontend
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
├── server/                 # Backend code (used by API functions)
│   └── src/
│       └── services/
├── vercel.json            # Vercel configuration
└── DEPLOYMENT.md          # This file
```

## 🐛 Troubleshooting

### Build Fails

1. **Check Build Logs** in Vercel Dashboard
2. **Common Issues**:
   - Missing dependencies → Check `package.json`
   - TypeScript errors → Run `npm run build` locally first
   - Path issues → Verify `vercel.json` configuration

### API Routes Not Working

1. **Check API Functions**:
   - Go to Vercel Dashboard → Your Project → Functions
   - Check for errors in function logs

2. **Verify Routes**:
   - API routes should be in `/api` folder
   - Function names match route paths

### Email Not Sending

1. **Check Environment Variables**:
   - Verify all SMTP variables are set
   - Check for typos in email addresses

2. **Check Function Logs**:
   - Go to Vercel Dashboard → Your Project → Functions → View Logs
   - Look for email-related errors

3. **Test Locally First**:
   - Set up `.env` file locally
   - Test email sending before deploying

## 🔐 Security Notes

- **Never commit** `.env` files to Git
- Use Vercel Environment Variables for secrets
- Gmail App Passwords are safer than regular passwords
- SendGrid API keys should have limited permissions

## 📝 Next Steps

1. **Custom Domain** (Optional):
   - Go to Vercel Dashboard → Your Project → Settings → Domains
   - Add your custom domain

2. **Analytics** (Optional):
   - Enable Vercel Analytics in project settings

3. **Monitoring**:
   - Set up error tracking (Sentry, etc.)
   - Monitor API function performance

## 🎉 Success!

Your Master Neon application should now be live on Vercel! 

**Your site URL**: `https://your-project.vercel.app`

For support, check:
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)

---

**Note**: The first deployment may take a few minutes. Subsequent deployments (after git pushes) are usually much faster.

