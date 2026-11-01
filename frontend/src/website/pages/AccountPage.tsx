import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ArrowUpRight, MailWarning } from "lucide-react";
import { Button } from "@/components/ui/button";
import { errMsg } from "@/shared/api/client";
import { useAuth } from "@/shared/auth/AuthContext";
import { EmptyState, ErrorState, LoadingState } from "@/shared/components/States";
import { PublicLayout } from "../layouts/PublicLayout";
import { mySubscriptions } from "../services/billing";

type Sub = Awaited<ReturnType<typeof mySubscriptions>>["subscriptions"][number];
const STATUS: Record<string, string> = { active: "Ativa", past_due: "Pagamento pendente", canceled: "Cancelada", expired: "Expirada", suspended: "Suspensa", pending: "Pendente" };

export default function AccountPage() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [subs, setSubs] = useState<Sub[] | null>(null);
  const [error, setError] = useState("");
  useEffect(() => { if (user) mySubscriptions().then((d) => setSubs(d.subscriptions)).catch((e) => setError(errMsg(e))); }, [user]);

  if (loading) return <LoadingState />;
  if (!user) return <Navigate to="/entrar?next=/minha-conta" replace />;
  return (
    <PublicLayout>
      <div className="mx-auto w-full max-w-5xl space-y-8 px-4 py-14 sm:px-6" data-testid="account-page">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-extrabold">Olá, {user.name.split(" ")[0]}!</h1>
            <p className="mt-1 text-sm text-muted-foreground">Endereços dos produtos contratados. Cada produto abre em seu próprio painel.</p>
          </div>
          <Button variant="outline" className="rounded-full" onClick={async () => { await logout(); navigate("/"); }} data-testid="account-logout">Sair</Button>
        </div>
        {!user.email_verified && (
          <p className="flex items-center gap-2 rounded-xl border border-warning/40 bg-warning/10 p-4 text-sm" data-testid="account-unverified"><MailWarning className="h-4 w-4" /> Confirme seu e-mail pelo link enviado para {user.email}.</p>
        )}
        {error ? <ErrorState message={error} /> : !subs ? <LoadingState /> : subs.length === 0 ? (
          <EmptyState title="Nenhum produto contratado" description="Escolha um produto para começar." action={<Button asChild className="rounded-full"><Link to="/#produtos" data-testid="account-browse">Ver produtos</Link></Button>} />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {subs.map((s) => (
              <Link key={`${s.product_key}-${s.organization_name}`} to={`/${s.slug}`} className="group rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-md" data-testid={`account-product-${s.product_key}`}>
                <div className="flex items-center justify-between"><p className="font-display text-lg font-extrabold">{s.product_name}</p><ArrowUpRight className="h-5 w-5" /></div>
                <p className="mt-1 text-sm text-muted-foreground">{s.organization_name} · plano {s.plan_key}</p>
                <p className="mt-3 font-mono text-xs text-muted-foreground">{window.location.host}/{s.slug}</p>
                <span className="mt-3 inline-block rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold">{STATUS[s.status] || s.status}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
