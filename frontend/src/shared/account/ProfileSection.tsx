import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { BadgeCheck, MailWarning } from "lucide-react";
import { api, errMsg } from "@/shared/api/client";
import { useAuth } from "@/shared/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const ProfileSection = (_: { productKey: string }) => {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || "", phone: user?.phone || "", locale: user?.locale || "pt-BR", timezone: user?.timezone || "America/Sao_Paulo" });
  const [saving, setSaving] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.patch("/api/v1/users/me", { ...form, phone: form.phone || null });
      setUser(data.user);
      toast.success("Perfil atualizado");
    } catch (err) {
      toast.error(errMsg(err));
    } finally {
      setSaving(false);
    }
  };
  const resend = async () => {
    try { await api.post("/api/v1/auth/resend-verification"); toast.success("E-mail de verificação reenviado"); }
    catch (err) { toast.error(errMsg(err)); }
  };

  return (
    <div className="grid w-full gap-6 xl:grid-cols-3">
      <form onSubmit={submit} className="space-y-4 rounded-xl border border-border bg-card p-6 xl:col-span-2" data-testid="profile-form">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2"><Label htmlFor="pf-name">Nome completo</Label>
            <Input id="pf-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} data-testid="profile-name-input" /></div>
          <div className="space-y-2"><Label htmlFor="pf-phone">Telefone</Label>
            <Input id="pf-phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} data-testid="profile-phone-input" /></div>
          <div className="space-y-2"><Label htmlFor="pf-locale">Idioma</Label>
            <select id="pf-locale" className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={form.locale} onChange={(e) => setForm({ ...form, locale: e.target.value })} data-testid="profile-locale-select">
              <option value="pt-BR">Português (Brasil)</option><option value="en-US">English (US)</option><option value="es-ES">Español</option>
            </select></div>
          <div className="space-y-2"><Label htmlFor="pf-tz">Fuso horário</Label>
            <Input id="pf-tz" value={form.timezone} onChange={(e) => setForm({ ...form, timezone: e.target.value })} data-testid="profile-timezone-input" /></div>
        </div>
        <Button type="submit" disabled={saving} className="rounded-full" data-testid="profile-save-button">{saving ? "Salvando..." : "Salvar alterações"}</Button>
      </form>
      <div className="space-y-3 rounded-xl border border-border bg-card p-6" data-testid="profile-email-card">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">E-mail de acesso</p>
        <p className="break-all font-semibold">{user?.email}</p>
        {user?.email_verified ? (
          <p className="flex items-center gap-2 text-sm text-success" data-testid="profile-email-verified"><BadgeCheck className="h-4 w-4" /> Verificado</p>
        ) : (
          <div className="space-y-2">
            <p className="flex items-center gap-2 text-sm text-warning" data-testid="profile-email-unverified"><MailWarning className="h-4 w-4" /> Não verificado</p>
            <Button variant="outline" size="sm" onClick={resend} data-testid="profile-resend-verification">Reenviar verificação</Button>
          </div>
        )}
      </div>
    </div>
  );
};
