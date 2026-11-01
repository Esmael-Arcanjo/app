import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Monitor } from "lucide-react";
import { api, errMsg } from "@/shared/api/client";
import { ErrorState, LoadingState } from "@/shared/components/States";
import { Button } from "@/components/ui/button";

type Session = { id: string; user_agent: string; ip: string; created_at: string; last_used_at: string; current: boolean };

export const SessionsSection = (_: { productKey: string }) => {
  const [items, setItems] = useState<Session[] | null>(null);
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    try { const { data } = await api.get("/api/v1/users/me/sessions"); setItems(data.sessions); setError(""); }
    catch (e) { setError(errMsg(e)); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const revoke = async (id: string) => {
    try { await api.delete(`/api/v1/users/me/sessions/${id}`); toast.success("Sessão encerrada"); load(); } catch (e) { toast.error(errMsg(e)); }
  };
  const revokeOthers = async () => {
    try { const { data } = await api.post("/api/v1/users/me/sessions/revoke-others"); toast.success(`${data.revoked} sessão(ões) encerrada(s)`); load(); }
    catch (e) { toast.error(errMsg(e)); }
  };

  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!items) return <LoadingState />;
  return (
    <div className="w-full space-y-4">
      <div className="flex justify-end">
        <Button variant="outline" onClick={revokeOthers} disabled={items.length < 2} data-testid="sessions-revoke-others">Encerrar outras sessões</Button>
      </div>
      <div className="divide-y divide-border rounded-xl border border-border bg-card" data-testid="sessions-list">
        {items.map((s) => (
          <div key={s.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center" data-testid={`session-row-${s.id}`}>
            <Monitor className="h-5 w-5 shrink-0 text-muted-foreground" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{s.user_agent || "Dispositivo desconhecido"}</p>
              <p className="text-xs text-muted-foreground">IP {s.ip} · último uso {new Date(s.last_used_at).toLocaleString("pt-BR")}</p>
            </div>
            {s.current ? (
              <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">Sessão atual</span>
            ) : (
              <Button variant="outline" size="sm" onClick={() => revoke(s.id)} data-testid={`session-revoke-${s.id}`}>Encerrar</Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
