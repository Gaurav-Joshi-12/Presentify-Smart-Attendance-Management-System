import { jsxs, jsx } from "react/jsx-runtime";
import { useNavigate, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { u as useAuth } from "./router-BIxLXd9m.js";
import { N as Navbar, B as Button } from "./Navbar-CPIRaQSZ.js";
import { Sparkles, ArrowRight, Users, QrCode } from "lucide-react";
import "@tanstack/react-query";
import "sonner";
import "zod";
import "clsx";
import "tailwind-merge";
function Landing() {
  const {
    role
  } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (role === "ADMIN") navigate({
      to: "/admin-dashboard"
    });
    else if (role === "PROFESSOR") navigate({
      to: "/subjects"
    });
    else if (role === "STUDENT") navigate({
      to: "/student-dashboard"
    });
    else navigate({
      to: "/login"
    });
  }, [role, navigate]);
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen pb-20", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsxs("main", { className: "mx-auto w-[min(1280px,calc(100%-2rem))] mt-16", children: [
      /* @__PURE__ */ jsxs("section", { className: "text-center max-w-3xl mx-auto", children: [
        /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border-white/10 mb-6 text-xs", children: [
          /* @__PURE__ */ jsx(Sparkles, { className: "h-3.5 w-3.5 text-[oklch(0.78_0.15_190)]" }),
          "Premium Attendance Management"
        ] }),
        /* @__PURE__ */ jsxs("h1", { className: "text-4xl sm:text-6xl font-bold tracking-tight", children: [
          "The ",
          /* @__PURE__ */ jsx("span", { className: "neon-text", children: "attendance OS" }),
          /* @__PURE__ */ jsx("br", {}),
          "for modern campuses."
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mt-5 text-muted-foreground text-base sm:text-lg max-w-xl mx-auto", children: "Manual marking, live QR check-ins and instant reports — wrapped in a glassmorphic interface that students and faculty actually enjoy using." }),
        /* @__PURE__ */ jsx("div", { className: "mt-8 flex items-center justify-center gap-3", children: /* @__PURE__ */ jsx(Link, { to: "/login", children: /* @__PURE__ */ jsx(Button, { size: "lg", icon: /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" }), children: "Get Started" }) }) })
      ] }),
      /* @__PURE__ */ jsx("section", { className: "mt-16 grid md:grid-cols-3 gap-5", children: [{
        icon: /* @__PURE__ */ jsx(Users, { className: "h-5 w-5" }),
        t: "Admin Control Hub",
        d: "Manage colleges, departments, professors, students and subjects from one elegant panel."
      }, {
        icon: /* @__PURE__ */ jsx(QrCode, { className: "h-5 w-5" }),
        t: "Live QR Sessions",
        d: "Spin up secure rotating QR codes with real-time check-in feeds and countdown timers."
      }, {
        icon: /* @__PURE__ */ jsx(Sparkles, { className: "h-5 w-5" }),
        t: "Smart Reports",
        d: "Per-student percentages, lecture-level rosters and red-flag indicators below 75%."
      }].map((f) => /* @__PURE__ */ jsxs("div", { className: "glass rounded-2xl p-6", children: [
        /* @__PURE__ */ jsx("div", { className: "h-10 w-10 grid place-items-center rounded-xl bg-white/5 border border-white/10 text-[oklch(0.78_0.15_190)]", children: f.icon }),
        /* @__PURE__ */ jsx("h3", { className: "mt-4 text-lg font-semibold", children: f.t }),
        /* @__PURE__ */ jsx("p", { className: "mt-1.5 text-sm text-muted-foreground", children: f.d })
      ] }, f.t)) })
    ] })
  ] });
}
export {
  Landing as component
};
