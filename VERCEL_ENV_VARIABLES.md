# 🔐 Vercel Environment Variables Setup

## Your Environment Variables

Add these to your Vercel project:

### Step 1: Go to Vercel Dashboard
1. Visit: https://vercel.com
2. Select your project: `master_neon`
3. Go to **Settings** → **Environment Variables**

### Step 2: Add Each Variable

Click **"Add New"** for each variable below:

#### 1. DESIGNER_EMAIL
```
Name: DESIGNER_EMAIL
Value: denuwanyasanga9@gmail.com
Environment: Production, Preview, Development (select all)
```

#### 2. SMTP_HOST
```
Name: SMTP_HOST
Value: smtp.gmail.com
Environment: Production, Preview, Development (select all)
```

#### 3. SMTP_PORT
```
Name: SMTP_PORT
Value: 465
Environment: Production, Preview, Development (select all)
```

#### 4. SMTP_USER
```
Name: SMTP_USER
Value: masterneonweb@gmail.com
Environment: Production, Preview, Development (select all)
```

#### 5. SMTP_PASS
```
Name: SMTP_PASS
Value: yijiukrobphbbewj
Environment: Production, Preview, Development (select all)
```

#### 6. ALLOW_ORIGINS
```
Name: ALLOW_ORIGINS
Value: https://your-project.vercel.app,http://localhost:5173
Environment: Production, Preview, Development (select all)
```
**Note:** Replace `your-project.vercel.app` with your actual Vercel domain after deployment.

#### 7. JWT_SECRET (Optional - for future features)
```
Name: JWT_SECRET
Value: your_jwt_secret_key_change_this_in_production
Environment: Production, Preview, Development (select all)
```
**Note:** Change this to a secure random string in production.

#### 8. MONGO_URI (Optional - if you want database)
```
Name: MONGO_URI
Value: mongodb+srv://masterneonweb_db_user:zaENG4gt0rZHES8V@masterneon.yis7ked.mongodb.net/?appName=MasterNeon
Environment: Production, Preview, Development (select all)
```

#### 9. PORT (Optional - Vercel handles this automatically)
```
Name: PORT
Value: 5000
Environment: Production, Preview, Development (select all)
```
**Note:** Vercel automatically sets PORT, but you can add this if needed.

## 📝 Quick Copy-Paste Guide

1. Go to: **Vercel Dashboard** → **Your Project** → **Settings** → **Environment Variables**

2. Add each variable one by one:
   - Click **"Add New"**
   - Enter Name and Value
   - Select all environments (Production, Preview, Development)
   - Click **"Save"**

3. After adding all variables:
   - Go to **Deployments** tab
   - Click **"Redeploy"** on the latest deployment
   - Or push a new commit to trigger redeploy

## ✅ Verification

After adding variables and redeploying:

1. **Test API Health**: 
   - Visit: `https://your-project.vercel.app/api/health`
   - Should return: `{"status":"ok","timestamp":"..."}`

2. **Test Email**:
   - Submit a contact form or design request
   - Check Vercel function logs for email sending status
   - Email should be sent to: `denuwanyasanga9@gmail.com`

## 🔒 Security Notes

- ✅ Environment variables are encrypted in Vercel
- ✅ Never commit `.env` files to Git (already in .gitignore)
- ✅ These values are only visible in Vercel dashboard
- ✅ Each environment (Production/Preview/Development) can have different values

## 🆘 Troubleshooting

### Email Not Sending
- Verify SMTP credentials are correct
- Check SMTP_PORT is 465 (SSL) or 587 (TLS)
- Check Vercel function logs for errors
- Verify Gmail App Password is correct (not regular password)

### CORS Errors
- Update `ALLOW_ORIGINS` with your actual Vercel domain
- Format: `https://your-domain.vercel.app,http://localhost:5173`
- No trailing slashes

### Database Connection Issues
- Verify MONGO_URI is correct
- Check MongoDB Atlas allows connections from Vercel IPs (0.0.0.0/0)
- Check function logs for connection errors

---

**After adding variables, redeploy your project for changes to take effect!**

