import { ReactNode } from "react";
import { Label } from "@/components/ui/label";

export const Field = ({ label, htmlFor, children, className = "" }: { label: string; htmlFor: string; children: ReactNode; className?: string }) => (
  <div className={`space-y-2 ${className}`}>
    <Label htmlFor={htmlFor}>{label}</Label>
    {children}
  </div>
);

export const NativeSelect = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select {...props} className={`h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${props.className || ""}`} />
);
