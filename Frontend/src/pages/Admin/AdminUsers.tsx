import { useEffect, useState } from "react";
import { getAdminUsers, type AdminUser } from "@/api/admin";
import { Users } from "lucide-react";

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminUsers()
      .then((res) => setUsers(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Customers</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">{users.length} registered customers</p>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        {loading ? (
          <div className="space-y-px">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 border-b border-border px-5 py-4">
                <div className="h-9 w-9 animate-pulse rounded-full bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-36 animate-pulse rounded bg-muted" />
                  <div className="h-2.5 w-48 animate-pulse rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <Users size={36} className="mb-3 opacity-40" />
            <p>No customers yet</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {/* Table header */}
            <div className="grid grid-cols-4 gap-4 px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              <span>Name</span>
              <span>Email</span>
              <span>Phone</span>
              <span>Joined</span>
            </div>
            {users.map((user) => (
              <div key={user._id} className="grid grid-cols-4 gap-4 px-5 py-3 text-sm transition-colors hover:bg-accent/30">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                  <span className="truncate font-medium text-foreground">{user.fullName}</span>
                </div>
                <span className="truncate text-muted-foreground self-center">{user.email}</span>
                <span className="text-muted-foreground self-center">{user.phone}</span>
                <span className="text-muted-foreground self-center">
                  {new Date(user.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
