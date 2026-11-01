import { FormEvent, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { errMsg } from "@/shared/api/client";
import { useAuth } from "@/shared/auth/AuthContext";
import { AuthCard } from "../layouts/PublicLayout";

export const safeNext = (value: string | null) => (value && value.startsWith("/") && !value.startsWith("//") ? value : "/minha-conta");

export default function LoginPage() {
  const { login, loginMfa } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = safeNext(params.get("next"));
  const [form, setForm] = useState({ email: "", password: "" });
  const [mfaToken, setMfaToken] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mfaToken) {
        await loginMfa(mfaToken, code);
        navigate(next);
      } else {
        const r = await login(form.email, form.password);
        if (r.mfa_required) setMfaToken(r.mfa_token!); else navigate(next);
      }
    } catch (err) {
      toast.error(errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthCard title={mfaToken ? "Verificação em dois fatores" : "Entrar"} subtitle={mfaToken ? "Digite o código do seu aplicativo autenticador." : "Acesse sua conta LEAMSE."}>
      <form onSubmit={submit} className="space-y-4" data-testid="login-form">
        {mfaToken ? (
          <div className="space-y-2"><Label htmlFor="mfa">Código</Label>
            <Input id="mfa" inputMode="numeric" maxLength={6} autoFocus value={code} onChange={(e) => setCode(e.target.value)} data-testid="login-mfa-code" /></div>
        ) : (
          <>
            <div className="space-y-2"><Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} data-testid="login-email" /></div>
            <div className="space-y-2"><Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" autoComplete="current-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} data-testid="login-password" /></div>
          </>
        )}
        <Button type="submit" disabled={busy} className="w-full rounded-full" data-testid="login-submit">{busy ? "Entrando..." : mfaToken ? "Verificar" : "Entrar"}</Button>
      </form>
      {!mfaToken && (
        <div className="mt-5 flex justify-between text-sm">
          <Link to="/esqueci-senha" className="text-muted-foreground hover:text-foreground" data-testid="login-forgot">Esqueci minha senha</Link>
          <Link to={`/cadastro?next=${encodeURIComponent(next)}`} className="font-semibold" data-testid="login-to-register">Criar conta</Link>
        </div>
      )}
    </AuthCard>
  );
}
