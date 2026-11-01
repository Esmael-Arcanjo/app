import { Link } from "react-router-dom";

export const Logo = ({ light = false }: { light?: boolean }) => (
  <Link to="/" className="flex items-center gap-2" data-testid="brand-logo">
    <span className={`grid h-8 w-8 place-items-center rounded-lg font-display text-sm font-extrabold ${light ? "bg-white text-foreground" : "bg-foreground text-background"}`}>L</span>
    <span className={`font-display text-lg font-extrabold tracking-tight ${light ? "text-white" : ""}`}>LEAMSE</span>
  </Link>
);
