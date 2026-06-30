# FoodRush — Food Delivery Website

A full-stack food delivery web application inspired by Swiggy and Zomato. Built as a take-home project demonstrating modern full-stack engineering practices.

![FoodRush](https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80)

---

## Demo & Test Credentials

The database includes pre-seeded user accounts for development and testing. You can use these credentials to sign in directly:

### Admin User
* **Email:** `admin@foodrush.in`
* **Password:** `Admin@123`
* **Role:** `admin` *(has access to the admin dashboard at `/admin` to manage orders, restaurants, and view statistics)*

### Regular Customer
* **Email:** `rayudubharani7288@gmail.com`
* **Password:** `Bharani`
* **Role:** `user` *(can browse restaurants, add items to cart, place orders, and track order history)*

---


## Features

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

## Folder Structure

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


## ⚙️ Environment Variables Setup

Before running the application, you must configure the environment variables for both the backend and frontend.

### 1. Backend Configuration (`Backend/.env`)
Create a `.env` file in the `Backend` directory (you can copy the `.env.example` file) and configure the following variables:

| Variable | Description | Recommended/Default Value |
| :--- | :--- | :--- |
| `PORT` | The port on which the Express backend server will run. | `8000` |
| `MONGODB_URI` | The connection string for your MongoDB instance. | `mongodb://127.0.0.1:27017/FoodDeliveryWebsite` *(local)* or a MongoDB Atlas URI |
| `JWT_SECRET` | Secret key used to sign and verify JSON Web Tokens (JWT) for authentication. | *Any secure random string* (e.g., `your_super_secret_jwt_key_here`) |
| `CLIENT_URL` | The URL of the frontend client. Used to configure CORS on the backend. | `http://localhost:5173` *(or the port your Vite server starts on)* |

### 2. Frontend Configuration (`Frontend/.env`)
Create a `.env` file in the `Frontend` directory (you can copy the `.env.example` file) and configure the following variables:

| Variable | Description | Recommended/Default Value |
| :--- | :--- | :--- |
| `VITE_API_URL` | The full base URL of the backend API endpoints. | `http://localhost:8000/api` |

> [!IMPORTANT]
> **Port Matching Rule:** Make sure the `CLIENT_URL` in your Backend's `.env` matches the exact URL where your Frontend is running (usually `http://localhost:5173` or `http://localhost:5175`). Likewise, ensure the port in the Frontend's `VITE_API_URL` matches the backend `PORT` variable.

---

## Download & Local Run Guide

Follow these steps to download, install dependencies, seed the database, and start the application locally:

### 📋 Prerequisites
Make sure you have the following installed on your machine:
* [Node.js](https://nodejs.org/) (Version ≥ 18 recommended)
* [MongoDB](https://www.mongodb.com/try/download/community) running locally, or a remote [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) database.

---

### Step-by-Step Installation

#### 1. Clone or Download the Project
Clone the repository or download the project files to your local directory:
```bash
git clone <repository-url>
cd "Food Delivery Website"
```

#### 2. Backend Setup & Run
Open a terminal in the root of the project and navigate to the `Backend` folder:
```bash
# Navigate to the Backend folder
cd Backend

# Install backend dependencies
npm install

# Create the environment file from the template
cp .env.example .env
```
Open `Backend/.env` in your code editor and update the variables (especially `MONGODB_URI` and `JWT_SECRET`).

##### Seed the Database:
Run the seed script to wipe the existing records (for development) and populate the database with default restaurants, menu items, the admin account, and a test user account:
```bash
npm run seed
```

##### Start the Backend Server:
Start the backend development server (uses `nodemon` for auto-reloading upon file modifications):
```bash
npm run dev
```
The backend server will start running at `http://localhost:8000` (or the custom `PORT` you configured).

---

#### 3. Frontend Setup & Run
Open a **new terminal** and navigate to the `Frontend` folder:
```bash
# Navigate to the Frontend folder from the root directory
cd Frontend

# Install frontend dependencies
npm install

# Create the environment file from the template
cp .env.example .env
```
Open `Frontend/.env` in your editor and configure `VITE_API_URL` to point to your backend API server (normally `http://localhost:8000/api`).

##### Start the Frontend Dev Server:
Run the Vite development server:
```bash
npm run dev
```
Vite will start the application and provide a local URL, typically `http://localhost:5173`. Open this URL in your web browser.

---

#### 4. Open and Verify the Application
1. Open your browser and navigate to `http://localhost:5173` (or the URL outputted by Vite).
2. Click on **Login** in the navigation bar.
3. Sign in using the **Admin Credentials** (`admin@foodrush.in` / `Admin@123`) to access the dashboard and view sales charts and manage restaurants.
4. Sign in using the **User Credentials** (`user@foodrush.in` / `User@123`) to add dishes to the cart and place mock orders.

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

## Deployment

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

## Author

**Rayudu Bharani**

---

## License

ISC

---

## Complete API Endpoints (Latest)

Base URL (local): `http://localhost:8000`

### Health
- `GET /`

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Restaurants
- `GET /api/restaurants`
- `GET /api/restaurants/:id`
- `GET /api/restaurants/:id/menu`

### Orders
- `POST /api/orders`
- `GET /api/orders`
- `GET /api/orders/:id`
- `PATCH /api/orders/:id/status`

### Admin
- `GET /api/admin/stats`
- `GET /api/admin/orders`
- `PATCH /api/admin/orders/:id/status`
- `GET /api/admin/restaurants`
- `POST /api/admin/restaurants`
- `PATCH /api/admin/restaurants/:id`
- `DELETE /api/admin/restaurants/:id`
- `GET /api/admin/restaurants/:id/menu`
- `POST /api/admin/restaurants/:id/menu`
- `PATCH /api/admin/menu/:id`
- `DELETE /api/admin/menu/:id`
- `GET /api/admin/users`

### Seed (not an API route)
- `npm run seed` from `Backend/`
