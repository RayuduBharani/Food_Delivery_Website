# 🍕 FoodRush — Food Delivery Website

A full-stack food delivery web application inspired by Swiggy and Zomato. Built as a take-home project demonstrating modern full-stack engineering practices.

![FoodRush](https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80)

---

## ✨ Features

### Core
- 🍽️ Browse restaurants with search and cuisine filters
- 📋 View restaurant menus grouped by category
- 🛒 Add items to cart with quantity controls
- 📦 Place orders with delivery details
- 📜 View order history with status tracking
- 🔐 JWT-based user authentication (signup/login)

### UX
- 🌙 Dark theme with warm orange accent (Shadcn design tokens)
- 📱 Fully responsive (mobile, tablet, desktop)
- ⏳ Loading skeleton animations
- 🔍 Debounced search (400ms delay)
- 🏷️ Cuisine filter chips
- 🛒 Cart persisted in localStorage
- 🍕 Single-restaurant cart (like Swiggy)
- 💰 Free delivery on orders ≥ ₹500
- 🎉 Animated order success page
- 🚫 Empty states for no results, empty cart, no orders
- 🔴 404 page with food-themed messaging

---

## 🛠️ Tech Stack

| Layer         | Technology                              |
|---------------|-----------------------------------------|
| **Frontend**  | React 19, TypeScript, Vite 8            |
| **Styling**   | Tailwind CSS v4, Shadcn UI             |
| **Routing**   | React Router v7                        |
| **State**     | Context API + useReducer               |
| **HTTP**      | Axios (centralized instance)           |
| **Backend**   | Node.js, Express v5                    |
| **Database**  | MongoDB with Mongoose                  |
| **Auth**      | JWT (jsonwebtoken + bcryptjs)          |
| **Dev Tools** | Nodemon, ESLint, TypeScript            |

---

## 📁 Folder Structure

```
Food Delivery Website/
├── Backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── auth.js               # Signup/login logic
│   │   ├── orderController.js    # Order CRUD
│   │   └── restaurantController.js # Restaurant + menu logic
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification
│   │   └── errorHandler.js       # Global error handler
│   ├── models/
│   │   ├── MenuItem.js           # Menu item schema
│   │   ├── Order.js              # Order schema (embedded items)
│   │   ├── Restaurant.js         # Restaurant schema
│   │   └── User.js               # User schema
│   ├── routes/
│   │   ├── auth.js               # Auth routes
│   │   ├── order.js              # Order routes
│   │   └── restaurant.js         # Restaurant routes
│   ├── seed/
│   │   ├── data.js               # Sample restaurant/menu data
│   │   └── index.js              # Seed script
│   ├── utils/
│   │   ├── ApiError.js           # Custom error class
│   │   └── asyncHandler.js       # Async error wrapper
│   ├── app.js                    # Express app configuration
│   ├── server.js                 # Server entry point
│   ├── .env.example              # Environment template
│   └── package.json
│
└── Frontend/
    └── src/
        ├── api/
        │   ├── axios.ts          # Centralized Axios instance
        │   ├── orders.ts         # Order API service
        │   └── restaurants.ts    # Restaurant API service
        ├── components/
        │   ├── CartItem.tsx       # Cart item with qty controls
        │   ├── EmptyState.tsx     # Reusable empty placeholder
        │   ├── Footer.tsx         # Site footer
        │   ├── LoadingSkeleton.tsx # Shimmer loading states
        │   ├── MenuItemCard.tsx   # Menu item with add-to-cart
        │   ├── Navbar.tsx         # Sticky navigation bar
        │   ├── OrderCard.tsx      # Order history card
        │   ├── RestaurantCard.tsx  # Restaurant grid card
        │   ├── SearchBar.tsx      # Search + cuisine filters
        │   ├── StatusBadge.tsx    # Color-coded order status
        │   └── ui/               # Shadcn UI primitives
        ├── context/
        │   ├── AuthContext.tsx    # Auth state management
        │   └── CartContext.tsx    # Cart state (useReducer)
        ├── layouts/
        │   └── MainLayout.tsx    # Navbar + Outlet + Footer
        ├── pages/
        │   ├── Auth/
        │   │   ├── login.tsx     # Login page
        │   │   └── signUp.tsx    # Signup page
        │   ├── Cart.tsx          # Cart + order summary
        │   ├── Checkout.tsx      # Delivery form + payment
        │   ├── Home.tsx          # Hero + restaurant grid
        │   ├── NotFound.tsx      # 404 page
        │   ├── OrderHistory.tsx  # Past orders list
        │   ├── OrderSuccess.tsx  # Post-order confirmation
        │   └── RestaurantDetail.tsx # Menu + floating cart bar
        ├── App.tsx               # Root routing
        ├── main.tsx              # React entry point
        └── index.css             # Shadcn design tokens
```

