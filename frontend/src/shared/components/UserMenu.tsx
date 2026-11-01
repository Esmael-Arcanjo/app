import { Link } from "react-router-dom";
import { Bell, HelpCircle, LogOut, MonitorSmartphone, Settings, ShieldCheck, User } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ITEMS = [
  { label: "Meu Perfil", to: "perfil", icon: User, id: "profile" },
  { label: "Configurações", to: "configuracoes", icon: Settings, id: "settings" },
  { label: "Segurança", to: "seguranca", icon: ShieldCheck, id: "security" },
  { label: "Sessões Ativas", to: "sessoes", icon: MonitorSmartphone, id: "sessions" },
  { label: "Notificações", to: "notificacoes", icon: Bell, id: "notifications" },
  { label: "Ajuda e Suporte", to: "ajuda", icon: HelpCircle, id: "help" },
];

const initials = (name: string) => name.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]).join("").toUpperCase();

type Props = { basePath: string; name: string; email: string; organization: string; onLogout: () => void };

export const UserMenu = ({ basePath, name, email, organization, onLogout }: Props) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <button type="button" className="ml-auto grid h-10 w-10 shrink-0 place-items-center rounded-full bg-foreground font-display text-sm font-bold text-background ring-offset-2 transition-shadow hover:ring-2 hover:ring-[color:var(--product)]" aria-label="Abrir menu do usuário" data-testid="user-avatar-button">
        {initials(name) || "?"}
      </button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-64">
      <DropdownMenuLabel>
        <p className="truncate text-sm font-semibold">{name}</p>
        <p className="truncate text-xs font-normal text-muted-foreground">{email}</p>
        <p className="mt-1 truncate text-xs font-normal text-muted-foreground md:hidden">EMPRESA: {organization}</p>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      {ITEMS.map((item) => (
        <DropdownMenuItem key={item.id} asChild>
          <Link to={`${basePath}/${item.to}`} className="cursor-pointer" data-testid={`user-menu-${item.id}`}>
            <item.icon className="mr-2 h-4 w-4" /> {item.label}
          </Link>
        </DropdownMenuItem>
      ))}
      <DropdownMenuSeparator />
      <DropdownMenuItem onSelect={onLogout} className="cursor-pointer text-destructive" data-testid="user-menu-logout">
        <LogOut className="mr-2 h-4 w-4" /> Sair
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);
