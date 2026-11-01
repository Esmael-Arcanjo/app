import { useCallback, useState } from "react";
import { toast } from "sonner";
import { ArrowRightLeft, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { errMsg } from "@/shared/api/client";
import { PageTitle } from "@/shared/components/PageTitle";
import { EmptyState, ErrorState, LoadingState } from "@/shared/components/States";
import { useCrmApi } from "../services/crmApi";
import { useAsyncData } from "../hooks/useAsyncData";
import { useCrmContext } from "../hooks/useCrmContext";
import { LeadFormDialog } from "../components/LeadFormDialog";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { NativeSelect } from "../components/FormField";
import type { Lead, SegmentConfig } from "../types/crm";
import { canDelete, canWrite, LEAD_STATUS, money } from "../utils/format";

export default function LeadsPage() {
  const api = useCrmApi();
  const { role } = useCrmContext();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [editing, setEditing] = useState<Lead | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [toDelete, setToDelete] = useState<Lead | null>(null);
  const config = useAsyncData<SegmentConfig>(useCallback(() => api.segmentConfig(), [api]));
  const leads = useAsyncData<Lead[]>(useCallback(() => api.list<Lead>("leads", { q: q || undefined, status: status || undefined }), [api, q, status]));

  const convert = async (lead: Lead) => {
    try { await api.convertLead(lead.id); toast.success("Lead convertido em contato e oportunidade"); leads.reload(); } catch (e) { toast.error(errMsg(e)); }
  };
  const remove = async () => {
    if (!toDelete) return;
    try { await api.remove("leads", toDelete.id); toast.success("Lead excluído"); leads.reload(); } catch (e) { toast.error(errMsg(e)); } finally { setToDelete(null); }
  };
  const fieldLabel = (k: string) => config.data?.lead_fields.find((f) => f.key === k)?.label || k;

  return (
    <div className="space-y-6" data-testid="crm-leads-page">
      <PageTitle title="Leads" subtitle="Campos adicionais configurados para o seu segmento."
        actions={canWrite(role) && <Button onClick={() => { setEditing(null); setFormOpen(true); }} disabled={!config.data} className="rounded-full" data-testid="lead-new-button"><Plus className="mr-1 h-4 w-4" /> Novo lead</Button>} />
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Buscar por nome, e-mail ou empresa" value={q} onChange={(e) => setQ(e.target.value)} data-testid="lead-search-input" /></div>
        <NativeSelect className="sm:w-56" value={status} onChange={(e) => setStatus(e.target.value)} data-testid="lead-status-filter">
          <option value="">Todos os status</option>{Object.entries(LEAD_STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </NativeSelect>
      </div>
      {leads.error ? <ErrorState message={leads.error} onRetry={leads.reload} /> : leads.loading && !leads.data ? <LoadingState /> : !leads.data?.length ? (
        <EmptyState title="Nenhum lead encontrado" description="Cadastre seu primeiro lead para iniciar o funil." />
      ) : (
        <div className="w-full overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full min-w-[760px] text-sm" data-testid="leads-table">
            <thead className="border-b border-border bg-muted/50 text-left text-xs uppercase tracking-widest text-muted-foreground">
              <tr><th className="p-4">Nome</th><th className="p-4">Empresa</th><th className="p-4">Status</th><th className="p-4">Valor</th><th className="p-4">Dados do segmento</th><th className="p-4 text-right">Ações</th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {leads.data.map((l) => (
                <tr key={l.id} className="transition-colors hover:bg-muted/30" data-testid={`lead-row-${l.id}`}>
                  <td className="p-4"><p className="font-semibold">{l.name}</p><p className="text-xs text-muted-foreground">{l.email || l.phone || "—"}</p></td>
                  <td className="p-4">{l.company || "—"}</td>
                  <td className="p-4"><span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold">{LEAD_STATUS[l.status]}</span></td>
                  <td className="p-4 font-mono">{money(l.value_cents)}</td>
                  <td className="p-4 text-xs text-muted-foreground">{Object.entries(l.custom_fields).map(([k, v]) => `${fieldLabel(k)}: ${v}`).join(" · ") || "—"}</td>
                  <td className="p-4">
                    <div className="flex justify-end gap-1">
                      {canWrite(role) && l.status !== "converted" && <>
                        <Button variant="ghost" size="icon" title="Converter" onClick={() => convert(l)} data-testid={`lead-convert-${l.id}`}><ArrowRightLeft className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" title="Editar" onClick={() => { setEditing(l); setFormOpen(true); }} data-testid={`lead-edit-${l.id}`}><Pencil className="h-4 w-4" /></Button>
                      </>}
                      {canDelete(role) && <Button variant="ghost" size="icon" title="Excluir" onClick={() => setToDelete(l)} data-testid={`lead-delete-${l.id}`}><Trash2 className="h-4 w-4 text-destructive" /></Button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {config.data && <LeadFormDialog open={formOpen} lead={editing} config={config.data} onClose={() => setFormOpen(false)} onSaved={() => { setFormOpen(false); leads.reload(); }} />}
      <ConfirmDialog open={!!toDelete} title="Excluir lead?" description="Esta ação não pode ser desfeita." onCancel={() => setToDelete(null)} onConfirm={remove} />
    </div>
  );
}
