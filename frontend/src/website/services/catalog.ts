import { api } from "@/shared/api/client";

export type Product = {
  key: string; slug: string; name: string; status: "available" | "in_development";
  tagline: string; features: string[]; supported_segments: string[];
};
export type Plan = { plan_key: string; name: string; price_cents: number; currency: string; interval: string; seats: number; highlights: string[] };
export type Segment = { key: string; name: string };

export const fetchProducts = async (): Promise<Product[]> => (await api.get("/api/v1/catalog/products")).data.products;
export const fetchSegments = async (): Promise<Segment[]> => (await api.get("/api/v1/catalog/segments")).data.segments;
export const fetchProduct = async (slug: string): Promise<{ product: Product; plans: Plan[]; segments: Segment[] }> =>
  (await api.get(`/api/v1/catalog/products/${slug}`)).data;

export const formatPrice = (cents: number, currency: string) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: currency.toUpperCase() }).format(cents / 100);
