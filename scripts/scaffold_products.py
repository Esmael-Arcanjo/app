"""Scaffolds the backend modules and frontend apps of the nine products (idempotent: never overwrites files)."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CONFIG = json.loads((Path(__file__).parent / "products.json").read_text())

BACKEND_ROUTER = '''from fastapi import APIRouter, Depends

from app.core.authorization.deps import ProductContext, require_product
from app.database.mongo import db

P = "{key}"
COLLECTIONS = {collections}
router = APIRouter(prefix="/api/v1/{key}", tags=["{key}"])


@router.get("/overview")
async def overview(ctx: ProductContext = Depends(require_product(P, "read"))):
    """Real counts of this product's collections. Business rules are pending (documented in PRD)."""
    counts = {{c: await db[c].count_documents({{"organization_id": ctx.org_id}}) for c in COLLECTIONS}}
    return {{"product_key": P, "implementation_status": "in_development", "counts": counts}}
'''

ACCOUNT_PAGES = {
    "ProfilePage": ("ProfileSection", "Meu Perfil"),
    "SettingsPage": ("SettingsSection", "Configurações"),
    "SecurityPage": ("SecuritySection", "Segurança"),
    "SessionsPage": ("SessionsSection", "Sessões Ativas"),
    "NotificationsPage": ("NotificationsSection", "Notificações"),
    "HelpPage": ("HelpSection", "Ajuda e Suporte"),
}


def write(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    if not path.exists():
        path.write_text(content)


def backend(p: dict) -> None:
    base = ROOT / "backend/app/products" / p["key"]
    for folder in ["api", "models", "schemas", "services", "repositories", "tests"]:
        write(base / folder / "__init__.py", "")
    write(base / "__init__.py", "")
    write(base / "api/router.py", BACKEND_ROUTER.format(key=p["key"], collections=json.dumps(p["collections"])))


def frontend(p: dict) -> None:
    base = ROOT / "frontend/src/products" / p["key"]
    name, comp = p["name"], p["component"]
    for folder in ["layouts", "components", "pages", "services", "hooks", "types", "utils"]:
        (base / folder).mkdir(parents=True, exist_ok=True)
    nav = ",\n".join(f'  {{ label: "{n["label"]}", to: "{n["to"]}", icon: {n["icon"]}, testId: "{p["slug"]}-nav-{n["id"]}" }}'
                     for n in p["nav"])
    icons = sorted({n["icon"] for n in p["nav"]} | {p["icon"]})
    write(base / "utils/constants.ts", f'''export const PRODUCT_KEY = "{p["key"]}";
export const PRODUCT_SLUG = "{p["slug"]}";
export const PRODUCT_NAME = "{name}";
export const BASE_PATH = "/{p["slug"]}";
''')
    write(base / "types/index.ts", '''export type NavItem = { label: string; to: string; icon: React.ComponentType<{ className?: string }>; testId: string };
''')
    write(base / f"hooks/use{comp}Context.tsx", f'''import {{ useProductContext }} from "@/shared/product/ProductAccessGuard";

export const use{comp}Context = () => useProductContext();
''')
    write(base / "services/api.ts", f'''import {{ productApi }} from "@/shared/api/client";
import {{ PRODUCT_KEY }} from "../utils/constants";

export const {p["key"]}Api = (organizationId: string) => productApi(organizationId);
export const overviewPath = `/api/v1/${{PRODUCT_KEY}}/overview`;
''')
    write(base / f"components/{comp}Sidebar.tsx", f'''import {{ NavLink }} from "react-router-dom";
import {{ {", ".join(icons)} }} from "lucide-react";
import {{ BASE_PATH, PRODUCT_NAME }} from "../utils/constants";
import type {{ NavItem }} from "../types";

const NAV: NavItem[] = [
{nav}
];

