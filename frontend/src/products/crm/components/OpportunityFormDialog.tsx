import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { errMsg } from "@/shared/api/client";
import { useCrmApi } from "../services/crmApi";
import type { Contact, Opportunity, Stage } from "../types/crm";
import { fromCents, OPP_STATUS, toCents } from "../utils/format";
import { Field, NativeSelect } from "./FormField";

type Props = { open: boolean; opp: Opportunity | null; stages: Stage[]; contacts: Contact[]; onClose: () => void; onSaved: () => void };

export const OpportunityFormDialog = ({ open, opp, stages, contacts, onClose, onSaved }: Props) => {
  const api = useCrmApi();
  const empty = { title: "", contact_id: "", value: "", stage_key: stages[0]?.key || "", status: "open", expected_close_date: "", notes: "" };
  const [form, setForm] = useState(empty);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (open) setForm(opp ? { title: opp.title, contact_id: opp.contact_id || "", value: fromCents(opp.value_cents), stage_key: opp.stage_key, status: opp.status, expected_close_date: opp.expected_close_date || "", notes: opp.notes || "" } : empty);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, opp]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const body = { title: form.title, contact_id: form.contact_id || null, value_cents: toCents(form.value || "0"), stage_key: form.stage_key, status: form.status,
      expected_close_date: form.expected_close_date || null, notes: form.notes || null, ...(opp ? { version: opp.version } : {}) };
    try {
      if (opp) await api.update("opportunities", opp.id, body); else await api.create("opportunities", body);
      toast.success(opp ? "Oportunidade atualizada" : "Oportunidade criada");
      onSaved();
    } catch (err) { toast.error(errMsg(err)); } finally { setBusy(false); }
  };
  const set = (k: keyof typeof empty) => (e: { target: { value: string } }) => setForm({ ...form, [k]: e.target.value });

  return (
    <Dialog open={open} onOpenChange={(o: boolean) => !o && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader><DialogTitle>{opp ? "Editar oportunidade" : "Nova oportunidade"}</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="grid gap-4 md:grid-cols-2" data-testid="opportunity-form">
          <Field label="Título" htmlFor="o-title" className="md:col-span-2"><Input id="o-title" value={form.title} onChange={set("title")} required data-testid="opportunity-title-input" /></Field>
          <Field label="Contato" htmlFor="o-contact">
            <NativeSelect id="o-contact" value={form.contact_id} onChange={set("contact_id")} data-testid="opportunity-contact-select">
              <option value="">Sem contato</option>{contacts.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </NativeSelect>
          </Field>
          <Field label="Valor (R$)" htmlFor="o-value"><Input id="o-value" inputMode="decimal" value={form.value} onChange={set("value")} data-testid="opportunity-value-input" /></Field>
          <Field label="Etapa" htmlFor="o-stage">
            <NativeSelect id="o-stage" value={form.stage_key} onChange={set("stage_key")} data-testid="opportunity-stage-select">
              {stages.map((s) => <option key={s.key} value={s.key}>{s.name}</option>)}
            </NativeSelect>
          </Field>
          <Field label="Situação" htmlFor="o-status">
            <NativeSelect id="o-status" value={form.status} onChange={set("status")} data-testid="opportunity-status-select">
              {Object.entries(OPP_STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </NativeSelect>
          </Field>
          <Field label="Previsão de fechamento" htmlFor="o-close"><Input id="o-close" type="date" value={form.expected_close_date} onChange={set("expected_close_date")} data-testid="opportunity-close-input" /></Field>
          <Field label="Observações" htmlFor="o-notes" className="md:col-span-2"><Textarea id="o-notes" value={form.notes} onChange={set("notes")} data-testid="opportunity-notes-input" /></Field>
          <DialogFooter className="md:col-span-2">
            <Button type="button" variant="outline" onClick={onClose} data-testid="opportunity-form-cancel">Cancelar</Button>
            <Button type="submit" disabled={busy} data-testid="opportunity-form-submit">{busy ? "Salvando..." : "Salvar"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
