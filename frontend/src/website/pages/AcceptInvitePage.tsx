import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { api, errMsg } from "@/shared/api/client";
import { useAuth } from "@/shared/auth/AuthContext";
import { AuthCard } from "../layouts/PublicLayout";

export default function AcceptInvitePage() {
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const back = `/convite?token=${token}`;

  const accept = async () => {
    setBusy(true);
    try {
      const { data } = await api.post("/api/v1/organizations/invites/accept", { token });
      toast.success("Convite aceito");
      navigate(`/${data.slug}`);
    } catch (e) { toast.error(errMsg(e)); setBusy(false); }
  };

  return (
    <AuthCard title="Convite para organização" subtitle="Aceite para acessar o produto compartilhado com você.">
      {loading ? null : user ? (
        <Button onClick={accept} disabled={busy} className="w-full rounded-full" data-testid="invite-accept">Aceitar convite como {user.email}</Button>
      ) : (
        <div className="flex gap-3">
          <Button asChild className="flex-1 rounded-full"><Link to={`/cadastro?next=${encodeURIComponent(back)}`} data-testid="invite-register">Criar conta</Link></Button>
          <Button asChild variant="outline" className="flex-1 rounded-full"><Link to={`/entrar?next=${encodeURIComponent(back)}`} data-testid="invite-login">Entrar</Link></Button>
        </div>
      )}
    </AuthCard>
  );
}
