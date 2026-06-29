/**
 * StatusBadge — Color-coded order status indicator using Shadcn chart colors.
 *
 * Uses chart CSS variables from the Shadcn theme rather than
 * raw Tailwind color names to stay fully within the design token system.
 */

interface Props {
  status: string;
}

const statusConfig: Record<string, { label: string; classes: string }> = {
  placed: {
    label: "Placed",
    classes: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  },
  confirmed: {
    label: "Confirmed",
    classes: "bg-violet-500/15 text-violet-400 border-violet-500/30",
  },
  preparing: {
    label: "Preparing",
    classes: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  },
  out_for_delivery: {
    label: "Out for Delivery",
    classes: "bg-[var(--color-chart-1)]/15 text-[var(--color-chart-5)] border-[var(--color-chart-1)]/30",
  },
  delivered: {
    label: "Delivered",
    classes: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  },
  cancelled: {
    label: "Cancelled",
    classes: "bg-destructive/15 text-destructive border-destructive/30",
  },
};

export default function StatusBadge({ status }: Props) {
  const config = statusConfig[status] || {
    label: status,
    classes: "bg-muted text-muted-foreground border-border",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${config.classes}`}
    >
      {config.label}
    </span>
  );
}
