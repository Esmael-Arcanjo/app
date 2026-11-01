import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { errMsg } from "@/shared/api/client";
import { PageTitle } from "@/shared/components/PageTitle";
import { ErrorState, LoadingState } from "@/shared/components/States";
import { useCrmApi } from "../services/crmApi";
import { useAsyncData } from "../hooks/useAsyncData";
import { useCrmContext } from "../hooks/useCrmContext";
import type { Pipeline, Stage } from "../types/crm";
import { canManage } from "../utils/format";

const slug = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "").slice(0, 40);

export default function PipelinePage() {
  const api = useCrmApi();
  const { role } = useCrmContext();
  const { data, error, loading, reload } = useAsyncData<Pipeline>(useCallback(() => api.pipeline(), [api]));
  const [name, setName] = useState("");
  const [stages, setStages] = useState<Stage[]>([]);
  const [busy, setBusy] = useState(false);
  const editable = canManage(role);

  useEffect(() => { if (data) { setName(data.name); setStages(data.stages); } }, [data]);

  const update = (i: number, patch: Partial<Stage>) => setStages(stages.map((s, j) => (j === i ? { ...s, ...patch } : s)));
  const swap = (i: number, j: number) => { const next = [...stages]; [next[i], next[j]] = [next[j], next[i]]; setStages(next); };
  const save = async () => {
    setBusy(true);
    try { await api.savePipeline({ name, stages }); toast.success("Funil salvo"); reload(); } catch (e) { toast.error(errMsg(e)); } finally { setBusy(false); }
  };

  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (loading && !data) return <LoadingState />;
  return (
    <div className="space-y-6" data-testid="crm-pipeline-page">
      <PageTitle title="Funil de vendas" subtitle={editable ? "Etapas e probabilidades usadas no cálculo do pipeline ponderado. Requer MFA ativo." : "Somente administradores podem editar o funil."}
        actions={editable && <Button onClick={save} disabled={busy} className="rounded-full" data-testid="pipeline-save-button">{busy ? "Salvando..." : "Salvar funil"}</Button>} />
      <div className="max-w-3xl space-y-4 rounded-xl border border-border bg-card p-6">
        <Input value={name} disabled={!editable} onChange={(e) => setName(e.target.value)} aria-label="Nome do funil" data-testid="pipeline-name-input" />
        {stages.map((s, i) => (
          <div key={i} className="flex flex-wrap items-center gap-2" data-testid={`pipeline-stage-${i}`}>
            <span className="w-6 font-mono text-xs text-muted-foreground">{i + 1}</span>
            <Input className="min-w-[180px] flex-1" value={s.name} disabled={!editable} onChange={(e) => update(i, { name: e.target.value, ...(data?.stages.some((d) => d.key === s.key) ? {} : { key: slug(e.target.value) || s.key }) })} data-testid={`pipeline-stage-name-${i}`} />
            <Input className="w-24" type="number" min={0} max={100} value={s.probability} disabled={!editable} onChange={(e) => update(i, { probability: Number(e.target.value) })} aria-label="Probabilidade" data-testid={`pipeline-stage-prob-${i}`} />
            {editable && <>
              <Button variant="ghost" size="icon" disabled={i === 0} onClick={() => swap(i, i - 1)} data-testid={`pipeline-stage-up-${i}`}><ArrowUp className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" disabled={i === stages.length - 1} onClick={() => swap(i, i + 1)} data-testid={`pipeline-stage-down-${i}`}><ArrowDown className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" disabled={stages.length <= 2} onClick={() => setStages(stages.filter((_, j) => j !== i))} data-testid={`pipeline-stage-remove-${i}`}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </>}
          </div>
        ))}
        {editable && stages.length < 12 && (
          <Button variant="outline" onClick={() => setStages([...stages, { key: `etapa_${Date.now().toString(36)}`, name: "Nova etapa", probability: 50 }])} data-testid="pipeline-add-stage"><Plus className="mr-1 h-4 w-4" /> Adicionar etapa</Button>
        )}
      </div>
    </div>
  );
}
