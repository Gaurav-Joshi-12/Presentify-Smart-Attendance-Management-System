import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Props extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title?: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  padded?: boolean;
  variant?: "default" | "strong";
}

export default function Card({
  title,
  subtitle,
  actions,
  padded = true,
  variant = "default",
  className,
  children,
  ...rest
}: Props) {
  return (
    <div
      {...rest}
      className={cn(
        variant === "strong" ? "glass-strong" : "glass",
        "rounded-2xl overflow-hidden",
        className
      )}
    >
      {(title || actions) && (
        <div className="flex items-start justify-between gap-4 px-5 pt-5">
          <div>
            {title && (
              <h3 className="text-base font-semibold tracking-tight">{title}</h3>
            )}
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
          {actions}
        </div>
      )}
      <div className={cn(padded ? "p-5" : "")}>{children}</div>
    </div>
  );
}
