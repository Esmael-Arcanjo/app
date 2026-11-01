import { FormEvent, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { errMsg } from "@/shared/api/client";
import { useAuth } from "@/shared/auth/AuthContext";
import { AuthCard } from "../layouts/PublicLayout";
import { safeNext } from "./LoginPage";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = safeNext(params.get("next"));
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success("Conta criada. Enviamos um link de verificação para o seu e-mail.");
      navigate(next);
    } catch (err) {
      toast.error(errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthCard title="Criar conta" subtitle="Uma conta para contratar e acessar seus produtos.">
      <form onSubmit={submit} className="space-y-4" data-testid="register-form">
        <div className="space-y-2"><Label htmlFor="r-name">Nome completo</Label>
          <Input id="r-name" autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} data-testid="register-name" /></div>
        <div className="space-y-2"><Label htmlFor="r-email">E-mail</Label>
          <Input id="r-email" type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} data-testid="register-email" /></div>
        <div className="space-y-2"><Label htmlFor="r-pass">Senha</Label>
          <Input id="r-pass" type="password" autoComplete="new-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} data-testid="register-password" />
          <p className="text-xs text-muted-foreground">Mínimo de 10 caracteres, com letras e números.</p></div>
        <Button type="submit" disabled={busy} className="w-full rounded-full" data-testid="register-submit">{busy ? "Criando..." : "Criar conta"}</Button>
      </form>
      <p className="mt-5 text-center text-sm text-muted-foreground">Já tem conta? <Link to={`/entrar?next=${encodeURIComponent(next)}`} className="font-semibold text-foreground" data-testid="register-to-login">Entrar</Link></p>
    </AuthCard>
  );
}
