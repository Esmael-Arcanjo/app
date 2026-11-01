import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { api, errMsg } from "@/shared/api/client";
import { EmptyState, ErrorState, LoadingState } from "@/shared/components/States";
import { Button } from "@/components/ui/button";

type Item = { id: string; title: string; body: string; read: boolean; created_at: string };

export const NotificationsSection = ({ productKey }: { productKey: string }) => {
  const [items, setItems] = useState<Item[] | null>(null);
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    try { const { data } = await api.get("/api/v1/users/me/notifications", { params: { product_key: productKey } }); setItems(data.notifications); setError(""); }
    catch (e) { setError(errMsg(e)); }
  }, [productKey]);
  useEffect(() => { load(); }, [load]);

  const markRead = async (id: string) => {
    try { await api.post(`/api/v1/users/me/notifications/${id}/read`); load(); } catch (e) { toast.error(errMsg(e)); }
  };

  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!items) return <LoadingState />;
  if (items.length === 0) return <EmptyState title="Nenhuma notificação" description="Avisos de assinatura, segurança e equipe aparecerão aqui." />;
  return (
    <div className="w-full divide-y divide-border rounded-xl border border-border bg-card" data-testid="notifications-list">
      {items.map((n) => (
        <div key={n.id} className="flex flex-col gap-2 p-5 sm:flex-row sm:items-center" data-testid={`notification-${n.id}`}>
          <span className={`h-2 w-2 shrink-0 rounded-full ${n.read ? "bg-border" : "bg-primary"}`} />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">{n.title}</p>
            <p className="text-sm text-muted-foreground">{n.body}</p>
            <p className="mt-1 text-xs text-muted-foreground">{new Date(n.created_at).toLocaleString("pt-BR")}</p>
          </div>
          {!n.read && <Button variant="ghost" size="sm" onClick={() => markRead(n.id)} data-testid={`notification-read-${n.id}`}>Marcar como lida</Button>}
        </div>
      ))}
    </div>
  );
};