---

## 🚀 Installation

### Prerequisites
- Node.js ≥ 18
- MongoDB (local or Atlas)

### 1. Clone the repository
```bash
git clone <repo-url>
cd "Food Delivery Website"
```

### 2. Backend setup
```bash
cd Backend
npm install

# Create .env from template
cp .env.example .env
# Edit .env with your values

# Seed the database
npm run seed

# Start the server
npm run dev
```

### 3. Frontend setup
```bash
cd Frontend
npm install

# Start the dev server
npm run dev
```

### 4. Open the app
Navigate to `http://localhost:5173` in your browser.

---

## ⚙️ Environment Variables

### Backend (`Backend/.env`)

| Variable       | Description                  | Default                                      |
|----------------|------------------------------|----------------------------------------------|
| `PORT`         | Server port                  | `8000`                                       |
| `MONGODB_URI`  | MongoDB connection string    | `mongodb://127.0.0.1:27017/FoodDeliveryWebsite` |
| `JWT_SECRET`   | Secret for JWT signing       | *(required)*                                 |
| `CLIENT_URL`   | Frontend URL (for CORS)      | `http://localhost:5173`                      |

### Frontend (`Frontend/.env`)

| Variable        | Description     | Default                         |
|-----------------|-----------------|----------------------------------|
| `VITE_API_URL`  | Backend API URL | `http://localhost:8000/api`      |

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint            | Description       |
|--------|---------------------|--------------------|
| POST   | `/api/auth/register` | Create account    |
| POST   | `/api/auth/login`    | Login (JWT token) |

### Restaurants
| Method | Endpoint                      | Description                      |
|--------|-------------------------------|----------------------------------|
| GET    | `/api/restaurants`            | List all (search, filter, page)  |
| GET    | `/api/restaurants/:id`        | Single restaurant + menu items   |
| GET    | `/api/restaurants/:id/menu`   | Menu items (grouped by category) |

### Orders
| Method | Endpoint                      | Description          |
|--------|-------------------------------|----------------------|
| POST   | `/api/orders`                 | Place new order      |
| GET    | `/api/orders`                 | List orders          |
| GET    | `/api/orders/:id`             | Single order details |
| PATCH  | `/api/orders/:id/status`      | Update order status  |

---

## 🌐 Deployment

### Frontend → Vercel
1. Connect your GitHub repo to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add env variable: `VITE_API_URL=https://your-backend.onrender.com/api`

### Backend → Render
1. Connect your GitHub repo to Render
2. Set build command: `npm install`
3. Set start command: `node server.js`
4. Add env variables: `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL`

### Database → MongoDB Atlas
1. Create a free M0 cluster
2. Whitelist your backend IP (or 0.0.0.0/0 for development)
3. Get connection string and set as `MONGODB_URI`

---

## 🔮 Future Improvements

- [ ] Admin Dashboard for managing restaurants and orders
- [ ] Image upload via Cloudinary
- [ ] Real-time order tracking with WebSocket
- [ ] Email/SMS notifications
- [ ] Multiple payment methods (Razorpay/Stripe)
- [ ] Restaurant reviews and ratings
- [ ] Favorites/wishlist
- [ ] Coupon/promo code system
- [ ] PWA (Progressive Web App) support
- [ ] Automated tests (Jest + React Testing Library)

---

## 👨‍💻 Author

**Rayudu Bharani**

---

## 📄 License

ISC
