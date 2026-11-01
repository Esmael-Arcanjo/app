import { useCallback, useState } from "react";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { errMsg } from "@/shared/api/client";
import { PageTitle } from "@/shared/components/PageTitle";
import { ErrorState, LoadingState } from "@/shared/components/States";
import { useCrmApi } from "../services/crmApi";
import { useAsyncData } from "../hooks/useAsyncData";
import { useCrmContext } from "../hooks/useCrmContext";
import { OpportunityFormDialog } from "../components/OpportunityFormDialog";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { NativeSelect } from "../components/FormField";
import type { Contact, Opportunity, Pipeline } from "../types/crm";
import { canDelete, canWrite, money, OPP_STATUS } from "../utils/format";

type Data = { pipeline: Pipeline; opps: Opportunity[]; contacts: Contact[] };

export default function OpportunitiesPage() {
  const api = useCrmApi();
  const { role } = useCrmContext();
  const [editing, setEditing] = useState<Opportunity | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [toDelete, setToDelete] = useState<Opportunity | null>(null);
  const { data, error, loading, reload } = useAsyncData<Data>(useCallback(async () => {
    const [pipeline, opps, contacts] = await Promise.all([api.pipeline(), api.list<Opportunity>("opportunities"), api.list<Contact>("contacts")]);
    return { pipeline, opps, contacts };
  }, [api]));

  const move = async (o: Opportunity, stage: string) => {
    try { await api.moveStage(o.id, stage, o.version); toast.success("Etapa atualizada"); reload(); } catch (e) { toast.error(errMsg(e)); reload(); }
  };
  const remove = async () => {
    if (!toDelete) return;
    try { await api.remove("opportunities", toDelete.id); toast.success("Oportunidade excluída"); reload(); } catch (e) { toast.error(errMsg(e)); } finally { setToDelete(null); }
  };

  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (loading && !data) return <LoadingState />;
  const contactName = (id: string | null) => data!.contacts.find((c) => c.id === id)?.name;
  const closed = data!.opps.filter((o) => o.status !== "open");

  return (
    <div className="space-y-6" data-testid="crm-opportunities-page">
      <PageTitle title="Oportunidades" subtitle={`Funil: ${data!.pipeline.name}`}
        actions={canWrite(role) && <Button onClick={() => { setEditing(null); setFormOpen(true); }} className="rounded-full" data-testid="opportunity-new-button"><Plus className="mr-1 h-4 w-4" /> Nova oportunidade</Button>} />
      <div className="flex w-full gap-4 overflow-x-auto pb-2" data-testid="opportunity-board">
        {data!.pipeline.stages.map((s) => {
          const items = data!.opps.filter((o) => o.status === "open" && o.stage_key === s.key);
          return (
            <div key={s.key} className="flex w-72 shrink-0 flex-col rounded-xl border border-border bg-card/60 xl:w-auto xl:flex-1" data-testid={`stage-column-${s.key}`}>
              <div className="border-b border-border p-4"><p className="font-display text-sm font-bold">{s.name}</p><p className="text-xs text-muted-foreground">{items.length} · {money(items.reduce((a, o) => a + o.value_cents, 0))} · {s.probability}%</p></div>
              <div className="flex-1 space-y-3 p-3">
                {items.map((o) => (
                  <div key={o.id} className="rounded-lg border border-border bg-card p-3 shadow-sm" data-testid={`opportunity-card-${o.id}`}>
                    <p className="text-sm font-semibold">{o.title}</p>
                    <p className="text-xs text-muted-foreground">{contactName(o.contact_id) || "Sem contato"}</p>
                    <p className="mt-2 font-mono text-sm">{money(o.value_cents)}</p>
                    {canWrite(role) && (
                      <div className="mt-3 flex items-center gap-1">
                        <NativeSelect className="h-8 text-xs" value={o.stage_key} onChange={(e) => move(o, e.target.value)} aria-label="Mover etapa" data-testid={`opportunity-move-${o.id}`}>
                          {data!.pipeline.stages.map((st) => <option key={st.key} value={st.key}>{st.name}</option>)}
                        </NativeSelect>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditing(o); setFormOpen(true); }} data-testid={`opportunity-edit-${o.id}`}><Pencil className="h-3.5 w-3.5" /></Button>
                        {canDelete(role) && <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setToDelete(o)} data-testid={`opportunity-delete-${o.id}`}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      {closed.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-5" data-testid="opportunities-closed">
          <h2 className="font-display text-base font-bold">Encerradas</h2>
          <ul className="mt-3 divide-y divide-border">
            {closed.map((o) => <li key={o.id} className="flex items-center justify-between py-2 text-sm"><span>{o.title}</span><span className="flex items-center gap-3"><span className="font-mono">{money(o.value_cents)}</span><span className="rounded-full bg-muted px-2 py-0.5 text-xs font-semibold">{OPP_STATUS[o.status]}</span>
              {canWrite(role) && <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditing(o); setFormOpen(true); }} data-testid={`opportunity-closed-edit-${o.id}`}><Pencil className="h-3.5 w-3.5" /></Button>}</span></li>)}
          </ul>
        </div>
      )}
      <OpportunityFormDialog open={formOpen} opp={editing} stages={data!.pipeline.stages} contacts={data!.contacts} onClose={() => setFormOpen(false)} onSaved={() => { setFormOpen(false); reload(); }} />
      <ConfirmDialog open={!!toDelete} title="Excluir oportunidade?" description="Esta ação não pode ser desfeita." onCancel={() => setToDelete(null)} onConfirm={remove} />
    </div>
  );
}
