import { NavLink } from "react-router-dom";
import { Boxes, LayoutDashboard } from "lucide-react";
import { BASE_PATH, PRODUCT_NAME } from "../utils/constants";
import type { NavItem } from "../types";

const NAV: NavItem[] = [
  { label: "Painel", to: "", icon: LayoutDashboard, testId: "erp-nav-dashboard" }
];

export const ErpSidebar = ({ onNavigate }: { onNavigate?: () => void }) => (
  <aside className="flex h-full w-64 flex-col border-r border-border bg-[hsl(var(--sidebar))]" data-testid="erp-sidebar">
    <div className="flex h-16 items-center gap-3 border-b border-border px-5">
      <span className="grid h-9 w-9 place-items-center rounded-lg text-white" style={{ background: "#1D4ED8" }}>
        <Boxes className="h-5 w-5" />
      </span>
      <div className="leading-tight">
        <p className="font-display text-sm font-extrabold">ERP</p>
        <p className="text-[11px] uppercase tracking-widest text-muted-foreground">LEAMSE</p>
      </div>
    </div>
    <nav className="flex-1 space-y-1 overflow-y-auto p-3">
      {NAV.map((item) => (
        <NavLink key={item.to} to={`${BASE_PATH}${item.to}`} end={item.to === ""} onClick={onNavigate} data-testid={item.testId}
          className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
          <item.icon className="h-4 w-4" />
          {item.label}
        </NavLink>
      ))}
    </nav>
    <p className="border-t border-border p-4 text-[11px] text-muted-foreground">{PRODUCT_NAME} · v1</p>
  </aside>
);
