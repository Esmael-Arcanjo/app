import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { errMsg } from "@/shared/api/client";
import { useCrmApi } from "../services/crmApi";
import type { Contact } from "../types/crm";
import { emptyToNull } from "../utils/format";
import { Field } from "./FormField";

type Props = { open: boolean; contact: Contact | null; onClose: () => void; onSaved: () => void };
const EMPTY = { name: "", email: "", phone: "", company: "", position: "", notes: "", tags: "" };

export const ContactFormDialog = ({ open, contact, onClose, onSaved }: Props) => {
  const api = useCrmApi();
  const [form, setForm] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (open) setForm(contact ? { name: contact.name, email: contact.email || "", phone: contact.phone || "", company: contact.company || "", position: contact.position || "", notes: contact.notes || "", tags: contact.tags.join(", ") } : EMPTY);
  }, [open, contact]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { tags, ...rest } = form;
    const body = { ...emptyToNull(rest), name: form.name, tags: tags.split(",").map((t) => t.trim()).filter(Boolean), ...(contact ? { version: contact.version } : {}) };
    try {
      if (contact) await api.update("contacts", contact.id, body); else await api.create("contacts", body);
      toast.success(contact ? "Contato atualizado" : "Contato criado");
      onSaved();
    } catch (err) { toast.error(errMsg(err)); } finally { setBusy(false); }
  };
  const set = (k: keyof typeof EMPTY) => (e: { target: { value: string } }) => setForm({ ...form, [k]: e.target.value });

  return (
    <Dialog open={open} onOpenChange={(o: boolean) => !o && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader><DialogTitle>{contact ? "Editar contato" : "Novo contato"}</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="grid gap-4 md:grid-cols-2" data-testid="contact-form">
          <Field label="Nome" htmlFor="c-name"><Input id="c-name" value={form.name} onChange={set("name")} required data-testid="contact-name-input" /></Field>
          <Field label="E-mail" htmlFor="c-email"><Input id="c-email" type="email" value={form.email} onChange={set("email")} data-testid="contact-email-input" /></Field>
          <Field label="Telefone" htmlFor="c-phone"><Input id="c-phone" value={form.phone} onChange={set("phone")} data-testid="contact-phone-input" /></Field>
          <Field label="Empresa" htmlFor="c-company"><Input id="c-company" value={form.company} onChange={set("company")} data-testid="contact-company-input" /></Field>
          <Field label="Cargo" htmlFor="c-position"><Input id="c-position" value={form.position} onChange={set("position")} data-testid="contact-position-input" /></Field>
          <Field label="Tags (separadas por vírgula)" htmlFor="c-tags"><Input id="c-tags" value={form.tags} onChange={set("tags")} data-testid="contact-tags-input" /></Field>
          <Field label="Observações" htmlFor="c-notes" className="md:col-span-2"><Textarea id="c-notes" value={form.notes} onChange={set("notes")} data-testid="contact-notes-input" /></Field>
          <DialogFooter className="md:col-span-2">
            <Button type="button" variant="outline" onClick={onClose} data-testid="contact-form-cancel">Cancelar</Button>
            <Button type="submit" disabled={busy} data-testid="contact-form-submit">{busy ? "Salvando..." : "Salvar"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
