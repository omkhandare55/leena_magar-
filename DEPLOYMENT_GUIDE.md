# Deployment Guide - Notes Organizer

## ✅ Fixed Issues

### Admin Login Issue
- **Problem**: Admin user didn't exist, and existing users lacked approval status
- **Solution**: Added admin user with credentials:
  - Email: `admin@example.com`
  - Password: `admin123`
- All existing users are now approved and can login

## 🔐 Login Credentials

### Admin Account
- **Email**: admin@example.com
- **Password**: admin123
- **Role**: Can approve teachers

### Teacher Accounts
- **Email**: teacher1@example.com / **Password**: teacher123
- **Email**: teacher2@example.com / **Password**: teacher123
- **Role**: Can approve students and upload notes

### Student Accounts
- **Email**: student1@example.com / **Password**: student123
- **Email**: student2@example.com / **Password**: student123
- **Email**: student3@example.com / **Password**: student123
- **Role**: Can view and download notes

## 🚀 Deployment Options

### Option 1: Vercel (Recommended for Quick Deploy)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

**Note**: Vercel configuration is already set in `vercel.json`

### Option 2: Heroku

1. **Install Heroku CLI**
   - Download from: https://devcenter.heroku.com/articles/heroku-cli

2. **Login**
   ```bash
   heroku login
   ```

3. **Create App**
   ```bash
   heroku create your-app-name
   ```

4. **Deploy**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push heroku main
   ```

5. **Open App**
   ```bash
   heroku open
   ```

**Note**: Procfile is already configured for Heroku

### Option 3: Render

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Create New Web Service on Render**
   - Go to: https://render.com
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

3. **Configure Build Settings**
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Environment**: Node

### Option 4: Railway

1. **Install Railway CLI**
   ```bash
   npm i -g @railway/cli
   ```

2. **Login**
   ```bash
   railway login
   ```

3. **Initialize and Deploy**
   ```bash
   railway init
   railway up
   ```

## 🧪 Testing Locally

1. **Start the Server**
   ```bash
   npm start
   ```

2. **Access the Application**
   - Open browser: http://localhost:3000
   - Login page: http://localhost:3000/login.html
   - Dashboard: http://localhost:3000/dashboard.html

3. **Test Admin Login**
   - Use email: admin@example.com
   - Use password: admin123

## 📁 Project Structure

```
leena.c/
├── server.js           # Express server (main entry point)
├── package.json        # Dependencies and scripts
├── vercel.json         # Vercel deployment config
├── Procfile           # Heroku deployment config
├── data/
│   ├── users.json     # User data (with admin)
│   ├── notes.json     # Notes data
│   └── seedData.json  # Seed data for initialization
├── public/            # Frontend files
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   └── js/
│       ├── auth.js
│       └── dashboard.js
└── uploads/           # Uploaded files storage
```

## ⚙️ Environment Variables

For production deployment, consider setting:

```env
PORT=3000
NODE_ENV=production
SESSION_SECRET=your-secure-random-string
```

## 🔒 Security Recommendations

Before deploying to production:

1. **Change default passwords** in `data/users.json`
2. **Update session secret** in `server.js` (line 27)
3. **Add password hashing** (use bcrypt)
4. **Enable HTTPS** (most platforms do this automatically)
5. **Set secure cookie** settings for production

## 📝 Notes

- File uploads are stored in the `uploads/` directory
- Session data is stored in memory (consider using Redis for production)
- JSON files are used for data storage (consider migrating to a database for production)

## ✅ Verification

Run verification script to check deployment readiness:
```bash
node verify_deployment.js
```

## 🆘 Troubleshooting

### Issue: "Cannot connect to server"
- Ensure server is running: `npm start`
- Check if port 3000 is available

### Issue: "Login failed"
- Verify users.json has approved users
- Check credentials are correct
- Ensure server.js is running

### Issue: "Account pending approval"
- Admin needs to approve teacher accounts
- Teachers need to approve student accounts
- Or manually set `approved: true` in users.json

## 📞 Support

If you encounter issues during deployment:
1. Check server logs for errors
2. Verify all dependencies are installed: `npm install`
3. Ensure Node.js version is compatible (v18+)

---

**Last Updated**: January 11, 2026
**Status**: ✅ Ready for Deployment
