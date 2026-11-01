import { useState } from "react";
import { Outlet } from "react-router-dom";
import { ErpSidebar } from "../components/ErpSidebar";
import { ErpHeader } from "../components/ErpHeader";

export const ErpLayout = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex min-h-screen w-full bg-[hsl(var(--surface))]" style={{ ["--product" as string]: "#1D4ED8" }} data-testid="erp-layout">
      <div className="sticky top-0 hidden h-screen lg:block"><ErpSidebar /></div>
      {open && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div className="h-full"><ErpSidebar onNavigate={() => setOpen(false)} /></div>
          <button type="button" aria-label="Fechar menu" className="flex-1 bg-black/40" onClick={() => setOpen(false)} data-testid="erp-menu-overlay" />
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <ErpHeader onMenu={() => setOpen(true)} />
        <main className="w-full flex-1 p-4 sm:p-6 lg:p-8" data-testid="erp-main"><Outlet /></main>
      </div>
    </div>
  );
};
