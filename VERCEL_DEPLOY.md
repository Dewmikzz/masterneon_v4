# Vercel Deployment Guide

This guide will help you deploy Master Neon to Vercel.

## Prerequisites

- A Vercel account (free tier works)
- Environment variables configured (see below)

## Deployment Steps

### 1. Install Vercel CLI (Optional)

```bash
npm i -g vercel
```

### 2. Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your Git repository (GitHub, GitLab, or Bitbucket)
4. Vercel will auto-detect the configuration from `vercel.json`

### 3. Configure Environment Variables

In your Vercel project settings, add the following environment variables:

#### Required (for email functionality):
- `SMTP_USER` - Your SMTP email address
- `SMTP_PASS` - Your SMTP password or app password
- `SMTP_HOST` - SMTP server (e.g., `smtp.gmail.com`)
- `SMTP_PORT` - SMTP port (usually `587` for TLS)
- `DESIGNER_EMAIL` - Email address where design requests are sent

#### Optional:
- `MONGO_URI` - MongoDB connection string (if you want to persist data)
- `SENDGRID_API_KEY` - SendGrid API key (alternative to SMTP)
- `VITE_API_URL` - Custom API URL (defaults to `/api` in production)

### 4. Deploy via CLI (Alternative)

```bash
# Login to Vercel
vercel login

# Deploy
vercel

# For production deployment
vercel --prod
```

## Project Structure

- `client/` - React frontend (built to `client/dist/`)
- `api/` - Serverless API functions
- `server/` - Express backend code (used by API functions)

## API Endpoints

After deployment, your API will be available at:
- `https://your-domain.vercel.app/api/health` - Health check
- `https://your-domain.vercel.app/api/neon-request` - Submit design request
- `https://your-domain.vercel.app/api/contact` - Contact form

## Troubleshooting

### Build Errors

If you encounter build errors:
1. Check that all dependencies are listed in `client/package.json`
2. Ensure TypeScript compiles without errors: `cd client && npm run build`
3. Check Vercel build logs for specific error messages

### API Not Working

1. Check that environment variables are set in Vercel dashboard
2. Verify API routes are accessible: `https://your-domain.vercel.app/api/health`
3. Check Vercel function logs for errors

### Email Not Sending

1. Verify SMTP credentials are correct
2. For Gmail, use an App Password (not your regular password)
3. Check Vercel function logs for email errors
4. Email is optional - the app will work without it, but requests won't be sent

## Notes

- The database (MongoDB) is optional. The app works without it, but data won't be persisted.
- Email configuration is optional but recommended for production.
- All API routes are serverless functions that scale automatically.
- The frontend is served as static files from `client/dist/`.

