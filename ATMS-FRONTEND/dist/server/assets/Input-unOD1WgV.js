import { jsxs, jsx } from "react/jsx-runtime";
import { forwardRef } from "react";
import { c as cn } from "./Navbar-CPIRaQSZ.js";
const Input = forwardRef(
  ({ label, error, hint, leading, className, id, ...rest }, ref) => {
    const inputId = id || rest.name;
    return /* @__PURE__ */ jsxs("div", { className: "w-full", children: [
      label && /* @__PURE__ */ jsx(
        "label",
        {
          htmlFor: inputId,
          className: "block text-xs font-medium text-foreground/80 mb-1.5 tracking-wide",
          children: label
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        leading && /* @__PURE__ */ jsx("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground", children: leading }),
        /* @__PURE__ */ jsx(
          "input",
          {
            ref,
            id: inputId,
            ...rest,
            className: cn(
              "glass-input w-full h-11 rounded-xl px-3.5 text-sm text-foreground placeholder:text-muted-foreground/70",
              leading && "pl-10",
              error && "border-[oklch(0.65_0.24_25/0.6)] focus:border-[oklch(0.65_0.24_25/0.8)]",
              className
            )
          }
        )
      ] }),
      error ? /* @__PURE__ */ jsx("p", { className: "mt-1.5 text-xs text-[oklch(0.80_0.18_25)]", children: error }) : hint ? /* @__PURE__ */ jsx("p", { className: "mt-1.5 text-xs text-muted-foreground", children: hint }) : null
    ] });
  }
);
Input.displayName = "Input";
const Select = forwardRef(({ label, error, className, children, id, ...rest }, ref) => {
  const selId = id || rest.name;
  return /* @__PURE__ */ jsxs("div", { className: "w-full", children: [
    label && /* @__PURE__ */ jsx("label", { htmlFor: selId, className: "block text-xs font-medium text-foreground/80 mb-1.5 tracking-wide", children: label }),
    /* @__PURE__ */ jsx(
      "select",
      {
        ref,
        id: selId,
        ...rest,
        className: cn(
          "glass-input w-full h-11 rounded-xl px-3 text-sm text-foreground appearance-none",
          "bg-[oklch(0.22_0.01_280)]",
          error && "border-[oklch(0.65_0.24_25/0.6)]",
          className
        ),
        children
      }
    ),
    error && /* @__PURE__ */ jsx("p", { className: "mt-1.5 text-xs text-[oklch(0.80_0.18_25)]", children: error })
  ] });
});
Select.displayName = "Select";
const Textarea = forwardRef(({ label, className, id, ...rest }, ref) => {
  const tId = id || rest.name;
  return /* @__PURE__ */ jsxs("div", { className: "w-full", children: [
    label && /* @__PURE__ */ jsx("label", { htmlFor: tId, className: "block text-xs font-medium text-foreground/80 mb-1.5 tracking-wide", children: label }),
    /* @__PURE__ */ jsx(
      "textarea",
      {
        ref,
        id: tId,
        ...rest,
        className: cn("glass-input w-full rounded-xl px-3.5 py-2.5 text-sm min-h-[88px]", className)
      }
    )
  ] });
});
Textarea.displayName = "Textarea";
export {
  Input as I,
  Select as S
};
