import { useCallback } from "react";
import { PageTitle } from "@/shared/components/PageTitle";
import { EmptyState, ErrorState, LoadingState } from "@/shared/components/States";
import { useCrmApi } from "../services/crmApi";
import { useAsyncData } from "../hooks/useAsyncData";
import { dateTime } from "../utils/format";

type Event = { id: string; action: string; user_name: string; target_type: string | null; created_at: string };

const LABELS: Record<string, string> = {
  "crm.lead_created": "Lead criado", "crm.lead_updated": "Lead atualizado", "crm.lead_deleted": "Lead excluído", "crm.lead_converted": "Lead convertido",
  "crm.contact_created": "Contato criado", "crm.contact_updated": "Contato atualizado", "crm.contact_deleted": "Contato excluído",
  "crm.opportunity_created": "Oportunidade criada", "crm.opportunity_updated": "Oportunidade atualizada", "crm.opportunity_deleted": "Oportunidade excluída", "crm.opportunity_stage_moved": "Etapa alterada",
  "crm.activity_created": "Atividade criada", "crm.activity_updated": "Atividade atualizada", "crm.activity_deleted": "Atividade excluída", "crm.pipeline_updated": "Funil atualizado",
  "subscription.activated": "Assinatura ativada", "subscription.cancel_requested": "Cancelamento solicitado", "subscription.resumed": "Assinatura retomada",
  "billing.checkout_created": "Checkout iniciado", "organization.invite_sent": "Convite enviado", "organization.invite_accepted": "Convite aceito",
  "organization.role_changed": "Papel alterado", "organization.member_removed": "Membro removido",
};

export default function AuditPage() {
  const api = useCrmApi();
  const { data, error, loading, reload } = useAsyncData<Event[]>(useCallback(() => api.audit(), [api]));
  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (loading && !data) return <LoadingState />;
  return (
    <div className="space-y-6" data-testid="crm-audit-page">
      <PageTitle title="Histórico de atividades" subtitle="Registro auditável das operações neste produto (retenção de 365 dias)." />
      {!data!.length ? <EmptyState title="Nenhum evento registrado" /> : (
        <ol className="relative space-y-0 rounded-xl border border-border bg-card p-5" data-testid="audit-list">
          {data!.map((e) => (
            <li key={e.id} className="flex gap-4 border-l-2 border-border pb-5 pl-5 last:pb-0">
              <div className="min-w-0 flex-1"><p className="text-sm font-semibold">{LABELS[e.action] || e.action}</p><p className="text-xs text-muted-foreground">{e.user_name} · {dateTime(e.created_at)}</p></div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
