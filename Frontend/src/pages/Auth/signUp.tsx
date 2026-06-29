import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

/**
 * Signup Page — Using Shadcn tokens.
 */
export default function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function validate(): Record<string, string> {
    const e: Record<string, string> = {};
    if (!fullName.trim()) e.fullName = "Full name is required";
    if (!email.trim()) e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = "Enter a valid email";
    if (!phone.trim()) e.phone = "Phone number is required";
    else if (!/^\+?[0-9]{7,15}$/.test(phone.replace(/[\s-]/g, ""))) e.phone = "Enter a valid phone number";
    if (!password) e.password = "Password is required";
    else if (password.length < 6) e.password = "Use at least 6 characters";
    return e;
  }

  async function handleSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, phone, password, address }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.message || "Registration failed. Please try again.");
      } else {
        toast.success("Account created! Please log in.");
        setTimeout(() => navigate("/login"), 1200);
      }
    } catch {
      toast.error("Could not reach the server. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass = (field: string) =>
    `w-full rounded-lg border bg-input px-3.5 py-2.5 text-sm text-foreground placeholder-muted-foreground outline-none transition-all focus:ring-1 ${
      errors[field] ? "border-destructive focus:ring-destructive" : "border-border focus:border-ring focus:ring-ring"
    }`;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-6">
      {/* Brand */}
      <div className="mb-6 flex flex-col items-center gap-1">
        <span className="text-4xl">🍕</span>
        <span className="text-xl font-bold text-foreground tracking-tight">FoodRush</span>
      </div>

      {/* Card */}
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl">
        <div className="mb-6">
          <h1 className="text-lg font-semibold text-card-foreground">Create your account</h1>
          <p className="mt-1 text-sm text-muted-foreground">Fill in your details to get started.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Full name</label>
            <input type="text" placeholder="Jane Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} autoComplete="name" className={inputClass("fullName")} />
            {errors.fullName && <p className="mt-1 text-xs text-destructive">{errors.fullName}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Email</label>
            <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" className={inputClass("email")} />
            {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Phone number</label>
            <input type="tel" placeholder="+91 98765 43210" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" className={inputClass("phone")} />
            {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Password</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} placeholder="At least 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password"
                className={`${inputClass("password")} pr-16`} />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground hover:text-foreground">
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Address (optional)</label>
            <input type="text" placeholder="123 Main St, City" value={address} onChange={(e) => setAddress(e.target.value)} autoComplete="street-address" className={inputClass("")} />
          </div>

          <button type="submit" disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60">
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}