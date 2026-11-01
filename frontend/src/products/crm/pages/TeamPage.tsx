import { FormEvent, useCallback, useState } from "react";
import { toast } from "sonner";
import { Trash2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { errMsg } from "@/shared/api/client";
import { useAuth } from "@/shared/auth/AuthContext";
import { PageTitle } from "@/shared/components/PageTitle";
import { ErrorState, LoadingState } from "@/shared/components/States";
import { useCrmApi } from "../services/crmApi";
import { useAsyncData } from "../hooks/useAsyncData";
import { NativeSelect } from "../components/FormField";
import { canManage, ROLE_LABEL } from "../utils/format";

type Members = { members: { user_id: string; name: string; email: string; role: string }[]; invites: { id: string; email: string; role: string; expires_at: string }[]; assignable_roles: string[]; my_role: string };

export default function TeamPage() {
  const api = useCrmApi();
  const { user } = useAuth();
  const { data, error, loading, reload } = useAsyncData<Members>(useCallback(() => api.members(), [api]));
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");
  const act = async (fn: () => Promise<unknown>, msg: string) => {
    try { await fn(); toast.success(msg); reload(); } catch (e) { toast.error(errMsg(e)); }
  };
  const invite = (e: FormEvent) => { e.preventDefault(); act(() => api.invite(email, role), "Convite enviado").then(() => setEmail("")); };

  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (loading && !data) return <LoadingState />;
  const manager = canManage(data!.my_role);
  return (
    <div className="space-y-6" data-testid="crm-team-page">
      <PageTitle title="Equipe" subtitle="Acesso concedido somente a este produto. Gerenciar equipe exige MFA ativo." />
      {manager && (
        <form onSubmit={invite} className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5 md:flex-row" data-testid="team-invite-form">
          <Input type="email" required placeholder="email@empresa.com" value={email} onChange={(e) => setEmail(e.target.value)} data-testid="team-invite-email" />
          <NativeSelect className="md:w-48" value={role} onChange={(e) => setRole(e.target.value)} data-testid="team-invite-role">
            {data!.assignable_roles.map((r) => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}
          </NativeSelect>
          <Button type="submit" className="rounded-full" data-testid="team-invite-submit"><UserPlus className="mr-1 h-4 w-4" /> Convidar</Button>
        </form>
      )}
      <div className="divide-y divide-border rounded-xl border border-border bg-card" data-testid="team-members">
        {data!.members.map((m) => (
          <div key={m.user_id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center" data-testid={`team-member-${m.user_id}`}>
            <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{m.name}</p><p className="truncate text-xs text-muted-foreground">{m.email}</p></div>
            {manager && m.role !== "owner" && m.user_id !== user?.id ? (
              <div className="flex items-center gap-2">
                <NativeSelect className="h-9 w-40" value={m.role} onChange={(e) => act(() => api.changeRole(m.user_id, e.target.value), "Papel atualizado")} data-testid={`team-role-${m.user_id}`}>
                  {data!.assignable_roles.map((r) => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}
                </NativeSelect>
                <Button variant="ghost" size="icon" onClick={() => act(() => api.removeMember(m.user_id), "Acesso removido")} data-testid={`team-remove-${m.user_id}`}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            ) : <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold">{ROLE_LABEL[m.role]}</span>}
          </div>
        ))}
      </div>
      {data!.invites.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-5" data-testid="team-invites">
          <h2 className="font-display text-base font-bold">Convites pendentes</h2>
          <ul className="mt-3 divide-y divide-border">
            {data!.invites.map((i) => (
              <li key={i.id} className="flex items-center justify-between py-2 text-sm"><span>{i.email} · {ROLE_LABEL[i.role]}</span>
                {manager && <Button variant="ghost" size="sm" onClick={() => act(() => api.cancelInvite(i.id), "Convite cancelado")} data-testid={`team-invite-cancel-${i.id}`}>Cancelar</Button>}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
