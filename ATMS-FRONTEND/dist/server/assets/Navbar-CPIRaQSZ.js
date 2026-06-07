import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useNavigate, Link } from "@tanstack/react-router";
import { ShieldCheck, GraduationCap, LogOut } from "lucide-react";
import { u as useAuth } from "./router-BIxLXd9m.js";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const variants = {
  primary: "bg-gradient-to-r from-[oklch(0.72_0.16_195)] to-[oklch(0.65_0.21_270)] text-[oklch(0.15_0.01_280)] font-semibold shadow-[0_8px_30px_-6px_oklch(0.72_0.16_195/0.6)] hover:shadow-[0_10px_40px_-6px_oklch(0.65_0.21_270/0.7)]",
  secondary: "bg-white/5 text-foreground border border-white/10 hover:bg-white/10",
  ghost: "text-foreground/80 hover:bg-white/5",
  danger: "bg-gradient-to-r from-[oklch(0.65_0.24_25)] to-[oklch(0.62_0.24_15)] text-white shadow-[0_8px_30px_-6px_oklch(0.65_0.24_25/0.55)]",
  outline: "border border-white/15 text-foreground hover:border-[oklch(0.72_0.16_195/0.6)] hover:text-[oklch(0.88_0.12_195)]"
};
const sizes = {
  sm: "h-9 px-3 text-sm rounded-lg",
  md: "h-11 px-5 text-sm rounded-xl",
  lg: "h-13 px-7 text-base rounded-xl"
};
function Button({
  variant = "primary",
  size = "md",
  loading,
  icon,
  className,
  children,
  disabled,
  ...rest
}) {
  return /* @__PURE__ */ jsxs(
    "button",
    {
      ...rest,
      disabled: disabled || loading,
      className: cn(
        "btn-press inline-flex items-center justify-center gap-2 select-none",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
        variants[variant],
        sizes[size],
        className
      ),
      children: [
        loading ? /* @__PURE__ */ jsx("span", { className: "h-4 w-4 rounded-full border-2 border-current/30 border-t-current animate-spin" }) : icon,
        children
      ]
    }
  );
}
function Navbar() {
  const { role, professor, student, adminUsername, logout } = useAuth();
  const navigate = useNavigate();
  const onLogout = () => {
    logout();
    navigate({ to: "/login" });
  };
  return /* @__PURE__ */ jsx("header", { className: "sticky top-4 z-40 mx-auto w-[min(1280px,calc(100%-2rem))]", children: /* @__PURE__ */ jsxs("div", { className: "glass-strong rounded-2xl px-4 sm:px-6 py-3 flex items-center justify-between", children: [
    /* @__PURE__ */ jsxs(Link, { to: "/", className: "flex items-center gap-3 group", children: [
      /* @__PURE__ */ jsx("div", { className: "h-9 w-9 rounded-xl bg-gradient-to-br from-[oklch(0.72_0.16_195)] via-[oklch(0.65_0.21_270)] to-[oklch(0.65_0.24_305)] grid place-items-center text-[oklch(0.15_0.01_280)] font-bold shadow-lg", children: "A" }),
      /* @__PURE__ */ jsxs("div", { className: "leading-tight", children: [
        /* @__PURE__ */ jsx("div", { className: "text-sm font-semibold tracking-tight", children: "ATMS" }),
        /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-[0.18em] text-muted-foreground", children: "Attendance OS" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("nav", { className: "hidden md:flex items-center gap-1", children: [
      role === "PROFESSOR" && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(NavItem, { to: "/subjects", label: "Subjects" }),
        /* @__PURE__ */ jsx(NavItem, { to: "/reports", label: "Reports" }),
        /* @__PURE__ */ jsx(NavItem, { to: "/qrcode-generator", label: "QR Generator" })
      ] }),
      role === "STUDENT" && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(NavItem, { to: "/student-dashboard", label: "Dashboard" }),
        /* @__PURE__ */ jsx(NavItem, { to: "/student-scan", label: "Scan QR" })
      ] }),
      role === "ADMIN" && /* @__PURE__ */ jsx(NavItem, { to: "/admin-dashboard", label: "Control Hub" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      role && /* @__PURE__ */ jsxs("div", { className: "hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full glass border-white/10", children: [
        role === "ADMIN" ? /* @__PURE__ */ jsx(ShieldCheck, { className: "h-3.5 w-3.5 text-[oklch(0.78_0.15_190)]" }) : /* @__PURE__ */ jsx(GraduationCap, { className: "h-3.5 w-3.5 text-[oklch(0.78_0.15_190)]" }),
        /* @__PURE__ */ jsx("span", { className: "text-xs font-medium", children: role === "ADMIN" ? adminUsername || "Admin" : role === "PROFESSOR" && professor ? `${professor.firstName} ${professor.lastName}` : role === "STUDENT" && student ? `${student.firstName} ${student.lastName}` : "User" }),
        /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: role })
      ] }),
      role ? /* @__PURE__ */ jsx(Button, { variant: "secondary", size: "sm", icon: /* @__PURE__ */ jsx(LogOut, { className: "h-4 w-4" }), onClick: onLogout, children: "Logout" }) : /* @__PURE__ */ jsx(Button, { variant: "primary", size: "sm", onClick: () => navigate({ to: "/login" }), children: "Sign in" })
    ] })
  ] }) });
}
function NavItem({ to, label }) {
  return /* @__PURE__ */ jsx(
    Link,
    {
      to,
      className: "px-3 py-1.5 rounded-lg text-sm text-foreground/80 hover:text-foreground hover:bg-white/5 transition",
      activeProps: { className: "bg-white/10 text-foreground" },
      children: label
    }
  );
}
export {
  Button as B,
  Navbar as N,
  cn as c
};
