import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { errMsg } from "@/shared/api/client";
import { useCrmApi } from "../services/crmApi";
import type { Lead, SegmentConfig } from "../types/crm";
import { emptyToNull, fromCents, LEAD_STATUS, toCents } from "../utils/format";
import { Field, NativeSelect } from "./FormField";

type Props = { open: boolean; lead: Lead | null; config: SegmentConfig; onClose: () => void; onSaved: () => void };
const EMPTY = { name: "", email: "", phone: "", company: "", source: "", status: "new", value: "", notes: "" };

export const LeadFormDialog = ({ open, lead, config, onClose, onSaved }: Props) => {
  const api = useCrmApi();
  const [form, setForm] = useState(EMPTY);
  const [custom, setCustom] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm(lead ? { name: lead.name, email: lead.email || "", phone: lead.phone || "", company: lead.company || "", source: lead.source || "", status: lead.status, value: fromCents(lead.value_cents), notes: lead.notes || "" } : EMPTY);
    setCustom(Object.fromEntries(Object.entries(lead?.custom_fields || {}).map(([k, v]) => [k, v == null ? "" : String(v)])));
  }, [open, lead]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const custom_fields = Object.fromEntries(config.lead_fields.map((f) => [f.key, custom[f.key] ? (f.type === "number" ? Number(custom[f.key]) : custom[f.key]) : null]));
    const { value, ...rest } = form;
    const body = { ...emptyToNull(rest), name: form.name, status: form.status, value_cents: toCents(value || "0"), custom_fields, ...(lead ? { version: lead.version } : {}) };
    try {
      if (lead) await api.update("leads", lead.id, body); else await api.create("leads", body);
      toast.success(lead ? "Lead atualizado" : "Lead criado");
      onSaved();
    } catch (err) { toast.error(errMsg(err)); } finally { setBusy(false); }
  };
  const set = (k: keyof typeof EMPTY) => (e: { target: { value: string } }) => setForm({ ...form, [k]: e.target.value });

  return (
    <Dialog open={open} onOpenChange={(o: boolean) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader><DialogTitle>{lead ? "Editar lead" : "Novo lead"}</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="grid gap-4 md:grid-cols-2" data-testid="lead-form">
          <Field label="Nome" htmlFor="l-name"><Input id="l-name" value={form.name} onChange={set("name")} required data-testid="lead-name-input" /></Field>
          <Field label="Empresa" htmlFor="l-company"><Input id="l-company" value={form.company} onChange={set("company")} data-testid="lead-company-input" /></Field>
          <Field label="E-mail" htmlFor="l-email"><Input id="l-email" type="email" value={form.email} onChange={set("email")} data-testid="lead-email-input" /></Field>
          <Field label="Telefone" htmlFor="l-phone"><Input id="l-phone" value={form.phone} onChange={set("phone")} data-testid="lead-phone-input" /></Field>
          <Field label="Origem" htmlFor="l-source">
            <NativeSelect id="l-source" value={form.source} onChange={set("source")} data-testid="lead-source-select">
              <option value="">—</option>{config.sources.map((s) => <option key={s} value={s}>{s}</option>)}
            </NativeSelect>
          </Field>
          <Field label="Status" htmlFor="l-status">
            <NativeSelect id="l-status" value={form.status} onChange={set("status")} data-testid="lead-status-select">
              {Object.entries(LEAD_STATUS).filter(([k]) => k !== "converted").map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </NativeSelect>
          </Field>
          <Field label="Valor estimado (R$)" htmlFor="l-value"><Input id="l-value" inputMode="decimal" value={form.value} onChange={set("value")} data-testid="lead-value-input" /></Field>
          {config.lead_fields.map((f) => (
            <Field key={f.key} label={f.label} htmlFor={`cf-${f.key}`}>
              <Input id={`cf-${f.key}`} type={f.type === "number" ? "number" : f.type === "date" ? "date" : "text"} value={custom[f.key] || ""}
                onChange={(e) => setCustom({ ...custom, [f.key]: e.target.value })} data-testid={`lead-custom-${f.key}`} />
            </Field>
          ))}
          <Field label="Observações" htmlFor="l-notes" className="md:col-span-2"><Textarea id="l-notes" value={form.notes} onChange={set("notes")} data-testid="lead-notes-input" /></Field>
          <DialogFooter className="md:col-span-2">
            <Button type="button" variant="outline" onClick={onClose} data-testid="lead-form-cancel">Cancelar</Button>
            <Button type="submit" disabled={busy} data-testid="lead-form-submit">{busy ? "Salvando..." : "Salvar"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
