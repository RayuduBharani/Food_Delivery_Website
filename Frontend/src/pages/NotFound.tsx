import { Link } from "react-router-dom";
import { Home } from "lucide-react";

/**
 * NotFound (404) Page — Shadcn tokens.
 */
export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="mb-2 text-[8rem] font-extrabold leading-none text-muted/50 sm:text-[10rem]">404</h1>
      <div className="-mt-12 mb-4 text-5xl">🍽️</div>
      <h2 className="mb-2 text-xl font-bold text-foreground">Page Not Found</h2>
      <p className="mb-6 max-w-sm text-sm text-muted-foreground">
        Looks like this page got delivered to the wrong address. Let's get you back on track!
      </p>
      <Link to="/" className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:brightness-110">
        <Home size={16} /> Go Home
      </Link>
    </div>
  );
}
