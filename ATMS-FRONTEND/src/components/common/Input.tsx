import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leading?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, Props>(
  ({ label, error, hint, leading, className, id, ...rest }, ref) => {
    const inputId = id || rest.name;
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-medium text-foreground/80 mb-1.5 tracking-wide"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leading && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {leading}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            {...rest}
            className={cn(
              "glass-input w-full h-11 rounded-xl px-3.5 text-sm text-foreground placeholder:text-muted-foreground/70",
              leading && "pl-10",
              error && "border-[oklch(0.65_0.24_25/0.6)] focus:border-[oklch(0.65_0.24_25/0.8)]",
              className
            )}
          />
        </div>
        {error ? (
          <p className="mt-1.5 text-xs text-[oklch(0.80_0.18_25)]">{error}</p>
        ) : hint ? (
          <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>
        ) : null}
      </div>
    );
  }
);
Input.displayName = "Input";
export default Input;

// Re-export styled select & textarea using the same look
export const Select = forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string; error?: string }
>(({ label, error, className, children, id, ...rest }, ref) => {
  const selId = id || rest.name;
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selId} className="block text-xs font-medium text-foreground/80 mb-1.5 tracking-wide">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={selId}
        {...rest}
        className={cn(
          "glass-input w-full h-11 rounded-xl px-3 text-sm text-foreground appearance-none",
          "bg-[oklch(0.22_0.01_280)]",
          error && "border-[oklch(0.65_0.24_25/0.6)]",
          className
        )}
      >
        {children}
      </select>
      {error && <p className="mt-1.5 text-xs text-[oklch(0.80_0.18_25)]">{error}</p>}
    </div>
  );
});
Select.displayName = "Select";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string }
>(({ label, className, id, ...rest }, ref) => {
  const tId = id || rest.name;
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={tId} className="block text-xs font-medium text-foreground/80 mb-1.5 tracking-wide">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={tId}
        {...rest}
        className={cn("glass-input w-full rounded-xl px-3.5 py-2.5 text-sm min-h-[88px]", className)}
      />
    </div>
  );
});
Textarea.displayName = "Textarea";
