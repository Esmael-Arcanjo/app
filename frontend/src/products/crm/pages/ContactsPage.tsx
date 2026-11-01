import { useCallback, useState } from "react";
import { toast } from "sonner";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { errMsg } from "@/shared/api/client";
import { PageTitle } from "@/shared/components/PageTitle";
import { EmptyState, ErrorState, LoadingState } from "@/shared/components/States";
import { useCrmApi } from "../services/crmApi";
import { useAsyncData } from "../hooks/useAsyncData";
import { useCrmContext } from "../hooks/useCrmContext";
import { ContactFormDialog } from "../components/ContactFormDialog";
import { ConfirmDialog } from "../components/ConfirmDialog";
import type { Contact } from "../types/crm";
import { canDelete, canWrite } from "../utils/format";

export default function ContactsPage() {
  const api = useCrmApi();
  const { role } = useCrmContext();
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<Contact | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [toDelete, setToDelete] = useState<Contact | null>(null);
  const contacts = useAsyncData<Contact[]>(useCallback(() => api.list<Contact>("contacts", { q: q || undefined }), [api, q]));

  const remove = async () => {
    if (!toDelete) return;
    try { await api.remove("contacts", toDelete.id); toast.success("Contato excluído"); contacts.reload(); } catch (e) { toast.error(errMsg(e)); } finally { setToDelete(null); }
  };

  return (
    <div className="space-y-6" data-testid="crm-contacts-page">
      <PageTitle title="Contatos" subtitle="Pessoas e empresas do seu relacionamento comercial."
        actions={canWrite(role) && <Button onClick={() => { setEditing(null); setFormOpen(true); }} className="rounded-full" data-testid="contact-new-button"><Plus className="mr-1 h-4 w-4" /> Novo contato</Button>} />
      <div className="relative"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input className="pl-9" placeholder="Buscar contatos" value={q} onChange={(e) => setQ(e.target.value)} data-testid="contact-search-input" /></div>
      {contacts.error ? <ErrorState message={contacts.error} onRetry={contacts.reload} /> : contacts.loading && !contacts.data ? <LoadingState /> : !contacts.data?.length ? (
        <EmptyState title="Nenhum contato" description="Converta leads ou cadastre contatos manualmente." />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3" data-testid="contacts-grid">
          {contacts.data.map((c) => (
            <div key={c.id} className="rounded-xl border border-border bg-card p-5" data-testid={`contact-card-${c.id}`}>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0"><p className="truncate font-display font-bold">{c.name}</p><p className="truncate text-sm text-muted-foreground">{[c.position, c.company].filter(Boolean).join(" · ") || "—"}</p></div>
                <div className="flex shrink-0">
                  {canWrite(role) && <Button variant="ghost" size="icon" onClick={() => { setEditing(c); setFormOpen(true); }} data-testid={`contact-edit-${c.id}`}><Pencil className="h-4 w-4" /></Button>}
                  {canDelete(role) && <Button variant="ghost" size="icon" onClick={() => setToDelete(c)} data-testid={`contact-delete-${c.id}`}><Trash2 className="h-4 w-4 text-destructive" /></Button>}
                </div>
              </div>
              <p className="mt-3 truncate text-sm">{c.email || "—"}</p>
              <p className="text-sm text-muted-foreground">{c.phone || ""}</p>
              {c.tags.length > 0 && <div className="mt-3 flex flex-wrap gap-1">{c.tags.map((t) => <span key={t} className="rounded-full bg-muted px-2 py-0.5 text-xs">{t}</span>)}</div>}
            </div>
          ))}
        </div>
      )}
      <ContactFormDialog open={formOpen} contact={editing} onClose={() => setFormOpen(false)} onSaved={() => { setFormOpen(false); contacts.reload(); }} />
      <ConfirmDialog open={!!toDelete} title="Excluir contato?" description="Contatos com oportunidades abertas não podem ser excluídos." onCancel={() => setToDelete(null)} onConfirm={remove} />
    </div>
  );
}
