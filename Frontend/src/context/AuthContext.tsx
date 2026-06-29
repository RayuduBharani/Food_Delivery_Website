import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface AuthUser {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  role: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  /** true while reading from localStorage on first mount — prevents premature redirects */
  isLoading: boolean;
  login: (user: AuthUser, token: string) => void;
  logout: () => void;
}

// ─── Context ─────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Provider ────────────────────────────────────────────────────────────────
/**
 * AuthProvider — Wraps the app and provides authentication state.
 *
 * KEY FIX: `isLoading` starts `true` and flips to `false` only after
 * localStorage has been read synchronously on mount. This prevents the
 * ProtectedRoute from seeing `isAuthenticated = false` on the very first
 * render and redirecting a legitimately logged-in user to /login on refresh.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // ← starts true

  // Read session from localStorage once on mount
  useEffect(() => {
    try {
      const savedToken = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");
      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      }
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } finally {
      setIsLoading(false); // ← done reading, safe to evaluate routes
    }
  }, []);

  const login = (userData: AuthUser, authToken: string) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem("token", authToken);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
