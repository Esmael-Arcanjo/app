import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api, errMsg } from "@/shared/api/client";
import { AuthCard } from "../layouts/PublicLayout";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try { await api.post("/api/v1/auth/forgot-password", { email }); setSent(true); }
    catch (err) { toast.error(errMsg(err)); } finally { setBusy(false); }
  };
  return (
    <AuthCard title="Recuperar senha" subtitle="Enviaremos um link de redefinição válido por 1 hora.">
      {sent ? (
        <p className="text-sm" data-testid="forgot-sent">Se o e-mail estiver cadastrado, você receberá as instruções em instantes.</p>
      ) : (
        <form onSubmit={submit} className="space-y-4" data-testid="forgot-form">
          <div className="space-y-2"><Label htmlFor="f-email">E-mail</Label>
            <Input id="f-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} data-testid="forgot-email" /></div>
          <Button type="submit" disabled={busy} className="w-full rounded-full" data-testid="forgot-submit">Enviar link</Button>
        </form>
      )}
    </AuthCard>
  );
}
