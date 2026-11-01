import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AuthCard } from "../layouts/PublicLayout";

export default function PaymentCancelPage() {
  return (
    <AuthCard title="Pagamento cancelado" subtitle="Nenhuma cobrança foi realizada e nenhuma assinatura foi ativada.">
      <Button asChild className="w-full rounded-full"><Link to="/#produtos" data-testid="payment-cancel-back">Voltar aos produtos</Link></Button>
    </AuthCard>
  );
}
