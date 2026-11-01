import { Logo } from "./Logo";

export const PublicFooter = () => (
  <footer className="w-full border-t border-border bg-foreground text-background" data-testid="public-footer">
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-12 sm:px-6 md:flex-row md:items-center md:justify-between">
      <Logo light />
      <p className="text-sm text-background/60">© {new Date().getFullYear()} LEAMSE. Nove produtos, assinaturas independentes.</p>
    </div>
  </footer>
);
