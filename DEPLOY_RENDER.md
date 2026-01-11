# Deploy to Render - Step by Step

## 🚀 Render is Perfect for Your App

Render supports:
- ✅ Node.js Express servers
- ✅ File uploads
- ✅ Sessions
- ✅ Free tier available
- ✅ Automatic HTTPS

## 📋 Prerequisites

1. GitHub account
2. Your code pushed to GitHub

## 🎯 Step-by-Step Deployment

### Step 1: Push to GitHub

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Ready for deployment"

# Add your GitHub repository
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

### Step 2: Sign Up for Render

1. Go to https://render.com
2. Click "Get Started for Free"
3. Sign up with GitHub (recommended)

### Step 3: Create New Web Service

1. After logging in, click "**New +**" (top right)
2. Select "**Web Service**"
3. Click "**Connect Account**" to link GitHub
4. Find your repository and click "**Connect**"

### Step 4: Configure Service

Fill in these settings:

**Name**: `notes-organizer` (or your choice)

**Region**: Choose closest to you

**Branch**: `main`

**Root Directory**: Leave empty

**Runtime**: `Node`

**Build Command**: 
```
npm install
```

**Start Command**: 
```
node server.js
```

**Instance Type**: `Free`

### Step 5: Add Environment Variables (Optional)

Click "**Advanced**" and add:

- **Key**: `NODE_ENV`
  **Value**: `production`

- **Key**: `SESSION_SECRET`
  **Value**: `your-super-secret-random-string-here`

### Step 6: Deploy!

1. Click "**Create Web Service**"
2. Wait 2-3 minutes for deployment
3. You'll get a URL like: `https://notes-organizer.onrender.com`

## ✅ After Deployment

### Test Your Deployment

1. Visit your Render URL
2. Add `/login.html` to access login page
3. Login with admin credentials:
   - Email: admin@example.com
   - Password: admin123

### Common URLs

- Homepage: `https://your-app.onrender.com/`
- Login: `https://your-app.onrender.com/login.html`
- Register: `https://your-app.onrender.com/register.html`
- Dashboard: `https://your-app.onrender.com/dashboard.html`

## 📝 Important Notes

### Free Tier Limitations

- **Spins down after 15 min of inactivity**
- First request after spin-down takes 30-60 seconds
- 750 hours/month free

### Keep Alive (Optional)

To prevent spin-down, use a service like:
- **UptimeRobot** (https://uptimerobot.com)
- Pings your app every 5 minutes

### File Uploads

⚠️ **Important**: Files uploaded on Render free tier are **ephemeral**
- Files stored in `/uploads` will be deleted on restart
- For persistent storage, use:
  - Cloudinary (for images)
  - AWS S3 (for files)
  - Or upgrade to paid Render plan with persistent disk

## 🔧 Troubleshooting

### Build Failed

Check build logs on Render dashboard. Common issues:
```bash
# Make sure package.json has correct start script
"scripts": {
  "start": "node server.js"
}
```

### App Not Loading

1. Check Render logs (click "Logs" tab)
2. Make sure PORT is from environment:
   ```javascript
   const PORT = process.env.PORT || 3000
   ```
   ✅ This is already fixed in your code!

### Cannot Connect to Database

Your app uses JSON files, so this shouldn't be an issue. But note:
- JSON files are reset on each deployment
- Consider upgrading to MongoDB for production

## 🎉 You're Live!

Your app is now accessible worldwide at your Render URL!

Share it with:
- Admin: admin@example.com / admin123
- Teachers: teacher1@example.com / teacher123
- Students: student1@example.com / student123

## 🔄 Update Your App

Whenever you push to GitHub:
```bash
git add .
git commit -m "Update features"
git push origin main
```

Render will **automatically redeploy**! 🎯

## 💰 Upgrade Options

If you need:
- No spin-down
- Persistent file storage
- More resources

Consider Render's **Starter plan** ($7/month)
