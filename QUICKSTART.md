# Quick Start Guide

## Prerequisites Check

Before running the application, ensure you have:

1. **Node.js** installed (v16+)
   ```bash
   node --version
   ```

2. **MongoDB** installed and running
   - Download from: https://www.mongodb.com/try/download/community
   - Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas
   
   **For Windows:**
   - Install MongoDB Community Server
   - MongoDB should auto-start as a service
   - Or manually start: `net start MongoDB`
   
   **To verify MongoDB is running:**
   ```bash
   mongosh
   ```

## Setup Steps

### 1. Install Dependencies

**Server:**
```bash
cd server
npm install
```

**Client:**
```bash
cd client
npm install
```

### 2. Configure Environment Variables

The `.env` files are already created with default values. 

**Important:** If using MongoDB Atlas or custom MongoDB instance, update `MONGODB_URI` in `server/.env`

### 3. Seed the Database (Optional but Recommended)

This creates demo data including a test user account.

```bash
cd server
npm run seed
```

**Demo Login Credentials:**
- Email: demo@freelancer.com
- Password: password123

### 4. Start the Application

**Terminal 1 - Start Backend Server:**
```bash
cd server
npm run dev
```
Server runs on: http://localhost:5000

**Terminal 2 - Start Frontend:**
```bash
cd client
npm run dev
```
Frontend runs on: http://localhost:5173

### 5. Access the Application

Open your browser and navigate to: **http://localhost:5173**

Login with demo credentials or create a new account.

## Troubleshooting

### MongoDB Connection Error

If you see "MongoDB connection error":

1. **Check if MongoDB is running:**
   ```bash
   mongosh
   ```

2. **Start MongoDB service (Windows):**
   ```bash
   net start MongoDB
   ```

3. **Or use MongoDB Atlas:**
   - Create free cluster at https://www.mongodb.com/cloud/atlas
   - Get connection string
   - Update `MONGODB_URI` in `server/.env`

### Port Already in Use

If port 5000 or 5173 is in use:
- Change `PORT` in `server/.env`
- Update `VITE_API_URL` in `client/.env` accordingly

### Dependencies Issues

Clear and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

## Features to Test

Once logged in, you can:

✅ View dashboard with analytics and charts
✅ Manage clients (CRUD operations)
✅ Track projects with status and budgets
✅ Create and manage invoices
✅ Log time entries for billable hours
✅ Process payments (Stripe test mode)
✅ View analytics and reports
✅ Toggle dark/light theme
✅ Responsive design on all devices

## Next Steps

1. Explore the dashboard and familiarize yourself with the UI
2. Create your first client
3. Start a new project
4. Log some time entries
5. Generate an invoice
6. Check out the analytics

Enjoy your Freelancer SaaS Dashboard! 🚀
