import { Link } from "react-router-dom";
import { useAuth } from "@/shared/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";

export const PublicHeader = () => {
  const { user } = useAuth();
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-xl" data-testid="public-header">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
          <a href="/#produtos" className="transition-colors hover:text-foreground" data-testid="nav-products">Produtos</a>
          <a href="/#segmentos" className="transition-colors hover:text-foreground" data-testid="nav-segments">Segmentos</a>
          <a href="/#seguranca" className="transition-colors hover:text-foreground" data-testid="nav-security">Segurança</a>
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <Button asChild size="sm" className="rounded-full"><Link to="/minha-conta" data-testid="nav-account">Minha conta</Link></Button>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm"><Link to="/entrar" data-testid="nav-login">Entrar</Link></Button>
              <Button asChild size="sm" className="rounded-full"><Link to="/cadastro" data-testid="nav-register">Criar conta</Link></Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
