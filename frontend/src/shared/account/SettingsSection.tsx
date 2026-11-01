import { useState } from "react";
import { toast } from "sonner";
import { api, errMsg } from "@/shared/api/client";
import { useAuth } from "@/shared/auth/AuthContext";
import { useProductContext } from "@/shared/product/ProductAccessGuard";
import { Switch } from "@/components/ui/switch";

const PREFS = [
  { key: "email_billing", label: "Cobrança e assinatura", desc: "Faturas, renovações e falhas de pagamento." },
  { key: "email_security", label: "Segurança da conta", desc: "Novos acessos, alterações de senha e MFA." },
  { key: "email_product", label: "Atividades do produto", desc: "Convites e eventos relevantes da organização." },
] as const;

const ROLE_LABEL = { owner: "Proprietário", admin: "Administrador", member: "Membro", viewer: "Leitor" };

export const SettingsSection = (_: { productKey: string }) => {
  const { user, setUser } = useAuth();
  const ctx = useProductContext();
  const [prefs, setPrefs] = useState(user!.notification_prefs);

  const toggle = async (key: keyof typeof prefs, value: boolean) => {
    const next = { ...prefs, [key]: value };
    setPrefs(next);
    try {
      await api.put("/api/v1/users/me/notification-preferences", next);
      setUser({ ...user!, notification_prefs: next });
      toast.success("Preferência salva");
    } catch (e) {
      setPrefs(prefs);
      toast.error(errMsg(e));
    }
  };

  return (
    <div className="grid w-full gap-6 xl:grid-cols-2">
      <div className="rounded-xl border border-border bg-card p-6" data-testid="settings-organization-card">
        <h2 className="font-display text-base font-bold">Organização ativa</h2>
        <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div><dt className="text-muted-foreground">Empresa</dt><dd className="font-semibold">{ctx.organization_name}</dd></div>
          <div><dt className="text-muted-foreground">Segmento</dt><dd className="font-semibold">{ctx.segment_name}</dd></div>
          <div><dt className="text-muted-foreground">Plano</dt><dd className="font-semibold capitalize">{ctx.plan_key}</dd></div>
          <div><dt className="text-muted-foreground">Seu papel</dt><dd className="font-semibold">{ROLE_LABEL[ctx.role]}</dd></div>
        </dl>
      </div>
      <div className="rounded-xl border border-border bg-card p-6" data-testid="settings-email-prefs">
        <h2 className="font-display text-base font-bold">Preferências de e-mail</h2>
        <div className="mt-4 divide-y divide-border">
          {PREFS.map((p) => (
            <label key={p.key} className="flex items-center justify-between gap-4 py-3">
              <span><span className="block text-sm font-semibold">{p.label}</span><span className="text-xs text-muted-foreground">{p.desc}</span></span>
              <Switch checked={prefs[p.key]} onCheckedChange={(v: boolean) => toggle(p.key, v)} data-testid={`settings-pref-${p.key}`} />
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};
