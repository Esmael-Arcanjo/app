import { useEffect, useState } from "react";
import { Construction } from "lucide-react";
import { PageTitle } from "@/shared/components/PageTitle";
import { LoadingState, ErrorState } from "@/shared/components/States";
import { errMsg } from "@/shared/api/client";
import { marketingApi, overviewPath } from "../services/api";
import { useMarketingContext } from "../hooks/useMarketingContext";

const LABELS: Record<string, string> = {"marketing_campaigns": "marketing campaigns", "marketing_contacts": "marketing contacts", "marketing_automations": "marketing automations", "marketing_metrics": "marketing metrics"};

export default function DashboardPage() {
  const ctx = useMarketingContext();
  const [data, setData] = useState<{ counts: Record<string, number> } | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    marketingApi(ctx.organization_id).get(overviewPath).then((r) => setData(r.data)).catch((e) => setError(errMsg(e)));
  }, [ctx.organization_id]);
  if (error) return <ErrorState message={error} />;
  if (!data) return <LoadingState />;
  return (
    <div className="space-y-6">
      <PageTitle title="Painel — Marketing Digital" subtitle="Indicadores reais desta organização." />
      <div className="flex items-start gap-3 rounded-xl border border-dashed border-border bg-card p-5" data-testid="marketing-pending-notice">
        <Construction className="mt-0.5 h-5 w-5 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">As regras de negócio deste produto estão em desenvolvimento. A estrutura, a segurança e o isolamento já estão ativos; os contadores abaixo refletem dados reais (vazios até a implementação).</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Object.entries(data.counts).map(([k, v]) => (
          <div key={k} className="rounded-xl border border-border bg-card p-5" data-testid={`marketing-count-${k}`}>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">{LABELS[k] || k}</p>
            <p className="mt-2 font-display text-3xl font-extrabold">{v}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
