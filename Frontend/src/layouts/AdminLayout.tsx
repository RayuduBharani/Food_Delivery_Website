import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, ShoppingBag, UtensilsCrossed,
  Users, LogOut, Home, ChevronRight,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag, end: false },
  { to: "/admin/restaurants", label: "Restaurants", icon: UtensilsCrossed, end: false },
  { to: "/admin/users", label: "Users", icon: Users, end: false },
];

/**
 * AdminLayout — Sidebar + content area for all admin pages.
 */
export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* ── Sidebar ─────────────────────────────────────────────────── */}
      <aside className="flex w-60 flex-col border-r border-border bg-card">
        {/* Brand */}
        <div className="flex h-16 items-center gap-2.5 border-b border-border px-5">
          <span className="text-2xl">🍕</span>
          <div>
            <p className="text-sm font-bold text-foreground">FoodRush</p>
            <p className="text-[10px] font-medium uppercase tracking-wider text-primary">Admin Panel</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-0.5 px-3 py-4">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={17} />
                  <span className="flex-1">{label}</span>
                  {isActive && <ChevronRight size={14} className="text-primary" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-border px-3 py-4 space-y-1">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-accent hover:text-foreground"
          >
            <Home size={17} />
            View Site
          </a>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut size={17} />
            Logout
          </button>
        </div>
      </aside>

      {/* ── Main Content ────────────────────────────────────────────── */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
