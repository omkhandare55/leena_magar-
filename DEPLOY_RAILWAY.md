# Deploy to Railway - Quick & Easy

## 🚂 Why Railway?

- ✅ Super easy deployment
- ✅ $5 free credit monthly
- ✅ Perfect for Node.js apps
- ✅ Persistent storage available
- ✅ Auto-detects Node.js

## 🚀 Deploy in 3 Steps

### Option A: Deploy from GitHub (Recommended)

#### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Ready for deployment"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

#### Step 2: Deploy on Railway

1. Go to https://railway.app
2. Click "**Start a New Project**"
3. Select "**Deploy from GitHub repo**"
4. Authorize Railway to access GitHub
5. Select your repository
6. Click "**Deploy Now**"

#### Step 3: Done! ✅

Railway will:
- Auto-detect Node.js
- Install dependencies
- Start your server
- Give you a public URL

### Option B: Deploy from Local (CLI)

#### Step 1: Install Railway CLI

```bash
npm i -g @railway/cli
```

#### Step 2: Login and Deploy

```bash
# Login to Railway
railway login

# Initialize project
railway init

# Deploy!
railway up
```

#### Step 3: Get Your URL

```bash
railway domain
```

## ⚙️ Configuration

Railway auto-detects everything, but you can customize:

### Add Environment Variables

In Railway dashboard:
1. Click your project
2. Go to "**Variables**" tab
3. Add variables:
   - `NODE_ENV` = `production`
   - `SESSION_SECRET` = `your-secret-key`

### Custom Domain

1. Go to "**Settings**" tab
2. Click "**Generate Domain**"
3. Or add your own custom domain

## 📊 Monitor Your App

Railway dashboard shows:
- **Deployments**: Build logs and status
- **Metrics**: CPU, Memory, Network usage
- **Logs**: Real-time server logs

## 💰 Pricing

**Free Tier**:
- $5 credit per month
- Enough for small apps
- No credit card required

**Paid**:
- $5/month for $5 credit
- Pay only for usage beyond credit

## 🔧 Common Commands

```bash
# View logs
railway logs

# Open in browser
railway open

# Link existing project
railway link

# Add environment variable
railway variables set KEY=value
```

## ✅ Your URLs

After deployment:
- App: `https://your-app.up.railway.app`
- Login: `https://your-app.up.railway.app/login.html`
- Dashboard: `https://your-app.up.railway.app/dashboard.html`

## 🎉 Benefits

- ✅ No spin-down (always running)
- ✅ Persistent storage (paid plans)
- ✅ Automatic deployments from GitHub
- ✅ Zero configuration needed
- ✅ Fast global CDN

Perfect for your Notes Organizer app! 🚀
