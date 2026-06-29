/**
 * Footer — Site-wide footer using Shadcn color tokens.
 */
export default function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="text-2xl">🍕</span>
              <span className="text-lg font-bold text-foreground">FoodRush</span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Delicious meals from your favourite restaurants, delivered fast to
              your doorstep.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground/80">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/" className="transition-colors hover:text-foreground">Home</a></li>
              <li><a href="/orders" className="transition-colors hover:text-foreground">My Orders</a></li>
              <li><a href="/cart" className="transition-colors hover:text-foreground">Cart</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground/80">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>📧 rayudubharani7288@gmail.com</li>
              <li>📞 +91 000000000</li>
              <li>📍 India, India</li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground/80">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="transition-colors hover:text-foreground">Privacy Policy</a></li>
              <li><a href="#" className="transition-colors hover:text-foreground">Terms of Service</a></li>
              <li><a href="#" className="transition-colors hover:text-foreground">Refund Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} FoodRush. Built by Rayudu Bharani.
        </div>
      </div>
    </footer>
  );
}
