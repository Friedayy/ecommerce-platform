# 🛒 E-Commerce Platform

A full-stack e-commerce application built with React, Node.js, and MongoDB. This project demonstrates modern web development practices including authentication, real-time cart management, product filtering, and an admin panel.

## ✨ Features

- **User Authentication**: Secure signup/login with JWT tokens
- **Product Catalog**: Browse products with search and filtering by category/price
- **Shopping Cart**: Add/remove items, update quantities, persistent storage
- **Checkout Process**: Complete order flow with order confirmation
- **User Dashboard**: View order history and manage profile
- **Admin Panel**: Manage products, view orders, and user management
- **Product Reviews**: Rate and review products with star ratings
- **Responsive Design**: Mobile-first design that works on all devices
- **Secure Payments**: Order management system ready for payment integration

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **Tailwind CSS** - Styling
- **React Router** - Client-side routing
- **Context API** - State management
- **Axios** - HTTP client

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Bcryptjs** - Password hashing

### Deployment
- **Frontend**: Vercel
- **Backend**: Render/Railway
- **Database**: MongoDB Atlas

## 📦 Installation

### Prerequisites
- Node.js (v14+)
- npm or yarn
- MongoDB Atlas account (free at https://www.mongodb.com/cloud/atlas)

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/Friedayy/ecommerce-platform.git
cd ecommerce-platform
```

2. **Backend Setup**
```bash
cd backend
npm install
```

Create a `.env` file in the backend folder (copy from `.env.example`):
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production
JWT_EXPIRE=30d
FRONTEND_URL=http://localhost:5173
```

3. **Frontend Setup**
```bash
cd ../frontend
npm install
```

Create a `.env` file in the frontend folder (copy from `.env.example`):
```
VITE_API_URL=http://localhost:5000/api
```

## 🚀 Running Locally

### Start the Backend
```bash
cd backend
npm run dev
```
Backend will run on `http://localhost:5000`

### Start the Frontend
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:5173`

## 📁 Project Structure

```
ecommerce-platform/
├── backend/
│   ├── models/              # MongoDB schemas
│   ├── routes/              # API routes
│   ├── controllers/         # Route handlers
│   ├── middleware/          # Custom middleware
│   ├── config/              # Configuration files
│   ├── utils/               # Utility functions
│   ├── server.js            # Main server file
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── context/         # Context API setup
│   │   ├── services/        # API services
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .env.example
│
└── .gitignore
```

## 🔑 API Endpoints (Core)

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (protected)

### Products
- `GET /api/products` - Get all products with filters
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item
- `DELETE /api/cart/remove/:itemId` - Remove item from cart

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details
- `GET /api/admin/orders` - Get all orders (admin only)

### Reviews
- `GET /api/reviews/product/:productId` - Get product reviews
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

## 🎯 Key Challenges & Solutions

### Challenge 1: JWT Token Management
**Problem**: How to securely manage user sessions across frontend and backend
**Solution**: 
- Tokens stored in localStorage on frontend
- Tokens included in request headers via Axios interceptor
- Refresh token mechanism for extended sessions

### Challenge 2: Cart State Persistence
**Problem**: User cart data needs to persist across page refreshes and sessions
**Solution**:
- Cart stored in Context API for real-time updates
- Synced with backend database for logged-in users
- LocalStorage backup for guest users

### Challenge 3: Image Upload & Storage
**Problem**: Product images need to be uploaded and served efficiently
**Solution**:
- Multer middleware for file handling
- Images stored in local uploads folder
- Base64 encoding for small thumbnails

### Challenge 4: Real-time Inventory Management
**Problem**: Prevent overselling when multiple users order simultaneously
**Solution**:
- Database transactions for order creation
- Inventory check before order confirmation
- Stock update on successful payment

## 🔮 Future Enhancements

- [ ] Payment gateway integration (Stripe/Razorpay)
- [ ] Email notifications for orders
- [ ] Wishlist feature
- [ ] Social login (Google, GitHub)
- [ ] Product recommendations
- [ ] Advanced analytics dashboard
- [ ] Real-time order tracking
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Unit and integration tests

## 🌐 Live Demo

**Frontend**: [Will be deployed to Vercel]
**Backend**: [Will be deployed to Render]

## 📸 Screenshots

[Screenshots will be added after deployment]

## 🔐 Security Features

- Password hashing with bcryptjs
- JWT-based authentication
- Protected API routes with middleware
- Input validation and sanitization
- CORS configuration
- Environment variables for sensitive data
- SQL injection prevention (using Mongoose)

## 🧪 Testing

```bash
# Run backend tests (to be implemented)
cd backend && npm test

# Run frontend tests (to be implemented)
cd frontend && npm test
```

## 📝 Git Workflow

This project follows conventional commits:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Adding tests

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Mohammad Amaan Bhat**
- GitHub: [@Friedayy](https://github.com/Friedayy)
- Email: amaandev253@gmail.com
- Portfolio: [amaandev.me](https://amaandev.me)

## 🤝 Contributing

This is a personal project for learning and portfolio purposes. Feel free to fork and create your own version!

---

**Built with ❤️ for Accenture Internship**