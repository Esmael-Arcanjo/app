import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { Lock } from "lucide-react";
import { api, errMsg } from "@/shared/api/client";
import { useAuth } from "@/shared/auth/AuthContext";
import { ErrorState, LoadingState } from "@/shared/components/States";
import { Button } from "@/components/ui/button";

export type ProductAccess = {
  organization_id: string; organization_name: string; segment: string; segment_name: string;
  plan_key: string; subscription_status: string; role: "owner" | "admin" | "member" | "viewer";
};

const Ctx = createContext<ProductAccess | null>(null);

export const useProductContext = () => {
  const value = useContext(Ctx);
  if (!value) throw new Error("useProductContext must be used inside ProductAccessGuard");
  return value;
};

const NoAccess = ({ productName }: { productName: string }) => (
  <div className="grid min-h-screen w-full place-items-center bg-surface p-6" data-testid="product-no-access">
    <div className="max-w-md rounded-2xl border border-border bg-card p-8 text-center">
      <Lock className="mx-auto h-8 w-8 text-muted-foreground" />
      <h1 className="mt-4 font-display text-xl font-extrabold">Sem acesso ao {productName}</h1>
      <p className="mt-2 text-sm text-muted-foreground">Sua conta não possui uma assinatura ativa deste produto em nenhuma organização.</p>
      <Button asChild className="mt-6 rounded-full"><Link to="/" data-testid="no-access-home">Ver produtos</Link></Button>
    </div>
  </div>
);

const OrgPicker = ({ contexts, onPick }: { contexts: ProductAccess[]; onPick: (c: ProductAccess) => void }) => (
  <div className="grid min-h-screen w-full place-items-center bg-surface p-6" data-testid="org-picker">
    <div className="w-full max-w-md space-y-3 rounded-2xl border border-border bg-card p-8">
      <h1 className="font-display text-xl font-extrabold">Escolha a organização</h1>
      {contexts.map((c) => (
        <button key={c.organization_id} type="button" onClick={() => onPick(c)} data-testid={`org-pick-${c.organization_id}`}
          className="flex w-full items-center justify-between rounded-xl border border-border p-4 text-left transition-colors hover:bg-muted">
          <span className="font-semibold">{c.organization_name}</span>
          <span className="text-xs uppercase tracking-widest text-muted-foreground">{c.segment_name}</span>
        </button>
      ))}
    </div>
  </div>
);

type Props = { productKey: string; productName: string; children: ReactNode };

export const ProductAccessGuard = ({ productKey, productName, children }: Props) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const storageKey = `leamse:org:${productKey}`;
  const [contexts, setContexts] = useState<ProductAccess[] | null>(null);
  const [selected, setSelected] = useState<ProductAccess | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setError("");
    try {
      const { data } = await api.get(`/api/v1/access/${productKey}`);
      const list: ProductAccess[] = data.contexts;
      setContexts(list);
      const remembered = list.find((c) => c.organization_id === localStorage.getItem(storageKey));
      setSelected(remembered || (list.length === 1 ? list[0] : null));
    } catch (e) {
      setError(errMsg(e));
    }
  }, [productKey, storageKey]);

  useEffect(() => { if (user) load(); }, [user, load]);

  if (loading) return <LoadingState />;
  if (!user) return <Navigate to={`/entrar?next=${encodeURIComponent(location.pathname)}`} replace />;
  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!contexts) return <LoadingState />;
  if (contexts.length === 0) return <NoAccess productName={productName} />;
  if (!selected) {
    return <OrgPicker contexts={contexts} onPick={(c) => { localStorage.setItem(storageKey, c.organization_id); setSelected(c); }} />;
  }
  return <Ctx.Provider value={selected}>{children}</Ctx.Provider>;
};
