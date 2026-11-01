import { useCallback, useState } from "react";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { errMsg } from "@/shared/api/client";
import { PageTitle } from "@/shared/components/PageTitle";
import { EmptyState, ErrorState, LoadingState } from "@/shared/components/States";
import { useCrmApi } from "../services/crmApi";
import { useAsyncData } from "../hooks/useAsyncData";
import { useCrmContext } from "../hooks/useCrmContext";
import { ActivityFormDialog } from "../components/ActivityFormDialog";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { NativeSelect } from "../components/FormField";
import type { Activity } from "../types/crm";
import { ACTIVITY_TYPE, canDelete, canWrite, dateTime } from "../utils/format";

export default function ActivitiesPage() {
  const api = useCrmApi();
  const { role } = useCrmContext();
  const [filter, setFilter] = useState("pending");
  const [editing, setEditing] = useState<Activity | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [toDelete, setToDelete] = useState<Activity | null>(null);
  const acts = useAsyncData<Activity[]>(useCallback(() => api.list<Activity>("activities", filter === "all" ? {} : { done: filter === "done" }), [api, filter]));

  const toggle = async (a: Activity) => {
    const { id, organization_id, created_at, updated_at, ...rest } = a;
    try { await api.update("activities", id, { type: rest.type, subject: rest.subject, description: rest.description, due_at: rest.due_at, related_type: rest.related_type, related_id: rest.related_id, done: !a.done, version: a.version }); acts.reload(); }
    catch (e) { toast.error(errMsg(e)); }
  };
  const remove = async () => {
    if (!toDelete) return;
    try { await api.remove("activities", toDelete.id); toast.success("Atividade excluída"); acts.reload(); } catch (e) { toast.error(errMsg(e)); } finally { setToDelete(null); }
  };

  return (
    <div className="space-y-6" data-testid="crm-activities-page">
      <PageTitle title="Atividades" subtitle="Ligações, reuniões, tarefas e anotações da equipe."
        actions={canWrite(role) && <Button onClick={() => { setEditing(null); setFormOpen(true); }} className="rounded-full" data-testid="activity-new-button"><Plus className="mr-1 h-4 w-4" /> Nova atividade</Button>} />
      <NativeSelect className="sm:w-56" value={filter} onChange={(e) => setFilter(e.target.value)} data-testid="activity-filter">
        <option value="pending">Pendentes</option><option value="done">Concluídas</option><option value="all">Todas</option>
      </NativeSelect>
      {acts.error ? <ErrorState message={acts.error} onRetry={acts.reload} /> : acts.loading && !acts.data ? <LoadingState /> : !acts.data?.length ? (
        <EmptyState title="Nenhuma atividade" description="Planeje o próximo contato com seus clientes." />
      ) : (
        <div className="divide-y divide-border rounded-xl border border-border bg-card" data-testid="activities-list">
          {acts.data.map((a) => (
            <div key={a.id} className="flex items-center gap-4 p-4" data-testid={`activity-row-${a.id}`}>
              <Checkbox checked={a.done} disabled={!canWrite(role)} onCheckedChange={() => toggle(a)} aria-label="Concluir" data-testid={`activity-toggle-${a.id}`} />
              <div className="min-w-0 flex-1">
                <p className={`truncate text-sm font-semibold ${a.done ? "text-muted-foreground line-through" : ""}`}>{a.subject}</p>
                <p className="text-xs text-muted-foreground">{ACTIVITY_TYPE[a.type]} · {dateTime(a.due_at)}</p>
              </div>
              {canWrite(role) && <Button variant="ghost" size="icon" onClick={() => { setEditing(a); setFormOpen(true); }} data-testid={`activity-edit-${a.id}`}><Pencil className="h-4 w-4" /></Button>}
              {canDelete(role) && <Button variant="ghost" size="icon" onClick={() => setToDelete(a)} data-testid={`activity-delete-${a.id}`}><Trash2 className="h-4 w-4 text-destructive" /></Button>}
            </div>
          ))}
        </div>
      )}
      <ActivityFormDialog open={formOpen} activity={editing} onClose={() => setFormOpen(false)} onSaved={() => { setFormOpen(false); acts.reload(); }} />
      <ConfirmDialog open={!!toDelete} title="Excluir atividade?" description="Esta ação não pode ser desfeita." onCancel={() => setToDelete(null)} onConfirm={remove} />
    </div>
  );
}
