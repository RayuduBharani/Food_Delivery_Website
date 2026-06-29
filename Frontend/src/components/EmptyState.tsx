import type { ReactNode } from "react";

interface Props {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

/**
 * EmptyState — Reusable placeholder using Shadcn tokens.
 */
export default function EmptyState({ icon, title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon && <div className="mb-4 text-5xl text-muted-foreground/40">{icon}</div>}
      <h3 className="mb-2 text-lg font-semibold text-foreground/80">{title}</h3>
      {description && <p className="mb-6 max-w-sm text-sm text-muted-foreground">{description}</p>}
      {action}
    </div>
  );
}
