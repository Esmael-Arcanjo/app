import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Check, Construction } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ErrorState, LoadingState } from "@/shared/components/States";
import { errMsg } from "@/shared/api/client";
import { PublicLayout } from "../layouts/PublicLayout";
import { fetchProduct, formatPrice, Plan, Product, Segment } from "../services/catalog";

export default function ProductPage() {
  const { slug = "" } = useParams();
  const [data, setData] = useState<{ product: Product; plans: Plan[]; segments: Segment[] } | null>(null);
  const [error, setError] = useState("");
  useEffect(() => { fetchProduct(slug).then(setData).catch((e) => setError(errMsg(e))); }, [slug]);

  if (error) return <PublicLayout><div className="p-10"><ErrorState message={error} /></div></PublicLayout>;
  if (!data) return <PublicLayout><LoadingState /></PublicLayout>;
  const { product, plans, segments } = data;
  const available = product.status === "available";

  return (
    <PublicLayout>
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6" data-testid="product-page">
        <div className="grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <h1 className="font-display text-4xl font-extrabold sm:text-5xl" data-testid="product-name">{product.name}</h1>
            <p className="mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">{product.tagline}</p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {product.features.map((f) => <li key={f} className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-primary" /> {f}</li>)}
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-6 lg:col-span-2">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Segmentos suportados</p>
            {segments.length ? (
              <div className="mt-4 flex flex-wrap gap-2">{segments.map((s) => <span key={s.key} className="rounded-full border border-border bg-card px-3 py-1 text-sm">{s.name}</span>)}</div>
            ) : (
              <p className="mt-4 flex items-start gap-2 text-sm text-muted-foreground" data-testid="product-in-development"><Construction className="mt-0.5 h-4 w-4 shrink-0" /> Produto em desenvolvimento. A contratação será liberada após implementação e validação.</p>
            )}
          </div>
        </div>

        {available && (
          <div className="mt-16">
            <h2 className="font-display text-2xl font-extrabold">Planos</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {plans.map((p) => (
                <div key={p.plan_key} className="flex flex-col rounded-2xl border border-border bg-card p-6" data-testid={`plan-card-${p.plan_key}`}>
                  <p className="font-display text-lg font-bold">{p.name}</p>
                  <p className="mt-3 font-display text-3xl font-extrabold">{formatPrice(p.price_cents, p.currency)}<span className="text-sm font-medium text-muted-foreground">/mês</span></p>
                  <ul className="mt-5 flex-1 space-y-2">{p.highlights.map((h) => <li key={h} className="flex gap-2 text-sm"><Check className="h-4 w-4 text-primary" />{h}</li>)}</ul>
                  <Button asChild className="mt-6 rounded-full"><Link to={`/contratar/${product.slug}?plano=${p.plan_key}`} data-testid={`plan-select-${p.plan_key}`}>Contratar {p.name}</Link></Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </PublicLayout>
  );
}
