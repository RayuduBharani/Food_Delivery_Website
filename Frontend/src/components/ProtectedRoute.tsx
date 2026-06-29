import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import type { ReactNode } from "react";

interface Props { children: ReactNode; }

/**
 * ProtectedRoute — Blocks unauthenticated access.
 *
 * Waits for AuthContext to finish reading localStorage (isLoading)
 * before making any redirect decision — prevents the flash-redirect
 * to /login on page refresh for logged-in users.
 */
export default function ProtectedRoute({ children }: Props) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Still reading localStorage — render nothing to avoid premature redirect
  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
