# 🔐 Adding Environment Variables to Vercel - All Methods

## Method 1: Vercel Dashboard (One by One) ✅ Easiest

**This is the standard method - you add each variable individually:**

1. Go to: **Vercel Dashboard** → **Your Project** → **Settings** → **Environment Variables**
2. Click **"Add New"**
3. Enter:
   - **Key**: `DESIGNER_EMAIL`
   - **Value**: `denuwanyasanga9@gmail.com`
   - **Environments**: Select all (Production, Preview, Development)
4. Click **"Save"**
5. Repeat for each variable

**Pros:**
- ✅ Easy and visual
- ✅ No CLI needed
- ✅ Can see all variables in one place

**Cons:**
- ⏱️ Takes a few minutes to add all 8 variables

---

## Method 2: Vercel CLI (Bulk Add) ⚡ Faster

**Add all variables at once using command line:**

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```

### Step 3: Link Your Project
```bash
cd masterneonweb-main/Project
vercel link
```
- Select your existing project or create new
- Follow the prompts

### Step 4: Add Variables

**Option A: Use the PowerShell Script (Windows)**
```powershell
.\add-vercel-env.ps1
```

**Option B: Use the Bash Script (Mac/Linux)**
```bash
chmod +x add-vercel-env.sh
./add-vercel-env.sh
```

**Option C: Add Manually via CLI**
```bash
# Add each variable (you'll be prompted for the value)
vercel env add DESIGNER_EMAIL production preview development
# When prompted, enter: denuwanyasanga9@gmail.com

vercel env add SMTP_HOST production preview development
# When prompted, enter: smtp.gmail.com

vercel env add SMTP_PORT production preview development
# When prompted, enter: 465

vercel env add SMTP_USER production preview development
# When prompted, enter: masterneonweb@gmail.com

vercel env add SMTP_PASS production preview development
# When prompted, enter: yijiukrobphbbewj

vercel env add ALLOW_ORIGINS production preview development
# When prompted, enter: https://your-project.vercel.app,http://localhost:5173

vercel env add MONGO_URI production preview development
# When prompted, enter: mongodb+srv://masterneonweb_db_user:zaENG4gt0rZHES8V@masterneon.yis7ked.mongodb.net/?appName=MasterNeon

vercel env add JWT_SECRET production preview development
# When prompted, enter: your_jwt_secret_key_change_this_in_production
```

**Option D: Add with Values in One Command (PowerShell)**
```powershell
echo "denuwanyasanga9@gmail.com" | vercel env add DESIGNER_EMAIL production preview development
echo "smtp.gmail.com" | vercel env add SMTP_HOST production preview development
echo "465" | vercel env add SMTP_PORT production preview development
echo "masterneonweb@gmail.com" | vercel env add SMTP_USER production preview development
echo "yijiukrobphbbewj" | vercel env add SMTP_PASS production preview development
echo "https://your-project.vercel.app,http://localhost:5173" | vercel env add ALLOW_ORIGINS production preview development
echo "mongodb+srv://masterneonweb_db_user:zaENG4gt0rZHES8V@masterneon.yis7ked.mongodb.net/?appName=MasterNeon" | vercel env add MONGO_URI production preview development
echo "your_jwt_secret_key_change_this_in_production" | vercel env add JWT_SECRET production preview development
```

**Pros:**
- ⚡ Faster - add all at once
- ✅ Can automate with scripts
- ✅ Good for CI/CD

**Cons:**
- ❌ Requires CLI installation
- ❌ Need to run commands

---

## Method 3: Import from .env File (Not Directly Supported)

**Vercel doesn't support direct .env file upload in the dashboard**, but you can:

### Option A: Use Vercel CLI with .env file
```bash
# Create a .env file with your variables
# Then use vercel env pull to see format, or add manually via CLI
```

### Option B: Use a Script to Read .env and Add to Vercel
```bash
# Read .env file and add each variable
while IFS='=' read -r key value; do
  if [[ ! $key =~ ^# ]]; then
    echo "$value" | vercel env add "$key" production preview development
  fi
done < .env
```

---

## 📋 Quick Reference: All Your Variables

Copy-paste this list when adding via Dashboard:

| Key | Value |
|-----|-------|
| `DESIGNER_EMAIL` | `denuwanyasanga9@gmail.com` |
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `465` |
| `SMTP_USER` | `masterneonweb@gmail.com` |
| `SMTP_PASS` | `yijiukrobphbbewj` |
| `ALLOW_ORIGINS` | `https://your-project.vercel.app,http://localhost:5173` |
| `MONGO_URI` | `mongodb+srv://masterneonweb_db_user:zaENG4gt0rZHES8V@masterneon.yis7ked.mongodb.net/?appName=MasterNeon` |
| `JWT_SECRET` | `your_jwt_secret_key_change_this_in_production` |

---

## ✅ Recommended Method

**For beginners:** Use **Method 1 (Dashboard)** - it's the easiest and most visual.

**For faster setup:** Use **Method 2 (CLI with script)** - run the PowerShell script once.

---

## 🔄 After Adding Variables

1. Go to **Deployments** tab
2. Click **"Redeploy"** on latest deployment
3. Or push a new commit to trigger auto-deploy

---

## 🆘 Troubleshooting

### CLI Command Not Found
- Install Vercel CLI: `npm install -g vercel`
- Make sure Node.js is installed

### Variables Not Showing
- Make sure you selected the correct environments
- Redeploy after adding variables

### Script Not Working
- Make sure you're in the Project directory
- Run `vercel login` first
- Run `vercel link` to connect to your project

