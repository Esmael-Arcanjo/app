import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { api, errMsg } from "@/shared/api/client";
import { useAuth } from "@/shared/auth/AuthContext";
import { AuthCard } from "../layouts/PublicLayout";

export default function VerifyEmailPage() {
  const [params] = useSearchParams();
  const { reload } = useAuth();
  const [state, setState] = useState<"loading" | "ok" | "error">("loading");
  const [message, setMessage] = useState("");
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    api.post("/api/v1/auth/verify-email", { token: params.get("token") || "" })
      .then(() => { setState("ok"); reload(); })
      .catch((e) => { setMessage(errMsg(e)); setState("error"); });
  }, [params, reload]);

  return (
    <AuthCard title="Verificação de e-mail">
      <div data-testid="verify-email-status" data-state={state}>
        {state === "loading" && <p className="text-sm text-muted-foreground">Verificando...</p>}
        {state === "ok" && <p className="text-sm text-success">E-mail confirmado com sucesso.</p>}
        {state === "error" && <p className="text-sm text-destructive">{message}</p>}
      </div>
      <Button asChild className="mt-6 w-full rounded-full"><Link to="/minha-conta" data-testid="verify-email-continue">Continuar</Link></Button>
    </AuthCard>
  );
}
