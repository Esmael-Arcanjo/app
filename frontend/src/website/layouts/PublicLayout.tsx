import { ReactNode } from "react";
import { PublicHeader } from "../components/PublicHeader";
import { PublicFooter } from "../components/PublicFooter";

export const PublicLayout = ({ children }: { children: ReactNode }) => (
  <div className="flex min-h-screen w-full flex-col bg-background">
    <PublicHeader />
    <main className="w-full flex-1">{children}</main>
    <PublicFooter />
  </div>
);

export const AuthCard = ({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) => (
  <PublicLayout>
    <div className="grain flex w-full justify-center px-4 py-16 sm:py-24">
      <div className="fade-up w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm">
        <h1 className="font-display text-2xl font-extrabold tracking-tight" data-testid="auth-title">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
        <div className="mt-6">{children}</div>
      </div>
    </div>
  </PublicLayout>
);
