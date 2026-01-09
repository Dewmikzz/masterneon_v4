# ⚡ Quick Start: Deploy to Vercel

## 🚀 Fast Deployment (5 minutes)

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### Step 2: Deploy on Vercel

1. **Go to [vercel.com](https://vercel.com)** and sign in with GitHub

2. **Click "Add New..." → "Project"**

3. **Import your repository**

4. **Configure Project:**
   - **Root Directory**: `masterneonweb-main/Project` (or `Project` if that's your root)
   - **Framework**: Vite (auto-detected)
   - **Build Command**: `cd client && npm install && npm run build`
   - **Output Directory**: `client/dist`

5. **Add Environment Variables** (click "Environment Variables"):
   ```
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   DESIGNER_EMAIL=designer@masterneon.com
   ```

6. **Click "Deploy"**

### Step 3: Done! 🎉

Your site will be live at: `https://your-project.vercel.app`

---

## 📧 Email Setup (Gmail)

1. Enable 2FA on Gmail
2. Go to: Google Account → Security → App Passwords
3. Create password for "Mail"
4. Use that 16-character password as `SMTP_PASS`

---

## 📖 Full Instructions

See `DEPLOYMENT.md` for detailed instructions and troubleshooting.

