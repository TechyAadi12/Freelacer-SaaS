# Freelancer SaaS Dashboard

A modern, production-ready Freelancer SaaS Dashboard built with the MERN stack (MongoDB, Express.js, React.js, Node.js) featuring client management, project tracking, invoicing, time tracking, payments integration with Stripe, and comprehensive analytics.

## 🚀 Features

### Core Modules
- **Dashboard Overview** - Real-time business metrics, revenue charts, and activity feed
- **Client Management** - Complete CRUD operations for managing clients
- **Project Tracking** - Track projects with status, priority, budgets, and timelines
- **Invoice Generation** - Create, send, and manage invoices with automatic numbering
- **Time Tracking** - Log billable hours with automatic duration and amount calculation
- **Payment Processing** - Stripe integration for online payments (test mode)
- **Analytics & Reports** - Revenue trends, project distribution, and top clients

### Technical Features
- 🔐 **Secure Authentication** - JWT-based auth with bcrypt password hashing
- 🌓 **Dark/Light Mode** - Persistent theme switching
- 📱 **Fully Responsive** - Mobile-first design with Tailwind CSS
- 🎨 **Modern UI/UX** - Clean, professional interface with smooth animations
- 💳 **Stripe Integration** - Test mode payment processing
- 📊 **Interactive Charts** - Recharts for data visualization
- 🔔 **Toast Notifications** - Real-time feedback for user actions
- 🛡️ **Protected Routes** - Route guards for authenticated access

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn
- Stripe account (for payment features)

## 🛠️ Installation

### 1. Clone the repository
```bash
cd "c:\Users\pande\Freelacer SaaS"
```

### 2. Install Server Dependencies
```bash
cd server
npm install
```

### 3. Install Client Dependencies
```bash
cd ../client
npm install
```

### 4. Configure Environment Variables

#### Server (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/freelancer-saas
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Stripe Test Mode Keys
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

#### Client (.env)
```env
VITE_API_URL=http://localhost:5000
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

### 5. Seed the Database (Optional)
```bash
cd server
npm run seed
```

This will create:
- Demo user account
- Sample clients
- Sample projects
- Sample invoices
- Sample time entries
- Sample payments

**Demo Credentials:**
- Email: demo@freelancer.com
- Password: password123

## 🚀 Running the Application

### Start MongoDB
Make sure MongoDB is running on your system.

### Start the Server
```bash
cd server
npm run dev
```
Server will run on http://localhost:5000

### Start the Client
```bash
cd client
npm run dev
```
Client will run on http://localhost:5173

## 📁 Project Structure

```
Freelacer SaaS/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── layout/     # Layout components (Sidebar, Navbar)
│   │   │   ├── Avatar.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   └── ...
│   │   ├── context/        # React context providers
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── pages/          # Page components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── utils/          # Utility functions
│   │   │   ├── api.js
│   │   │   └── helpers.js
│   │   ├── App.jsx         # Main app component
│   │   ├── main.jsx        # Entry point
│   │   └── index.css       # Global styles
│   ├── .env                # Environment variables
│   ├── package.json
│   └── tailwind.config.js
│
└── server/                 # Node.js backend
    ├── models/             # Mongoose models
    │   ├── User.model.js
    │   ├── Client.model.js
    │   ├── Project.model.js
    │   ├── Invoice.model.js
    │   ├── TimeEntry.model.js
    │   └── Payment.model.js
    ├── routes/             # API routes
    │   ├── auth.routes.js
    │   ├── client.routes.js
    │   ├── project.routes.js
    │   ├── invoice.routes.js
    │   ├── timeEntry.routes.js
    │   ├── payment.routes.js
    │   └── dashboard.routes.js
    ├── middleware/         # Custom middleware
    │   └── auth.middleware.js
    ├── utils/              # Utility functions
    │   └── jwt.utils.js
    ├── server.js           # Express server
    ├── seed.js             # Database seeding script
    ├── .env                # Environment variables
    └── package.json
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user
- `PUT /api/auth/update` - Update user profile

### Clients
- `GET /api/clients` - Get all clients
- `GET /api/clients/:id` - Get single client
- `POST /api/clients` - Create client
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Invoices
- `GET /api/invoices` - Get all invoices
- `GET /api/invoices/:id` - Get single invoice
- `POST /api/invoices` - Create invoice
- `PUT /api/invoices/:id` - Update invoice
- `DELETE /api/invoices/:id` - Delete invoice
- `POST /api/invoices/:id/send` - Mark invoice as sent

### Time Entries
- `GET /api/time-entries` - Get all time entries
- `GET /api/time-entries/:id` - Get single time entry
- `POST /api/time-entries` - Create time entry
- `PUT /api/time-entries/:id` - Update time entry
- `DELETE /api/time-entries/:id` - Delete time entry
- `POST /api/time-entries/:id/stop` - Stop running timer

### Payments
- `GET /api/payments` - Get all payments
- `POST /api/payments/create-payment-intent` - Create Stripe payment intent
- `POST /api/payments/confirm` - Confirm payment
- `POST /api/payments/manual` - Record manual payment

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/revenue-chart` - Get revenue chart data
- `GET /api/dashboard/project-status` - Get project status distribution
- `GET /api/dashboard/top-clients` - Get top clients by revenue

## 🎨 Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **Recharts** - Charting library
- **Heroicons** - Icon library
- **React Hot Toast** - Toast notifications
- **date-fns** - Date utility library

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Stripe** - Payment processing
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- HTTP-only cookies for token storage
- CORS configuration
- Input validation
- Protected API routes
- XSS protection

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- Desktop (1920px+)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🚀 Deployment

### Backend Deployment (Heroku/Railway/Render)
1. Set environment variables
2. Update MONGODB_URI to production database
3. Update CLIENT_URL to production frontend URL
4. Deploy using platform CLI or Git integration

### Frontend Deployment (Netlify/Vercel)
1. Build the project: `npm run build`
2. Set VITE_API_URL to production backend URL
3. Deploy the `dist` folder

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Author

Built with ❤️ by the FreelancerHub Team

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## ⭐ Show your support

Give a ⭐️ if this project helped you!
