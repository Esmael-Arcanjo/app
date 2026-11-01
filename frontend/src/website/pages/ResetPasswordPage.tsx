import { FormEvent, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api, errMsg } from "@/shared/api/client";
import { AuthCard } from "../layouts/PublicLayout";

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const [password, setPassword] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try { await api.post("/api/v1/auth/reset-password", { token: params.get("token") || "", password }); setDone(true); }
    catch (err) { toast.error(errMsg(err)); } finally { setBusy(false); }
  };
  return (
    <AuthCard title="Definir nova senha" subtitle="Todas as sessões abertas serão encerradas.">
      {done ? (
        <div className="space-y-4" data-testid="reset-done">
          <p className="text-sm text-success">Senha redefinida com sucesso.</p>
          <Button asChild className="w-full rounded-full"><Link to="/entrar" data-testid="reset-to-login">Entrar</Link></Button>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4" data-testid="reset-form">
          <div className="space-y-2"><Label htmlFor="n-pass">Nova senha</Label>
            <Input id="n-pass" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} data-testid="reset-password" /></div>
          <Button type="submit" disabled={busy} className="w-full rounded-full" data-testid="reset-submit">Salvar senha</Button>
        </form>
      )}
    </AuthCard>
  );
}
