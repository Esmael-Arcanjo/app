import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { useAuth } from "@/shared/auth/AuthContext";
import { UserMenu } from "@/shared/components/UserMenu";
import { useChatbotContext } from "../hooks/useChatbotContext";
import { BASE_PATH } from "../utils/constants";

export const ChatbotHeader = ({ onMenu }: { onMenu: () => void }) => {
  const { user, logout } = useAuth();
  const ctx = useChatbotContext();
  const navigate = useNavigate();
  const firstName = (user?.name || "").split(" ")[0];
  const onLogout = async () => { await logout(); navigate("/entrar"); };
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur-xl sm:px-6" data-testid="chatbot-header">
      <button type="button" onClick={onMenu} className="rounded-md p-2 hover:bg-muted lg:hidden" aria-label="Abrir menu" data-testid="chatbot-menu-toggle">
        <Menu className="h-5 w-5" />
      </button>
      <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-4">
        <span className="shrink-0 rounded-md px-2.5 py-1 text-[11px] font-bold uppercase tracking-widest text-white" style={{ background: "#0E7490" }} data-testid="header-segment">{ctx.segment_name}</span>
        <span className="truncate text-sm font-semibold" data-testid="header-greeting">Olá, {firstName}!</span>
        <span className="hidden truncate text-sm text-muted-foreground md:inline" data-testid="header-organization">EMPRESA: <b className="text-foreground">{ctx.organization_name}</b></span>
      </div>
      <UserMenu basePath={BASE_PATH} name={user?.name || ""} email={user?.email || ""} organization={ctx.organization_name} onLogout={onLogout} />
    </header>
  );
};
