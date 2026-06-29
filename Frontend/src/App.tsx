import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";

// Layouts & Guards
import MainLayout from "@/layouts/MainLayout";
import AdminLayout from "@/layouts/AdminLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminRoute from "@/components/AdminRoute";

// Customer Pages
import Home from "@/pages/Home";
import RestaurantDetail from "@/pages/RestaurantDetail";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import OrderSuccess from "@/pages/OrderSuccess";
import OrderHistory from "@/pages/OrderHistory";
import Login from "@/pages/Auth/login";
import SignUp from "@/pages/Auth/signUp";
import NotFound from "@/pages/NotFound";

// Admin Pages
import AdminDashboard from "@/pages/Admin/AdminDashboard";
import AdminOrders from "@/pages/Admin/AdminOrders";
import AdminRestaurants from "@/pages/Admin/AdminRestaurants";
import AdminUsers from "@/pages/Admin/AdminUsers";

/**
 * App — Root routing with auth guards.
 *
 * Public:       /  /restaurant/:id  /login  /signup
 * Protected:    /cart  /checkout  /order-success/:id  /orders
 * Admin only:   /admin  /admin/orders  /admin/restaurants  /admin/users
 */
function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Toaster richColors position="top-center" />
          <Routes>

            {/* ── Auth pages (no navbar/footer) ─────────────────── */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/register" element={<SignUp />} />

            {/* ── Admin section ─────────────────────────────────── */}
            <Route
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            >
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route path="/admin/restaurants" element={<AdminRestaurants />} />
              <Route path="/admin/users" element={<AdminUsers />} />
            </Route>

            {/* ── Main app (navbar + footer) ────────────────────── */}
            <Route element={<MainLayout />}>
              {/* Public */}
              <Route path="/" element={<Home />} />
              <Route path="/restaurant/:id" element={<RestaurantDetail />} />

              {/* Protected */}
              <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
              <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
              <Route path="/order-success/:id" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
              <Route path="/orders" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Route>

          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
