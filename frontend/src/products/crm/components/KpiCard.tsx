import { LucideIcon } from "lucide-react";

export const KpiCard = ({ label, value, hint, icon: Icon, testId }: { label: string; value: string | number; hint?: string; icon: LucideIcon; testId: string }) => (
  <div className="rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-sm" data-testid={testId}>
    <div className="flex items-center justify-between">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</p>
      <Icon className="h-4 w-4 text-[color:var(--product)]" />
    </div>
    <p className="mt-3 font-display text-2xl font-extrabold sm:text-3xl">{value}</p>
    {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
  </div>
);
