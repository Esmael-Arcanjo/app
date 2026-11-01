import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AuthCard } from "../layouts/PublicLayout";

export default function NotFoundPage() {
  return (
    <AuthCard title="Página não encontrada">
      <Button asChild className="w-full rounded-full"><Link to="/" data-testid="notfound-home">Ir para o início</Link></Button>
    </AuthCard>
  );
}
