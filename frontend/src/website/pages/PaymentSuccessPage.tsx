import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { errMsg } from "@/shared/api/client";
import { useAuth } from "@/shared/auth/AuthContext";
import { AuthCard } from "../layouts/PublicLayout";
import { checkoutStatus } from "../services/billing";

const MAX_ATTEMPTS = 20;

export default function PaymentSuccessPage() {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id") || "";
  const { user, loading } = useAuth();
  const [state, setState] = useState<"checking" | "active" | "failed" | "timeout">("checking");
  const [slug, setSlug] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (loading || !user || !sessionId) return;
    let attempts = 0;
    let timer: ReturnType<typeof setTimeout>;
    const poll = async () => {
      try {
        const s = await checkoutStatus(sessionId);
        setSlug(s.slug);
        if (s.subscription_status === "active") return setState("active");
        if (["expired", "failed"].includes(s.payment_status)) return setState("failed");
      } catch (e) {
        setError(errMsg(e));
        return setState("failed");
      }
      attempts += 1;
      if (attempts >= MAX_ATTEMPTS) return setState("timeout");
      timer = setTimeout(poll, 2000);
    };
    poll();
    return () => clearTimeout(timer);
  }, [sessionId, user, loading]);

  if (!loading && !user) {
    return <AuthCard title="Entre para continuar"><Button asChild className="w-full rounded-full"><Link to={`/entrar?next=${encodeURIComponent(`/pagamento/sucesso?session_id=${sessionId}`)}`} data-testid="payment-login">Entrar</Link></Button></AuthCard>;
  }
  return (
    <AuthCard title="Confirmação de pagamento">
      <div data-testid="payment-status" data-state={state}>
        {state === "checking" && <p className="flex items-center gap-2 text-sm"><Loader2 className="h-4 w-4 animate-spin" /> Confirmando o pagamento com o provedor...</p>}
        {state === "active" && (
          <div className="space-y-4">
            <p className="flex items-center gap-2 text-sm text-success"><CheckCircle2 className="h-5 w-5" /> Pagamento confirmado e assinatura ativada.</p>
            <Button asChild className="w-full rounded-full"><Link to={`/${slug}`} data-testid="payment-open-dashboard">Abrir meu painel</Link></Button>
          </div>
        )}
        {state === "failed" && <p className="flex items-center gap-2 text-sm text-destructive"><XCircle className="h-5 w-5" /> {error || "O pagamento não foi concluído."}</p>}
        {state === "timeout" && <p className="text-sm text-muted-foreground">Ainda aguardando confirmação do provedor. Você receberá uma notificação quando a assinatura for ativada; acompanhe em <Link to="/minha-conta" className="underline">Minha conta</Link>.</p>}
      </div>
    </AuthCard>
  );
}
