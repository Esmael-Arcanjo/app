import { useCallback } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { errMsg } from "@/shared/api/client";
import { PageTitle } from "@/shared/components/PageTitle";
import { EmptyState, ErrorState, LoadingState } from "@/shared/components/States";
import { useCrmApi } from "../services/crmApi";
import { useAsyncData } from "../hooks/useAsyncData";
import { dateTime, money } from "../utils/format";

type Billing = {
  subscription: { status: string; plan_name: string; price_cents: number; currency: string; cancel_at_period_end: boolean; current_period_end: number | null; activated_at: string | null };
  history: { id: string; amount: number; currency: string; payment_status: string; created_at: string }[];
  can_manage: boolean;
};
const STATUS: Record<string, string> = { active: "Ativa", past_due: "Pagamento pendente", pending: "Pendente", paid: "Pago", initiated: "Iniciado", expired: "Expirado", canceled: "Cancelada", suspended: "Suspensa" };

export default function BillingPage() {
  const api = useCrmApi();
  const { data, error, loading, reload } = useAsyncData<Billing>(useCallback(() => api.subscription(), [api]));
  const run = async (fn: () => Promise<unknown>, msg: string) => {
    try { await fn(); toast.success(msg); reload(); } catch (e) { toast.error(errMsg(e)); }
  };
  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (loading && !data) return <LoadingState />;
  const s = data!.subscription;
  return (
    <div className="space-y-6" data-testid="crm-billing-page">
      <PageTitle title="Assinatura" subtitle="Assinatura exclusiva do CRM de Vendas para esta organização." />
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5"><p className="text-xs uppercase tracking-widest text-muted-foreground">Plano</p><p className="mt-2 font-display text-2xl font-extrabold" data-testid="billing-plan">{s.plan_name}</p><p className="text-sm text-muted-foreground">{money(s.price_cents)}/mês</p></div>
        <div className="rounded-xl border border-border bg-card p-5"><p className="text-xs uppercase tracking-widest text-muted-foreground">Situação</p><p className="mt-2 font-display text-2xl font-extrabold" data-testid="billing-status">{STATUS[s.status] || s.status}</p>{s.cancel_at_period_end && <p className="text-sm text-warning">Cancelamento agendado para o fim do período</p>}</div>
        <div className="rounded-xl border border-border bg-card p-5"><p className="text-xs uppercase tracking-widest text-muted-foreground">Próxima renovação</p><p className="mt-2 font-display text-2xl font-extrabold">{s.current_period_end ? new Date(s.current_period_end * 1000).toLocaleDateString("pt-BR") : "—"}</p><p className="text-sm text-muted-foreground">Ativada em {dateTime(s.activated_at)}</p></div>
      </div>
      {data!.can_manage && (
        <div className="flex flex-wrap gap-3">
          {s.cancel_at_period_end
            ? <Button className="rounded-full" onClick={() => run(api.resume, "Assinatura retomada")} data-testid="billing-resume">Retomar assinatura</Button>
            : <Button variant="outline" className="rounded-full" onClick={() => run(api.cancel, "Cancelamento agendado")} data-testid="billing-cancel">Cancelar no fim do período</Button>}
        </div>
      )}
      <div className="rounded-xl border border-border bg-card p-5" data-testid="billing-history">
        <h2 className="font-display text-base font-bold">Histórico de cobranças</h2>
        {data!.history.length === 0 ? <EmptyState title="Sem cobranças" /> : (
          <ul className="mt-3 divide-y divide-border">
            {data!.history.map((h) => <li key={h.id} className="flex justify-between py-2 text-sm"><span>{dateTime(h.created_at)}</span><span className="font-mono">{money(h.amount * 100)}</span><span className="rounded-full bg-muted px-2 py-0.5 text-xs font-semibold">{STATUS[h.payment_status] || h.payment_status}</span></li>)}
          </ul>
        )}
      </div>
    </div>
  );
}