export const {comp}Sidebar = ({{ onNavigate }}: {{ onNavigate?: () => void }}) => (
  <aside className="flex h-full w-64 flex-col border-r border-border bg-[hsl(var(--sidebar))]" data-testid="{p["slug"]}-sidebar">
    <div className="flex h-16 items-center gap-3 border-b border-border px-5">
      <span className="grid h-9 w-9 place-items-center rounded-lg text-white" style={{{{ background: "{p["color"]}" }}}}>
        <{p["icon"]} className="h-5 w-5" />
      </span>
      <div className="leading-tight">
        <p className="font-display text-sm font-extrabold">{name}</p>
        <p className="text-[11px] uppercase tracking-widest text-muted-foreground">LEAMSE</p>
      </div>
    </div>
    <nav className="flex-1 space-y-1 overflow-y-auto p-3">
      {{NAV.map((item) => (
        <NavLink key={{item.to}} to={{`${{BASE_PATH}}${{item.to}}`}} end={{item.to === ""}} onClick={{onNavigate}} data-testid={{item.testId}}
          className={{({{ isActive }}) => `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${{isActive ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted hover:text-foreground"}}`}}>
          <item.icon className="h-4 w-4" />
          {{item.label}}
        </NavLink>
      ))}}
    </nav>
    <p className="border-t border-border p-4 text-[11px] text-muted-foreground">{{PRODUCT_NAME}} · v1</p>
  </aside>
);
''')
    write(base / f"components/{comp}Header.tsx", f'''import {{ useNavigate }} from "react-router-dom";
import {{ Menu }} from "lucide-react";
import {{ useAuth }} from "@/shared/auth/AuthContext";
import {{ UserMenu }} from "@/shared/components/UserMenu";
import {{ use{comp}Context }} from "../hooks/use{comp}Context";
import {{ BASE_PATH }} from "../utils/constants";

export const {comp}Header = ({{ onMenu }}: {{ onMenu: () => void }}) => {{
  const {{ user, logout }} = useAuth();
  const ctx = use{comp}Context();
  const navigate = useNavigate();
  const firstName = (user?.name || "").split(" ")[0];
  const onLogout = async () => {{ await logout(); navigate("/entrar"); }};
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur-xl sm:px-6" data-testid="{p["slug"]}-header">
      <button type="button" onClick={{onMenu}} className="rounded-md p-2 hover:bg-muted lg:hidden" aria-label="Abrir menu" data-testid="{p["slug"]}-menu-toggle">
        <Menu className="h-5 w-5" />
      </button>
      <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-4">
        <span className="shrink-0 rounded-md px-2.5 py-1 text-[11px] font-bold uppercase tracking-widest text-white" style={{{{ background: "{p["color"]}" }}}} data-testid="header-segment">{{ctx.segment_name}}</span>
        <span className="truncate text-sm font-semibold" data-testid="header-greeting">Olá, {{firstName}}!</span>
        <span className="hidden truncate text-sm text-muted-foreground md:inline" data-testid="header-organization">EMPRESA: <b className="text-foreground">{{ctx.organization_name}}</b></span>
      </div>
      <UserMenu basePath={{BASE_PATH}} name={{user?.name || ""}} email={{user?.email || ""}} organization={{ctx.organization_name}} onLogout={{onLogout}} />
    </header>
  );
}};
''')
    write(base / f"layouts/{comp}Layout.tsx", f'''import {{ useState }} from "react";
import {{ Outlet }} from "react-router-dom";
import {{ {comp}Sidebar }} from "../components/{comp}Sidebar";
import {{ {comp}Header }} from "../components/{comp}Header";

export const {comp}Layout = () => {{
  const [open, setOpen] = useState(false);
  return (
    <div className="flex min-h-screen w-full bg-[hsl(var(--surface))]" style={{{{ ["--product" as string]: "{p["color"]}" }}}} data-testid="{p["slug"]}-layout">
      <div className="sticky top-0 hidden h-screen lg:block"><{comp}Sidebar /></div>
      {{open && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div className="h-full"><{comp}Sidebar onNavigate={{() => setOpen(false)}} /></div>
          <button type="button" aria-label="Fechar menu" className="flex-1 bg-black/40" onClick={{() => setOpen(false)}} data-testid="{p["slug"]}-menu-overlay" />
        </div>
      )}}
      <div className="flex min-w-0 flex-1 flex-col">
        <{comp}Header onMenu={{() => setOpen(true)}} />
        <main className="w-full flex-1 p-4 sm:p-6 lg:p-8" data-testid="{p["slug"]}-main"><Outlet /></main>
      </div>
    </div>
  );
}};
''')
    for page, (section, title) in ACCOUNT_PAGES.items():
        write(base / f"pages/{page}.tsx", f'''import {{ PageTitle }} from "@/shared/components/PageTitle";
