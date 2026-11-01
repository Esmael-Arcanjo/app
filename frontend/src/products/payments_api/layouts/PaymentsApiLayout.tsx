import { useState } from "react";
import { Outlet } from "react-router-dom";
import { PaymentsApiSidebar } from "../components/PaymentsApiSidebar";
import { PaymentsApiHeader } from "../components/PaymentsApiHeader";

export const PaymentsApiLayout = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex min-h-screen w-full bg-[hsl(var(--surface))]" style={{ ["--product" as string]: "#4338CA" }} data-testid="payments-api-layout">
      <div className="sticky top-0 hidden h-screen lg:block"><PaymentsApiSidebar /></div>
      {open && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div className="h-full"><PaymentsApiSidebar onNavigate={() => setOpen(false)} /></div>
          <button type="button" aria-label="Fechar menu" className="flex-1 bg-black/40" onClick={() => setOpen(false)} data-testid="payments-api-menu-overlay" />
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <PaymentsApiHeader onMenu={() => setOpen(true)} />
        <main className="w-full flex-1 p-4 sm:p-6 lg:p-8" data-testid="payments-api-main"><Outlet /></main>
      </div>
    </div>
  );
};
