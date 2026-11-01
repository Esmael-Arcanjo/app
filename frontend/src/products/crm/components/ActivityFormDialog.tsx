import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { errMsg } from "@/shared/api/client";
import { useCrmApi } from "../services/crmApi";
import type { Activity } from "../types/crm";
import { ACTIVITY_TYPE } from "../utils/format";
import { Field, NativeSelect } from "./FormField";

type Props = { open: boolean; activity: Activity | null; onClose: () => void; onSaved: () => void };
const EMPTY = { type: "call", subject: "", description: "", due_at: "" };
const toLocal = (iso: string | null) => (iso ? new Date(iso).toISOString().slice(0, 16) : "");

export const ActivityFormDialog = ({ open, activity, onClose, onSaved }: Props) => {
  const api = useCrmApi();
  const [form, setForm] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (open) setForm(activity ? { type: activity.type, subject: activity.subject, description: activity.description || "", due_at: toLocal(activity.due_at) } : EMPTY);
  }, [open, activity]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const body = { type: form.type, subject: form.subject, description: form.description || null, due_at: form.due_at ? new Date(form.due_at).toISOString() : null,
      done: activity?.done || false, related_type: activity?.related_type || null, related_id: activity?.related_id || null, ...(activity ? { version: activity.version } : {}) };
    try {
      if (activity) await api.update("activities", activity.id, body); else await api.create("activities", body);
      toast.success(activity ? "Atividade atualizada" : "Atividade criada");
      onSaved();
    } catch (err) { toast.error(errMsg(err)); } finally { setBusy(false); }
  };
  const set = (k: keyof typeof EMPTY) => (e: { target: { value: string } }) => setForm({ ...form, [k]: e.target.value });

  return (
    <Dialog open={open} onOpenChange={(o: boolean) => !o && onClose()}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader><DialogTitle>{activity ? "Editar atividade" : "Nova atividade"}</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="grid gap-4 md:grid-cols-2" data-testid="activity-form">
          <Field label="Tipo" htmlFor="a-type">
            <NativeSelect id="a-type" value={form.type} onChange={set("type")} data-testid="activity-type-select">
              {Object.entries(ACTIVITY_TYPE).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </NativeSelect>
          </Field>
          <Field label="Data e hora" htmlFor="a-due"><Input id="a-due" type="datetime-local" value={form.due_at} onChange={set("due_at")} data-testid="activity-due-input" /></Field>
          <Field label="Assunto" htmlFor="a-subject" className="md:col-span-2"><Input id="a-subject" value={form.subject} onChange={set("subject")} required data-testid="activity-subject-input" /></Field>
          <Field label="Descrição" htmlFor="a-desc" className="md:col-span-2"><Textarea id="a-desc" value={form.description} onChange={set("description")} data-testid="activity-description-input" /></Field>
          <DialogFooter className="md:col-span-2">
            <Button type="button" variant="outline" onClick={onClose} data-testid="activity-form-cancel">Cancelar</Button>
            <Button type="submit" disabled={busy} data-testid="activity-form-submit">{busy ? "Salvando..." : "Salvar"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
