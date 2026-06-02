import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type Size = "sm" | "md" | "lg";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: ReactNode;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-[oklch(0.72_0.16_195)] to-[oklch(0.65_0.21_270)] text-[oklch(0.15_0.01_280)] font-semibold shadow-[0_8px_30px_-6px_oklch(0.72_0.16_195/0.6)] hover:shadow-[0_10px_40px_-6px_oklch(0.65_0.21_270/0.7)]",
  secondary:
    "bg-white/5 text-foreground border border-white/10 hover:bg-white/10",
  ghost: "text-foreground/80 hover:bg-white/5",
  danger:
    "bg-gradient-to-r from-[oklch(0.65_0.24_25)] to-[oklch(0.62_0.24_15)] text-white shadow-[0_8px_30px_-6px_oklch(0.65_0.24_25/0.55)]",
  outline:
    "border border-white/15 text-foreground hover:border-[oklch(0.72_0.16_195/0.6)] hover:text-[oklch(0.88_0.12_195)]",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-sm rounded-lg",
  md: "h-11 px-5 text-sm rounded-xl",
  lg: "h-13 px-7 text-base rounded-xl",
};

export default function Button({
  variant = "primary",
  size = "md",
  loading,
  icon,
  className,
  children,
  disabled,
  ...rest
}: Props) {
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      className={cn(
        "btn-press inline-flex items-center justify-center gap-2 select-none",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {loading ? (
        <span className="h-4 w-4 rounded-full border-2 border-current/30 border-t-current animate-spin" />
      ) : (
        icon
      )}
      {children}
    </button>
  );
}
