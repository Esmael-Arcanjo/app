import { ReactNode } from "react";
import { AlertTriangle, Inbox, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const LoadingState = ({ label = "Carregando..." }: { label?: string }) => (
  <div className="flex min-h-[240px] w-full items-center justify-center gap-3 text-sm text-muted-foreground" data-testid="state-loading">
    <Loader2 className="h-5 w-5 animate-spin" /> {label}
  </div>
);

export const ErrorState = ({ message, onRetry }: { message: string; onRetry?: () => void }) => (
  <div className="flex min-h-[240px] w-full flex-col items-center justify-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center" data-testid="state-error">
    <AlertTriangle className="h-6 w-6 text-destructive" />
    <p className="max-w-md text-sm">{message}</p>
    {onRetry && <Button variant="outline" size="sm" onClick={onRetry} data-testid="state-error-retry">Tentar novamente</Button>}
  </div>
);

export const EmptyState = ({ title, description, action }: { title: string; description?: string; action?: ReactNode }) => (
  <div className="flex min-h-[220px] w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-card p-10 text-center" data-testid="state-empty">
    <Inbox className="h-6 w-6 text-muted-foreground" />
    <p className="font-display font-bold">{title}</p>
    {description && <p className="max-w-md text-sm text-muted-foreground">{description}</p>}
    {action && <div className="mt-2">{action}</div>}
  </div>
);
