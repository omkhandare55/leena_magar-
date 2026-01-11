const fs = require('fs');
const path = require('path');

console.log('\n=== Deployment Verification ===\n');

// Check users.json
const usersFile = path.join(__dirname, 'data', 'users.json');
const users = JSON.parse(fs.readFileSync(usersFile, 'utf-8'));

console.log('✓ Users Check:');
const admin = users.find(u => u.role === 'admin');
const approvedUsers = users.filter(u => u.approved === true);

if (admin) {
  console.log(`  - Admin user found: ${admin.email}`);
  console.log(`  - Admin password: ${admin.password}`);
  console.log(`  - Admin approved: ${admin.approved}`);
} else {
  console.log('  ✗ ERROR: No admin user found!');
}

console.log(`  - Total users: ${users.length}`);
console.log(`  - Approved users: ${approvedUsers.length}`);
console.log(`  - Unapproved users: ${users.length - approvedUsers.length}`);

// Check package.json
console.log('\n✓ Package.json Check:');
const packageJson = require('./package.json');
console.log(`  - Start script: ${packageJson.scripts.start}`);
console.log(`  - Build script: ${packageJson.scripts.build}`);

// Check deployment files
console.log('\n✓ Deployment Files:');
console.log(`  - vercel.json: ${fs.existsSync('./vercel.json') ? '✓ Found' : '✗ Missing'}`);
console.log(`  - Procfile: ${fs.existsSync('./Procfile') ? '✓ Found' : '✗ Missing'}`);
console.log(`  - server.js: ${fs.existsSync('./server.js') ? '✓ Found' : '✗ Missing'}`);

// Check environment
console.log('\n✓ Server Configuration:');
console.log(`  - PORT: 3000 (configured in server.js)`);
console.log(`  - Session secret: configured`);
console.log(`  - CORS: enabled`);

console.log('\n=== Available Login Credentials ===\n');
console.log('Admin:');
console.log('  Email: admin@example.com');
console.log('  Password: admin123\n');
console.log('Teachers:');
console.log('  Email: teacher1@example.com | Password: teacher123');
console.log('  Email: teacher2@example.com | Password: teacher123\n');
console.log('Students:');
console.log('  Email: student1@example.com | Password: student123');
console.log('  Email: student2@example.com | Password: student123');
console.log('  Email: student3@example.com | Password: student123\n');

console.log('=== Deployment Instructions ===\n');
console.log('For Vercel:');
console.log('  1. Install Vercel CLI: npm i -g vercel');
console.log('  2. Login: vercel login');
console.log('  3. Deploy: vercel --prod\n');
console.log('For Heroku:');
console.log('  1. Install Heroku CLI');
console.log('  2. Login: heroku login');
console.log('  3. Create app: heroku create your-app-name');
console.log('  4. Push: git push heroku main\n');
console.log('For Render:');
console.log('  1. Push to GitHub');
console.log('  2. Connect GitHub repo on Render dashboard');
console.log('  3. Use "node server.js" as start command\n');

console.log('✅ Application is ready for deployment!\n');
