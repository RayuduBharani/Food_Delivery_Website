import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

/**
 * Login Page
 *
 * After a successful login the user is redirected to:
 *   1. The page they were trying to visit before being blocked (location.state.from), OR
 *   2. The home page (default fallback)
 *
 * This "redirect after login" pattern is set by ProtectedRoute which
 * passes { state: { from: location } } to the Navigate component.
 */
export default function Login() {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Where to go after login — default to home
  const from = (location.state as { from?: Location })?.from?.pathname ?? "/";

  function validate(): Record<string, string> {
    const e: Record<string, string> = {};
    if (!loginId.trim()) e.loginId = "Enter your email or phone";
    if (!password) e.password = "Enter your password";
    return e;
  }

  async function handleSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      const res = await fetch("https://food-delivery-website-seven-theta.vercel.app/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ loginId, password }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.message || "Login failed. Please try again.");
      } else {
        login(data.user, data.token);
        toast.success("Welcome back!");
        // Send user back to where they came from, or home
        navigate(from, { replace: true });
      }
    } catch {
      toast.error("Could not reach the server. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  const inputClass = (field: string) =>
    `w-full rounded-lg border bg-input px-3.5 py-2.5 text-sm text-foreground placeholder-muted-foreground outline-none transition-all focus:ring-1 ${
      errors[field]
        ? "border-destructive focus:ring-destructive"
        : "border-border focus:border-ring focus:ring-ring"
    }`;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      {/* Brand */}
      <div className="mb-6 flex flex-col items-center gap-1">
        <span className="text-4xl">🍕</span>
        <span className="text-xl font-bold tracking-tight text-foreground">FoodRush</span>
      </div>

      {/* Redirect hint */}
      {from !== "/" && (
        <p className="mb-4 rounded-lg border border-primary/30 bg-primary/5 px-4 py-2 text-xs text-primary">
          Please log in to continue to that page.
        </p>
      )}

      {/* Card */}
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl">
        <div className="mb-6">
          <h1 className="text-lg font-semibold text-card-foreground">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Log in with your email or phone number.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Login ID */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Email or phone
            </label>
            <input
              type="text"
              placeholder="you@example.com or +91 98765 43210"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              autoComplete="username"
              className={inputClass("loginId")}
            />
            {errors.loginId && (
              <p className="mt-1 text-xs text-destructive">{errors.loginId}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className={`${inputClass("password")} pr-16`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-destructive">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? "Logging in…" : "Log in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/signup" className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
