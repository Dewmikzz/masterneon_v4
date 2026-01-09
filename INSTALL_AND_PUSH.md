# 🚀 Install Git & Push to GitHub - Complete Guide

## ⚠️ Current Situation
Git is not installed on your system. I cannot push to GitHub without Git installed.

## ✅ Solution: Install Git & Push (5 minutes)

### Step 1: Install Git (2 minutes)

1. **Download Git for Windows**:
   - Go to: https://git-scm.com/download/win
   - Click "Download for Windows"
   - Run the installer

2. **Installation Settings** (use defaults):
   - Click "Next" through all prompts
   - Use default editor (Vim or your choice)
   - Use default line ending (Checkout Windows, commit Unix)
   - Use bundled OpenSSH
   - Use OpenSSL library
   - Use MinTTY
   - Default for everything else
   - Click "Install"

3. **Restart your terminal/PowerShell** after installation

### Step 2: Verify Installation

Open a **NEW** PowerShell window and run:
```powershell
git --version
```

You should see something like: `git version 2.x.x`

### Step 3: Navigate to Your Project

```powershell
cd "C:\Users\User™\Downloads\masterneonweb-main\masterneonweb-main\Project"
```

### Step 4: Run the Push Script

**Option A: Use the batch file (Easiest)**
```powershell
.\push-to-github.bat
```

**Option B: Use PowerShell script**
```powershell
.\push-to-github.ps1
```

**Option C: Manual commands**
```powershell
git init
git remote add origin https://github.com/denuwan9/masterneonweb.git
git add .
git commit -m "Initial commit: Master Neon project with Vercel deployment setup"
git branch -M main
git push -u origin main
```

### Step 5: Authenticate

When prompted:
- **Username**: Your GitHub username (denuwan9)
- **Password**: Use a **Personal Access Token** (NOT your GitHub password)

**To create a Personal Access Token:**
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Name it: "Master Neon Project"
4. Select scope: ✅ **repo** (full control)
5. Click "Generate token"
6. **Copy the token immediately** (you won't see it again!)
7. Paste it when Git asks for password

## 🎯 Alternative: Use GitHub Desktop (No Command Line!)

If you prefer a GUI:

1. **Download GitHub Desktop**: https://desktop.github.com/
2. **Install and sign in** with your GitHub account
3. **Add Repository**:
   - Click "File" → "Add Local Repository"
   - Browse to: `C:\Users\User™\Downloads\masterneonweb-main\masterneonweb-main\Project`
   - Click "Add Repository"
4. **Commit and Push**:
   - You'll see all your files
   - Write commit message: "Initial commit: Master Neon project with Vercel deployment setup"
   - Click "Commit to main"
   - Click "Publish repository" or "Push origin"

## ✅ After Pushing

Once uploaded, verify at: https://github.com/denuwan9/masterneonweb

You should see:
- ✅ All project files
- ✅ `api/` folder with serverless functions
- ✅ `client/` folder with React app
- ✅ `server/` folder with backend code
- ✅ `vercel.json` configuration
- ✅ All documentation files

## 🚀 Next Step: Deploy to Vercel

After pushing to GitHub, you can deploy to Vercel:

1. Go to: https://vercel.com
2. Sign in with GitHub
3. Click "Add New..." → "Project"
4. Select your repository: `denuwan9/masterneonweb`
5. Configure:
   - **Root Directory**: `Project`
   - **Build Command**: `cd client && npm install && npm run build && cd ../server && npm install`
   - **Output Directory**: `client/dist`
6. Add environment variables (see `DEPLOYMENT.md`)
7. Click "Deploy"

## 🆘 Troubleshooting

### "git: command not found"
- Git is not installed or not in PATH
- Restart terminal after installing Git
- Or use full path: `C:\Program Files\Git\bin\git.exe`

### "Authentication failed"
- Use Personal Access Token, not password
- Make sure token has `repo` scope

### "Repository not found"
- Check you have access to: https://github.com/denuwan9/masterneonweb
- Verify repository exists

### "Remote origin already exists"
```powershell
git remote remove origin
git remote add origin https://github.com/denuwan9/masterneonweb.git
```

---

**Quick Summary:**
1. Install Git: https://git-scm.com/download/win
2. Restart terminal
3. Run: `.\push-to-github.bat`
4. Authenticate with Personal Access Token
5. Done! ✅

