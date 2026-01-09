# 🚀 Deploy to Vercel - Step by Step

## Quick Deployment Guide

### Step 1: Go to Vercel
1. Visit: **https://vercel.com**
2. Click **"Sign Up"** or **"Log In"**
3. Sign in with your **GitHub account** (recommended)

### Step 2: Import Your Project
1. Click **"Add New..."** button (top right)
2. Select **"Project"**
3. You'll see your GitHub repositories
4. Find and click on **"Dewmikzz/master_neon"**
5. Click **"Import"**

### Step 3: Configure Project Settings

**Important Settings:**

1. **Root Directory**: 
   - Click **"Edit"** next to Root Directory
   - Enter: `Project`
   - Click **"Continue"**

2. **Framework Preset**: 
   - Should auto-detect as **"Vite"**
   - If not, select **"Vite"** manually

3. **Build Command**: 
   - Should auto-fill, but verify it's: `cd client && npm install && npm run build`
   - If not, enter it manually

4. **Output Directory**: 
   - Should auto-fill: `client/dist`
   - If not, enter it manually

5. **Install Command** (optional, but recommended):
   - Enter: `cd client && npm install && cd ../server && npm install && cd ../api && npm install`

### Step 4: Add Environment Variables

Click **"Environment Variables"** and add the following:

**Required Variables:**

1. **DESIGNER_EMAIL**
   - Value: `denuwanyasanga9@gmail.com`

2. **SMTP_HOST**
   - Value: `smtp.gmail.com`

3. **SMTP_PORT**
   - Value: `465`

4. **SMTP_USER**
   - Value: `masterneonweb@gmail.com`

5. **SMTP_PASS**
   - Value: `yijiukrobphbbewj`

6. **ALLOW_ORIGINS**
   - Value: `https://your-project.vercel.app,http://localhost:5173`
   - **Note:** Replace `your-project.vercel.app` with your actual Vercel domain after first deployment

**Optional Variables:**

7. **MONGO_URI** (if using database)
   - Value: `mongodb+srv://masterneonweb_db_user:zaENG4gt0rZHES8V@masterneon.yis7ked.mongodb.net/?appName=MasterNeon`

8. **JWT_SECRET** (for future authentication)
   - Value: `your_jwt_secret_key_change_this_in_production`
   - **Note:** Change to a secure random string

**For each variable:**
- Click **"Add New"**
- Enter Name and Value
- Select all environments: **Production**, **Preview**, **Development**
- Click **"Save"**

**📖 See `VERCEL_ENV_VARIABLES.md` for detailed instructions.**

### Step 5: Deploy!

1. Click **"Deploy"** button
2. Wait 2-5 minutes for build to complete
3. You'll see a success message with your live URL!

### Step 6: Verify Deployment

1. **Visit your live site**: `https://your-project.vercel.app`
2. **Test API**: Visit `https://your-project.vercel.app/api/health`
   - Should return: `{"status":"ok","timestamp":"..."}`
3. **Test the app**: Navigate through pages, test forms

## 🎯 Your Repository

**GitHub**: https://github.com/Dewmikzz/master_neon

**Vercel will automatically:**
- ✅ Detect your API functions in `/api` folder
- ✅ Build your React frontend
- ✅ Deploy everything to a live URL

## 🆘 Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Verify Root Directory is set to `Project`
- Make sure all dependencies are in package.json files

### API Routes Not Working
- Check Functions tab in Vercel dashboard
- Verify API files are in `api/` folder
- Check function logs for errors

### Email Not Sending
- Verify environment variables are set correctly
- Check function logs for SMTP errors
- Make sure Gmail App Password is correct (not regular password)

## ✅ After Deployment

Your site will be live at: `https://your-project.vercel.app`

**Features that work:**
- ✅ Frontend (React + Vite)
- ✅ API Routes (Serverless Functions)
- ✅ Email Sending (if configured)
- ✅ PDF Generation
- ✅ All app features

---

**Need help?** Check `DEPLOYMENT.md` for detailed troubleshooting.

