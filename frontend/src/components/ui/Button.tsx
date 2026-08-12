import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "whatsapp" | "gold";
type Size = "sm" | "md" | "lg" | "xl";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-600 text-white hover:bg-brand-700 shadow-sm shadow-brand-600/30 focus-visible:ring-brand-500",
  secondary:
    "bg-gold-500 text-white hover:bg-gold-600 shadow-sm shadow-gold-500/30 focus-visible:ring-gold-500",
  outline:
    "border border-brand-200 text-brand-700 hover:bg-brand-50 bg-white focus-visible:ring-brand-500",
  ghost:
    "text-brand-700 hover:bg-brand-50 focus-visible:ring-brand-500 bg-transparent",
  whatsapp:
    "bg-[#25D366] text-white hover:bg-[#1fb958] shadow-sm shadow-[#25D366]/30 focus-visible:ring-[#25D366]",
  gold: "bg-gradient-to-r from-gold-400 to-gold-600 text-white hover:from-gold-500 hover:to-gold-700 shadow-sm shadow-gold-500/40 focus-visible:ring-gold-500",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
  xl: "h-14 px-8 text-base",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  loading?: boolean;
}

export default function Button({
  variant = "primary",
  size = "md",
  fullWidth,
  loading,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60",
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
      )}
      {children}
    </button>
  );
}
