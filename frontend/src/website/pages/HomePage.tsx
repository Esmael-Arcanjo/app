import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, KeyRound, ServerCog, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ErrorState, LoadingState } from "@/shared/components/States";
import { errMsg } from "@/shared/api/client";
import { PublicLayout } from "../layouts/PublicLayout";
import { ProductCard } from "../components/ProductCard";
import { fetchProducts, fetchSegments, Product, Segment } from "../services/catalog";

const STEPS = ["Escolha o produto", "Selecione seu segmento", "Escolha o plano", "Pague com segurança", "Acesse seu painel exclusivo"];
const SECURITY = [
  { icon: ShieldCheck, title: "Isolamento por organização", text: "Cada requisição valida identidade, organização, permissão e assinatura no servidor." },
  { icon: KeyRound, title: "MFA e sessões revogáveis", text: "Argon2id, TOTP, cookies HttpOnly e encerramento remoto de sessões." },
  { icon: ServerCog, title: "Pagamento confirmado no servidor", text: "Checkout hospedado, webhooks assinados e idempotência. Nenhum cartão é armazenado." },
];

export default function HomePage() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    Promise.all([fetchProducts(), fetchSegments()]).then(([p, s]) => { setProducts(p); setSegments(s); }).catch((e) => setError(errMsg(e)));
  }, []);

  return (
    <PublicLayout>
      <section className="relative isolate overflow-hidden" data-testid="hero-section">
        <img src="/images/hero.jpg" alt="" className="absolute inset-0 -z-10 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/85 via-black/65 to-black/30" />
        <div className="mx-auto w-full max-w-7xl px-4 py-24 text-white sm:px-6 lg:py-36">
          <span className="fade-up inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur">Software para empresas · leamse.com</span>
          <h1 className="fade-up mt-6 max-w-4xl font-display text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl" style={{ animationDelay: "80ms" }}>
            Nove produtos. <span className="text-accent">Contrate só o que sua empresa usa.</span>
          </h1>
          <p className="fade-up mt-6 max-w-xl text-base text-white/80 md:text-lg" style={{ animationDelay: "160ms" }}>
            CRM, ERP, APIs de e-mail e pagamentos, marketplace, recebimento, marketing, chatbot e link na bio — cada um com assinatura, painel e endereço próprios, configurado para o seu mercado.
          </p>
          <div className="fade-up mt-10 flex flex-wrap gap-3" style={{ animationDelay: "240ms" }}>
            <Button asChild size="lg" className="rounded-full"><a href="#produtos" data-testid="hero-cta-products">Ver produtos <ArrowRight className="ml-2 h-4 w-4" /></a></Button>
            <Button asChild size="lg" variant="outline" className="rounded-full border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white">
              <Link to="/produtos/crm" data-testid="hero-cta-crm">Contratar o CRM</Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="produtos" className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6" data-testid="products-section">
        <h2 className="font-display text-3xl font-extrabold sm:text-4xl">Produtos independentes</h2>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground md:text-base">Contratar um produto não libera os demais. Produtos em desenvolvimento serão abertos para contratação após validação.</p>
        <div className="mt-10">
          {error ? <ErrorState message={error} /> : !products ? <LoadingState /> : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{products.map((p, i) => <ProductCard key={p.key} product={p} index={i} />)}</div>
          )}
        </div>
      </section>

      <section id="segmentos" className="w-full border-y border-border bg-surface" data-testid="segments-section">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-extrabold sm:text-4xl">Configurado para o seu mercado</h2>
            <p className="mt-3 text-sm text-muted-foreground md:text-base">Ao contratar, você escolhe o segmento. Campos, funis e fluxos do produto são configurados para ele.</p>
            <ol className="mt-8 space-y-3">
              {STEPS.map((s, i) => (
                <li key={s} className="flex items-center gap-4"><span className="grid h-8 w-8 place-items-center rounded-full bg-foreground font-mono text-xs text-background">{i + 1}</span><span className="text-sm font-medium">{s}</span></li>
              ))}
            </ol>
          </div>
          <div className="grid grid-cols-2 gap-3 self-center">
            {segments.map((s) => (
              <div key={s.key} className="rounded-xl border border-border bg-card px-5 py-4 font-display font-bold" data-testid={`segment-${s.key}`}>{s.name}</div>
            ))}
          </div>
        </div>
      </section>

      <section id="seguranca" className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6" data-testid="security-section">
        <h2 className="font-display text-3xl font-extrabold sm:text-4xl">Segurança desde a fundação</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {SECURITY.map((s) => (
            <div key={s.title} className="rounded-2xl border border-border bg-card p-6">
              <s.icon className="h-6 w-6 text-primary" />
              <h3 className="mt-4 font-display text-lg font-bold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
            </div>
          ))}
        </div>
      </section>
    </PublicLayout>
  );
}
