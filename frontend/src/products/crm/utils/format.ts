export const money = (cents: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format((cents || 0) / 100);
export const toCents = (value: string) => Math.round((parseFloat(value.replace(/\./g, "").replace(",", ".")) || 0) * 100);
export const fromCents = (cents: number) => ((cents || 0) / 100).toFixed(2).replace(".", ",");
export const dateTime = (iso: string | null) => (iso ? new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }) : "—");
export const emptyToNull = <T extends Record<string, unknown>>(obj: T): T =>
  Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, v === "" ? null : v])) as T;

export const LEAD_STATUS: Record<string, string> = { new: "Novo", contacted: "Contatado", qualified: "Qualificado", lost: "Perdido", converted: "Convertido" };
export const ACTIVITY_TYPE: Record<string, string> = { call: "Ligação", email: "E-mail", meeting: "Reunião", task: "Tarefa", note: "Nota" };
export const OPP_STATUS: Record<string, string> = { open: "Aberta", won: "Ganha", lost: "Perdida" };
export const ROLE_LABEL: Record<string, string> = { owner: "Proprietário", admin: "Administrador", member: "Membro", viewer: "Leitor" };
export const canWrite = (role: string) => role !== "viewer";
export const canDelete = (role: string) => role === "owner" || role === "admin";
export const canManage = (role: string) => role === "owner" || role === "admin";
