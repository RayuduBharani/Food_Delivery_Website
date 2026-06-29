import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

/**
 * Navbar — Sticky top navigation with glassmorphism.
 * Shows Admin Panel link for users with role="admin".
 */
export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { itemCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === "admin";

  function handleLogout() {
    logout();
    navigate("/");
    setMobileOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 no-underline">
          <span className="text-2xl">🍕</span>
          <span className="text-lg font-bold tracking-tight text-foreground">FoodRush</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-5 md:flex">
          <Link to="/" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Home
          </Link>
          <Link to="/orders" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            My Orders
          </Link>

          {/* Admin link — only for admins */}
          {isAdmin && (
            <Link
              to="/admin"
              className="flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-all hover:bg-primary/20"
            >
              <LayoutDashboard size={13} />
              Admin Panel
            </Link>
          )}

          {/* Cart */}
          <Link
            to="/cart"
            className="relative flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-accent hover:text-foreground"
          >
            <ShoppingCart size={18} />
            <span>Cart</span>
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground shadow-lg animate-in zoom-in duration-200">
                {itemCount}
              </span>
            )}
          </Link>

          {/* Auth */}
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {user?.fullName?.[0]?.toUpperCase() ?? "?"}
                </div>
                <span className="max-w-[100px] truncate text-xs text-muted-foreground">{user?.fullName}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:bg-accent hover:text-foreground"
              >
                <LogOut size={14} />
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:brightness-110"
            >
              <User size={16} />
              Login
            </Link>
          )}
        </nav>

        {/* Mobile Controls */}
        <div className="flex items-center gap-3 md:hidden">
          <Link to="/cart" className="relative p-2 text-muted-foreground">
            <ShoppingCart size={20} />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground">
                {itemCount}
              </span>
            )}
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-muted-foreground"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-background/95 px-4 py-4 backdrop-blur-xl md:hidden animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-2">
            <Link to="/" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
              Home
            </Link>
            <Link to="/orders" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
              My Orders
            </Link>
            {isAdmin && (
              <Link to="/admin" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-3 py-2.5 text-sm font-semibold text-primary">
                <LayoutDashboard size={15} />
                Admin Panel
              </Link>
            )}
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2 px-3 py-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {user?.fullName?.[0]?.toUpperCase() ?? "?"}
                  </div>
                  <span className="text-sm text-muted-foreground">{user?.fullName}</span>
                </div>
                <button onClick={handleLogout} className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-accent">
                  <LogOut size={16} /> Logout
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMobileOpen(false)} className="rounded-lg bg-primary px-3 py-2.5 text-center text-sm font-semibold text-primary-foreground">
                Login
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
