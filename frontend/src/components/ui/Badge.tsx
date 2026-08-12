import { cn } from "@/lib/utils";

type BadgeVariant = "green" | "gold" | "red" | "outline" | "dark";

const variants: Record<BadgeVariant, string> = {
  green: "bg-brand-100 text-brand-700",
  gold: "bg-gold-100 text-gold-700",
  red: "bg-red-100 text-red-700",
  outline: "border border-brand-200 text-brand-700 bg-white/80",
  dark: "bg-brand-900 text-brand-50",
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export default function Badge({ children, variant = "green", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
