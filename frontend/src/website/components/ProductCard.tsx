import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import type { Product } from "../services/catalog";

export const ProductCard = ({ product, index }: { product: Product; index: number }) => {
  const available = product.status === "available";
  return (
    <Link to={`/produtos/${product.slug}`} data-testid={`product-card-${product.key}`}
      style={{ animationDelay: `${index * 60}ms` }}
      className="fade-up group relative flex min-h-[220px] flex-col justify-between rounded-2xl border border-border bg-card p-6 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div>
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-muted-foreground">0{index + 1}</span>
          <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${available ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
            {available ? "Disponível" : "Em desenvolvimento"}
          </span>
        </div>
        <h3 className="mt-5 font-display text-xl font-extrabold">{product.name}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{product.tagline}</p>
      </div>
      <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold">
        Conhecer <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
};
