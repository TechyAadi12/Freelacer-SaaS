# MongoDB Setup Guide for Windows

## 🎯 Quick Solution: Use MongoDB Atlas (Recommended)

The easiest way to get started is with MongoDB Atlas (free cloud database):

### Step 1: Create Free Account
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up with email or Google account
3. Choose the **FREE** tier (M0 Sandbox)

### Step 2: Create Cluster
1. Select **AWS** as cloud provider
2. Choose a region close to you
3. Click **Create Cluster** (takes 3-5 minutes)

### Step 3: Setup Database Access
1. Click **Database Access** in left sidebar
2. Click **Add New Database User**
3. Choose **Password** authentication
4. Username: `freelancer`
5. Password: `freelancer123` (or your choice)
6. User Privileges: **Read and write to any database**
7. Click **Add User**

### Step 4: Setup Network Access
1. Click **Network Access** in left sidebar
2. Click **Add IP Address**
3. Click **Allow Access from Anywhere** (for development)
4. Click **Confirm**

### Step 5: Get Connection String
1. Click **Database** in left sidebar
2. Click **Connect** on your cluster
3. Choose **Connect your application**
4. Copy the connection string (looks like):
   ```
   mongodb+srv://freelancer:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your actual password

### Step 6: Update Your .env File
Open `server/.env` and update:
```env
MONGODB_URI=mongodb+srv://freelancer:freelancer123@cluster0.xxxxx.mongodb.net/freelancer-saas?retryWrites=true&w=majority
```

### Step 7: Restart Server
```bash
# Stop the current server (Ctrl+C in terminal)
cd server
npm run dev
```

You should see: ✅ MongoDB connected successfully

---

## 🖥️ Alternative: Install MongoDB Locally

If you prefer to run MongoDB on your local machine:

### Step 1: Download MongoDB
1. Go to https://www.mongodb.com/try/download/community
2. Select:
   - Version: Latest (7.0+)
   - Platform: Windows
   - Package: MSI
3. Click **Download**

### Step 2: Install MongoDB
1. Run the downloaded `.msi` file
2. Choose **Complete** installation
3. **Important**: Check "Install MongoDB as a Service"
4. **Important**: Check "Install MongoDB Compass" (GUI tool)
5. Click **Next** and **Install**

### Step 3: Verify Installation
Open Command Prompt and run:
```bash
mongosh
```

If you see the MongoDB shell, it's working! Type `exit` to quit.

### Step 4: Create Data Directory (if needed)
```bash
# Create directory for MongoDB data
mkdir C:\data\db
```

### Step 5: Start MongoDB Service
```bash
# Start MongoDB service
net start MongoDB
```

### Step 6: Update .env File
Your `server/.env` should already have:
```env
MONGODB_URI=mongodb://localhost:27017/freelancer-saas
```

This is correct for local installation!

### Step 7: Restart Server
```bash
cd server
npm run dev
```

You should see: ✅ MongoDB connected successfully

---

## 🔧 Troubleshooting

### Error: "MongoDB service not found"

**Solution 1**: Install MongoDB as a service during installation

**Solution 2**: Start MongoDB manually
```bash
# Open Command Prompt as Administrator
cd "C:\Program Files\MongoDB\Server\7.0\bin"
mongod --dbpath "C:\data\db"
```

Keep this window open while using the app.

### Error: "Connection refused"

**Check if MongoDB is running:**
```bash
# Check service status
sc query MongoDB

# If not running, start it
net start MongoDB
```

### Error: "Access denied"

Run Command Prompt as **Administrator** and try again.

### MongoDB Compass Not Opening

1. Find MongoDB Compass in Start Menu
2. Or download separately: https://www.mongodb.com/try/download/compass
3. Connect to: `mongodb://localhost:27017`

---

## ✅ Verify Everything Works

### 1. Check MongoDB Connection
```bash
mongosh
```

Should connect without errors.

### 2. Seed the Database
```bash
cd server
npm run seed
```

Should see:
```
✅ MongoDB connected
👤 Created demo user
👥 Created clients
📁 Created projects
📄 Created invoices
⏱️  Created time entries
💳 Created payments
```

### 3. Start Both Servers
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

### 4. Open Application
Go to: http://localhost:5173

Login with:
- Email: demo@freelancer.com
- Password: password123

---

## 🎉 Success Indicators

You'll know everything is working when you see:

**Backend Terminal:**
```
✅ MongoDB connected successfully
🚀 Server running on port 5000
📊 Environment: development
```

**Frontend Terminal:**
```
VITE v7.3.1  ready in XXX ms
➜  Local:   http://localhost:5173/
```

**Browser:**
- Login page loads
- Can login with demo credentials
- Dashboard shows charts and data
- No console errors

---

## 💡 Recommended: Use MongoDB Atlas

**Why?**
- ✅ No installation needed
- ✅ Works immediately
- ✅ Free tier available
- ✅ Automatic backups
- ✅ Cloud accessible
- ✅ No local setup issues
- ✅ Production-ready

**Perfect for:**
- Development
- Testing
- Learning
- Small projects
- Deployment

---

## 📞 Need Help?

If you're still having issues:

1. **Check MongoDB is running:**
   ```bash
   mongosh
   ```

2. **Check the error message** in server terminal

3. **Try MongoDB Atlas** (easier option)

4. **Verify .env file** has correct connection string

5. **Restart everything:**
   - Stop both servers (Ctrl+C)
   - Close all terminals
   - Open fresh terminals
   - Start servers again

---

**Once MongoDB is connected, your Freelancer SaaS Dashboard will be fully functional!** 🚀
