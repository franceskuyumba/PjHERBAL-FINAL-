import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/Spinner";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "gold" | "outline" | "ghost" | "white" | "whatsapp" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: ReactNode;
  fullWidth?: boolean;
}

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "btn-primary",
  gold: "btn-gold",
  outline: "btn-outline",
  ghost: "btn-ghost",
  white: "btn-white",
  whatsapp: "btn-whatsapp",
  danger: "btn bg-red-600 text-white shadow-card hover:bg-red-700",
};

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "btn-sm",
  md: "btn-md",
  lg: "btn-lg",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "primary", size = "md", loading, icon, fullWidth, children, disabled, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      className={cn(
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && "w-full",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Spinner className="h-4 w-4" /> : icon}
      {children}
    </button>
  );
});
