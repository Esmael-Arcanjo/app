import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { ShieldCheck, ShieldOff } from "lucide-react";
import { api, errMsg } from "@/shared/api/client";
import { useAuth } from "@/shared/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const PasswordCard = () => {
  const [form, setForm] = useState({ current_password: "", new_password: "" });
  const [busy, setBusy] = useState(false);
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const { data } = await api.post("/api/v1/users/me/password", form);
      toast.success(`Senha alterada. ${data.revoked_sessions} outra(s) sessão(ões) encerrada(s).`);
      setForm({ current_password: "", new_password: "" });
    } catch (err) { toast.error(errMsg(err)); } finally { setBusy(false); }
  };
  return (
    <form onSubmit={submit} className="space-y-4 rounded-xl border border-border bg-card p-6" data-testid="security-password-form">
      <h2 className="font-display text-base font-bold">Alterar senha</h2>
      <div className="space-y-2"><Label htmlFor="sp-cur">Senha atual</Label>
        <Input id="sp-cur" type="password" autoComplete="current-password" value={form.current_password} onChange={(e) => setForm({ ...form, current_password: e.target.value })} data-testid="security-current-password" /></div>
      <div className="space-y-2"><Label htmlFor="sp-new">Nova senha</Label>
        <Input id="sp-new" type="password" autoComplete="new-password" value={form.new_password} onChange={(e) => setForm({ ...form, new_password: e.target.value })} data-testid="security-new-password" />
        <p className="text-xs text-muted-foreground">Mínimo de 10 caracteres, com letras e números.</p></div>
      <Button type="submit" disabled={busy} className="rounded-full" data-testid="security-password-submit">Alterar senha</Button>
    </form>
  );
};

const MfaCard = () => {
  const { user, reload } = useAuth();
  const [setup, setSetup] = useState<{ secret: string; otpauth_uri: string } | null>(null);
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");

  const start = async () => {
    try { const { data } = await api.post("/api/v1/users/me/mfa/setup"); setSetup(data); } catch (e) { toast.error(errMsg(e)); }
  };
  const enable = async () => {
    try { await api.post("/api/v1/users/me/mfa/enable", { code }); toast.success("MFA ativado"); setSetup(null); setCode(""); await reload(); }
    catch (e) { toast.error(errMsg(e)); }
  };
  const disable = async () => {
    try { await api.post("/api/v1/users/me/mfa/disable", { code, password }); toast.success("MFA desativado"); setCode(""); setPassword(""); await reload(); }
    catch (e) { toast.error(errMsg(e)); }
  };

  return (
    <div className="space-y-4 rounded-xl border border-border bg-card p-6" data-testid="security-mfa-card">
      <div className="flex items-center gap-3">
        {user?.mfa_enabled ? <ShieldCheck className="h-5 w-5 text-success" /> : <ShieldOff className="h-5 w-5 text-muted-foreground" />}
        <h2 className="font-display text-base font-bold">Autenticação em dois fatores (TOTP)</h2>
      </div>
      <p className="text-sm text-muted-foreground">Obrigatória para ações administrativas (equipe, funil, assinatura). Use Google Authenticator, 1Password ou similar.</p>
      {user?.mfa_enabled ? (
        <div className="grid gap-3 md:grid-cols-3">
          <Input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} data-testid="mfa-disable-password" />
          <Input inputMode="numeric" maxLength={6} placeholder="Código de 6 dígitos" value={code} onChange={(e) => setCode(e.target.value)} data-testid="mfa-disable-code" />
          <Button variant="outline" onClick={disable} data-testid="mfa-disable-button">Desativar MFA</Button>
        </div>
      ) : setup ? (
        <div className="space-y-3">
          <p className="text-sm">Adicione esta chave no seu aplicativo autenticador:</p>
          <code className="block break-all rounded-lg bg-muted p-3 font-mono text-sm" data-testid="mfa-secret">{setup.secret}</code>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input inputMode="numeric" maxLength={6} placeholder="Código de 6 dígitos" value={code} onChange={(e) => setCode(e.target.value)} data-testid="mfa-enable-code" />
            <Button onClick={enable} className="rounded-full" data-testid="mfa-enable-button">Confirmar e ativar</Button>
          </div>
        </div>
      ) : (
        <Button onClick={start} className="rounded-full" data-testid="mfa-setup-button">Configurar MFA</Button>
      )}
    </div>
  );
};

export const SecuritySection = (_: { productKey: string }) => (
  <div className="grid w-full gap-6 xl:grid-cols-2">
    <MfaCard />
    <PasswordCard />
  </div>
);
