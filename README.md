# Freelancer SaaS Dashboard (Serverless / Local Storage Edition)

A modern, production-ready Freelancer SaaS Dashboard built as a pure client-side application. This version uses **Local Storage** for all data persistence, removing the need for a backend server or database setup.

## 🚀 Features

### Core Modules
- **Dashboard Overview** - Real-time business metrics, revenue charts, and activity feed
- **Client Management** - Complete CRUD operations for managing clients
- **Project Tracking** - Track projects with status, priority, budgets, and timelines
- **Invoice Generation** - Create, send, and manage invoices with automatic numbering
- **Time Tracking** - Log billable hours with automatic duration and amount calculation
- **Payment History** - Track payment history and record manual transactions
- **Analytics & Reports** - Revenue trends, project distribution, and top clients

### Technical Features
- 🌓 **Dark/Light Mode** - Persistent theme switching
- 📱 **Fully Responsive** - Mobile-first design with Tailwind CSS
- 🎨 **Modern UI/UX** - Clean, professional interface with smooth animations
- 📊 **Interactive Charts** - Recharts for data visualization
- 🔔 **Toast Notifications** - Real-time feedback for user actions
- 💾 **Local Storage Persistence** - All your data stays on your browser

## 🛠️ Installation & Setup

Since this is a client-only application, setup is extremely simple:

### 1. Clone the repository
```bash
cd "c:\Users\pande\Freelacer SaaS"
```

### 2. Install Dependencies
```bash
cd client
npm install
```

### 3. Start the Application
```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## 📁 Project Structure

```
Freelacer SaaS/
└── client/                 # React frontend
    ├── src/
    │   ├── components/     # Reusable UI components
    │   ├── context/        # React context (Auth, Theme)
    │   ├── pages/          # Page components (Dashboard, Clients, etc.)
    │   ├── utils/          # Utility functions
    │   │   ├── api.js      # Mock API layer (uses Local Storage)
    │   │   ├── localStorage.js # Data persistence logic
    │   │   └── helpers.js  # Formatting helpers
    │   ├── App.jsx         # Main app component
    │   └── main.jsx        # Entry point
    ├── package.json
    └── tailwind.config.js
```

## 🔐 Authentication
This version uses a very lightweight client-side authentication mock. You can log in or register with any email, and your session is stored in your browser's Local Storage.

## 💾 Data Management
All data you create (Clients, Projects, Invoices, etc.) is saved directly to your browser's **Local Storage**. This means:
- No database setup required.
- Data is persistent across browser refreshes.
- Data is specific to your browser/device.

## 🎨 Tech Stack
- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Recharts** - Charting library
- **Heroicons** - Icon library
- **React Hot Toast** - Toast notifications

## 📝 License
This project is licensed under the ISC License.

## ⭐ Show your support
Give a ⭐️ if this project helped you!
