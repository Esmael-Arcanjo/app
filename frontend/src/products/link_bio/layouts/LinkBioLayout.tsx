import { useState } from "react";
import { Outlet } from "react-router-dom";
import { LinkBioSidebar } from "../components/LinkBioSidebar";
import { LinkBioHeader } from "../components/LinkBioHeader";

export const LinkBioLayout = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex min-h-screen w-full bg-[hsl(var(--surface))]" style={{ ["--product" as string]: "#6D28D9" }} data-testid="link-bio-layout">
      <div className="sticky top-0 hidden h-screen lg:block"><LinkBioSidebar /></div>
      {open && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div className="h-full"><LinkBioSidebar onNavigate={() => setOpen(false)} /></div>
          <button type="button" aria-label="Fechar menu" className="flex-1 bg-black/40" onClick={() => setOpen(false)} data-testid="link-bio-menu-overlay" />
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <LinkBioHeader onMenu={() => setOpen(true)} />
        <main className="w-full flex-1 p-4 sm:p-6 lg:p-8" data-testid="link-bio-main"><Outlet /></main>
      </div>
    </div>
  );
};