import {{ {section} }} from "@/shared/account/{section}";
import {{ PRODUCT_KEY }} from "../utils/constants";

export default function {page}() {{
  return (
    <div className="space-y-6">
      <PageTitle title="{title}" />
      <{section} productKey={{PRODUCT_KEY}} />
    </div>
  );
}}
''')
    if not p.get("functional"):
        labels = json.dumps({c: c.replace("_", " ") for c in p["collections"]}, ensure_ascii=False)
        write(base / "pages/DashboardPage.tsx", f'''import {{ useEffect, useState }} from "react";
import {{ Construction }} from "lucide-react";
import {{ PageTitle }} from "@/shared/components/PageTitle";
import {{ LoadingState, ErrorState }} from "@/shared/components/States";
import {{ errMsg }} from "@/shared/api/client";
import {{ {p["key"]}Api, overviewPath }} from "../services/api";
import {{ use{comp}Context }} from "../hooks/use{comp}Context";

const LABELS: Record<string, string> = {labels};

export default function DashboardPage() {{
  const ctx = use{comp}Context();
  const [data, setData] = useState<{{ counts: Record<string, number> }} | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {{
    {p["key"]}Api(ctx.organization_id).get(overviewPath).then((r) => setData(r.data)).catch((e) => setError(errMsg(e)));
  }}, [ctx.organization_id]);
  if (error) return <ErrorState message={{error}} />;
  if (!data) return <LoadingState />;
  return (
    <div className="space-y-6">
      <PageTitle title="Painel — {name}" subtitle="Indicadores reais desta organização." />
      <div className="flex items-start gap-3 rounded-xl border border-dashed border-border bg-card p-5" data-testid="{p["slug"]}-pending-notice">
        <Construction className="mt-0.5 h-5 w-5 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">As regras de negócio deste produto estão em desenvolvimento. A estrutura, a segurança e o isolamento já estão ativos; os contadores abaixo refletem dados reais (vazios até a implementação).</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {{Object.entries(data.counts).map(([k, v]) => (
          <div key={{k}} className="rounded-xl border border-border bg-card p-5" data-testid={{`{p["slug"]}-count-${{k}}`}}>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">{{LABELS[k] || k}}</p>
            <p className="mt-2 font-display text-3xl font-extrabold">{{v}}</p>
          </div>
        ))}}
      </div>
    </div>
  );
}}
''')
    extra = p.get("pages", [])
    imports = "\n".join(f'import {pg} from "./pages/{pg}";' for pg in ["DashboardPage", *extra, *ACCOUNT_PAGES])
    routes = "\n".join(f'          <Route path="{r}" element={{<{pg} />}} />'
                       for pg, r in [(pg, p["routes"][pg]) for pg in extra] +
                       [("ProfilePage", "perfil"), ("SettingsPage", "configuracoes"), ("SecurityPage", "seguranca"),
                        ("SessionsPage", "sessoes"), ("NotificationsPage", "notificacoes"), ("HelpPage", "ajuda")])
    write(base / f"{comp}App.tsx", f'''import {{ Navigate, Route, Routes }} from "react-router-dom";
import {{ ProductAccessGuard }} from "@/shared/product/ProductAccessGuard";
import {{ {comp}Layout }} from "./layouts/{comp}Layout";
import {{ PRODUCT_KEY, PRODUCT_NAME }} from "./utils/constants";
{imports}

export default function {comp}App() {{
  return (
    <ProductAccessGuard productKey={{PRODUCT_KEY}} productName={{PRODUCT_NAME}}>
      <Routes>
        <Route element={{<{comp}Layout />}}>
          <Route index element={{<DashboardPage />}} />
{routes}
          <Route path="*" element={{<Navigate to="" replace />}} />
        </Route>
      </Routes>
    </ProductAccessGuard>
  );
}}
''')


if __name__ == "__main__":
    for product in CONFIG:
        backend(product)
        frontend(product)
    print("scaffolded", len(CONFIG), "products")
