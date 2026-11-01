import { useState } from "react";
import { Outlet } from "react-router-dom";
import { MarketplaceSidebar } from "../components/MarketplaceSidebar";
import { MarketplaceHeader } from "../components/MarketplaceHeader";

export const MarketplaceLayout = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex min-h-screen w-full bg-[hsl(var(--surface))]" style={{ ["--product" as string]: "#B45309" }} data-testid="marketplace-layout">
      <div className="sticky top-0 hidden h-screen lg:block"><MarketplaceSidebar /></div>
      {open && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div className="h-full"><MarketplaceSidebar onNavigate={() => setOpen(false)} /></div>
          <button type="button" aria-label="Fechar menu" className="flex-1 bg-black/40" onClick={() => setOpen(false)} data-testid="marketplace-menu-overlay" />
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <MarketplaceHeader onMenu={() => setOpen(true)} />
        <main className="w-full flex-1 p-4 sm:p-6 lg:p-8" data-testid="marketplace-main"><Outlet /></main>
      </div>
    </div>
  );
};
