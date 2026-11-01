import { useCallback } from "react";
import { Link } from "react-router-dom";
import { CalendarClock, CircleDollarSign, Trophy, UserPlus, Users, Target } from "lucide-react";
import { PageTitle } from "@/shared/components/PageTitle";
import { EmptyState, ErrorState, LoadingState } from "@/shared/components/States";
import { useCrmApi } from "../services/crmApi";
import { useAsyncData } from "../hooks/useAsyncData";
import { KpiCard } from "../components/KpiCard";
import type { Overview } from "../types/crm";
import { ACTIVITY_TYPE, dateTime, LEAD_STATUS, money } from "../utils/format";

export default function DashboardPage() {
  const api = useCrmApi();
  const { data, error, loading, reload } = useAsyncData<Overview>(useCallback(() => api.overview(), [api]));
  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (loading || !data) return <LoadingState />;
  const maxStage = Math.max(1, ...data.stages.map((s) => s.value_cents));

  return (
    <div className="space-y-6" data-testid="crm-dashboard">
      <PageTitle title="Painel de vendas" subtitle="Indicadores calculados em tempo real a partir dos dados da sua organização." />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <KpiCard label="Leads" value={data.leads_total} icon={UserPlus} testId="kpi-leads" />
        <KpiCard label="Contatos" value={data.contacts_total} icon={Users} testId="kpi-contacts" />
        <KpiCard label="Oportunidades abertas" value={data.open_opportunities} icon={Target} testId="kpi-open-opps" />
        <KpiCard label="Pipeline aberto" value={money(data.open_value_cents)} hint={`Ponderado: ${money(data.weighted_value_cents)}`} icon={CircleDollarSign} testId="kpi-pipeline" />
        <KpiCard label="Ganhos" value={money(data.won_value_cents)} hint={`${data.won_count} negócio(s)`} icon={Trophy} testId="kpi-won" />
        <KpiCard label="Atividades pendentes" value={data.pending_activities} icon={CalendarClock} testId="kpi-activities" />
      </div>
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-6 xl:col-span-2" data-testid="dashboard-stages">
          <h2 className="font-display text-base font-bold">Funil por etapa</h2>
          <div className="mt-5 space-y-4">
            {data.stages.map((s) => (
              <div key={s.key}>
                <div className="flex justify-between text-sm"><span className="font-medium">{s.name} <span className="text-muted-foreground">({s.count})</span></span><span className="font-mono">{money(s.value_cents)}</span></div>
                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-[color:var(--product)] transition-[width] duration-700" style={{ width: `${(s.value_cents / maxStage) * 100}%` }} /></div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {Object.entries(data.leads_by_status).map(([k, v]) => <span key={k} className="rounded-full bg-muted px-3 py-1 text-xs font-medium">{LEAD_STATUS[k] || k}: {v}</span>)}
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-6" data-testid="dashboard-upcoming">
          <div className="flex items-center justify-between"><h2 className="font-display text-base font-bold">Próximas atividades</h2><Link to="/crm/atividades" className="text-xs font-semibold text-[color:var(--product)]" data-testid="dashboard-see-activities">Ver todas</Link></div>
          {data.upcoming_activities.length === 0 ? <div className="mt-4"><EmptyState title="Sem atividades pendentes" /></div> : (
            <ul className="mt-4 divide-y divide-border">
              {data.upcoming_activities.map((a) => <li key={a.id} className="py-3"><p className="text-sm font-semibold">{a.subject}</p><p className="text-xs text-muted-foreground">{ACTIVITY_TYPE[a.type]} · {dateTime(a.due_at)}</p></li>)}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
