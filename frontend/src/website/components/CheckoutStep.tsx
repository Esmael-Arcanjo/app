import { ReactNode } from "react";

export const CheckoutStep = ({ n, title, done, children }: { n: number; title: string; done?: boolean; children: ReactNode }) => (
  <section className="rounded-2xl border border-border bg-card p-6" data-testid={`checkout-step-${n}`}>
    <div className="flex items-center gap-3">
      <span className={`grid h-8 w-8 place-items-center rounded-full font-mono text-xs ${done ? "bg-primary text-primary-foreground" : "bg-foreground text-background"}`}>{n}</span>
      <h2 className="font-display text-lg font-bold">{title}</h2>
    </div>
    <div className="mt-5">{children}</div>
  </section>
);

export const OptionTile = ({ active, onClick, children, testId }: { active: boolean; onClick: () => void; children: ReactNode; testId: string }) => (
  <button type="button" onClick={onClick} data-testid={testId}
    className={`rounded-xl border p-4 text-left transition-colors ${active ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:bg-muted"}`}>
    {children}
  </button>
);
