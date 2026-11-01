import { useState } from "react";
import { Outlet } from "react-router-dom";
import { RecebimentoSidebar } from "../components/RecebimentoSidebar";
import { RecebimentoHeader } from "../components/RecebimentoHeader";

export const RecebimentoLayout = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex min-h-screen w-full bg-[hsl(var(--surface))]" style={{ ["--product" as string]: "#15803D" }} data-testid="recebimento-layout">
      <div className="sticky top-0 hidden h-screen lg:block"><RecebimentoSidebar /></div>
      {open && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div className="h-full"><RecebimentoSidebar onNavigate={() => setOpen(false)} /></div>
          <button type="button" aria-label="Fechar menu" className="flex-1 bg-black/40" onClick={() => setOpen(false)} data-testid="recebimento-menu-overlay" />
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <RecebimentoHeader onMenu={() => setOpen(true)} />
        <main className="w-full flex-1 p-4 sm:p-6 lg:p-8" data-testid="recebimento-main"><Outlet /></main>
      </div>
    </div>
  );
};
