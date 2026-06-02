import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, useRouter, Link, Outlet, HeadContent, Scripts, createFileRoute, lazyRouteComponent, createRouter } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect, createContext, useContext } from "react";
import { Toaster as Toaster$1 } from "sonner";
const appCss = "/assets/styles-CYuz4HTS.css";
function reportLovableError(error, context = {}) {
  if (typeof window === "undefined") return;
  window.__lovableEvents?.captureException?.(
    error,
    {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context
    },
    {
      mechanism: "react_error_boundary",
      handled: false,
      severity: "error"
    }
  );
}
const AuthContext = createContext(void 0);
const STORAGE_KEY = "atms.auth.v1";
function AuthProvider({ children }) {
  const [role, setRole] = useState(null);
  const [professor, setProfessor] = useState(null);
  const [adminUsername, setAdminUsername] = useState(null);
  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
      if (raw) {
        const s = JSON.parse(raw);
        setRole(s.role || null);
        setProfessor(s.professor || null);
        setAdminUsername(s.adminUsername || null);
      }
    } catch {
    }
  }, []);
  const persist = (next) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
    }
  };
  const loginAdmin = (username) => {
    setRole("ADMIN");
    setAdminUsername(username);
    setProfessor(null);
    persist({ role: "ADMIN", professor: null, adminUsername: username });
  };
  const loginProfessor = (prof) => {
    setRole("PROFESSOR");
    setProfessor(prof);
    setAdminUsername(null);
    persist({ role: "PROFESSOR", professor: prof, adminUsername: null });
  };
  const logout = () => {
    setRole(null);
    setProfessor(null);
    setAdminUsername(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
    }
  };
  return /* @__PURE__ */ jsx(AuthContext.Provider, { value: { role, professor, adminUsername, loginAdmin, loginProfessor, logout }, children });
}
const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
const Toaster = ({ ...props }) => {
  return /* @__PURE__ */ jsx(
    Toaster$1,
    {
      className: "toaster group",
      toastOptions: {
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      },
      ...props
    }
  );
};
function NotFoundComponent() {
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "This page didn't load" }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Something went wrong on our end. You can try refreshing or head back home." }),
    /* @__PURE__ */ jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const Route$6 = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "ATMS — Attendance Management" },
      { name: "description", content: "Premium attendance management system for colleges, professors and students." },
      { name: "author", content: "ATMS" },
      { property: "og:title", content: "ATMS — Attendance Management" },
      { property: "og:description", content: "Premium attendance management system." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" }
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@300;400;500;600;700;800&display=swap" },
      { rel: "stylesheet", href: appCss }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$6.useRouteContext();
  return /* @__PURE__ */ jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxs(AuthProvider, { children: [
    /* @__PURE__ */ jsx(Outlet, {}),
    /* @__PURE__ */ jsx(Toaster, { theme: "dark", position: "top-right", richColors: true, closeButton: true })
  ] }) });
}
const $$splitComponentImporter$5 = () => import("./subjects-Bxuhl9Uy.js");
const Route$5 = createFileRoute("/subjects")({
  head: () => ({
    meta: [{
      title: "My Subjects — ATMS"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./reports-CMv4SrTL.js");
const Route$4 = createFileRoute("/reports")({
  head: () => ({
    meta: [{
      title: "Reports — ATMS"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./login-4dnQNxI4.js");
const Route$3 = createFileRoute("/login")({
  head: () => ({
    meta: [{
      title: "Login — ATMS"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./admin-dashboard-CZPHRRzU.js");
const Route$2 = createFileRoute("/admin-dashboard")({
  head: () => ({
    meta: [{
      title: "Admin Control Hub — ATMS"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./index-xfEi3RAh.js");
const Route$1 = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "ATMS — Premium Attendance OS"
    }, {
      name: "description",
      content: "Track lectures, mark attendance and generate reports with a modern glassmorphic interface."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./attendance-session._lectureId-CirkWMmc.js");
const Route = createFileRoute("/attendance-session/$lectureId")({
  head: () => ({
    meta: [{
      title: "Attendance Session — ATMS"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const SubjectsRoute = Route$5.update({
  id: "/subjects",
  path: "/subjects",
  getParentRoute: () => Route$6
});
const ReportsRoute = Route$4.update({
  id: "/reports",
  path: "/reports",
  getParentRoute: () => Route$6
});
const LoginRoute = Route$3.update({
  id: "/login",
  path: "/login",
  getParentRoute: () => Route$6
});
const AdminDashboardRoute = Route$2.update({
  id: "/admin-dashboard",
  path: "/admin-dashboard",
  getParentRoute: () => Route$6
});
const IndexRoute = Route$1.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$6
});
const AttendanceSessionLectureIdRoute = Route.update({
  id: "/attendance-session/$lectureId",
  path: "/attendance-session/$lectureId",
  getParentRoute: () => Route$6
});
const rootRouteChildren = {
  IndexRoute,
  AdminDashboardRoute,
  LoginRoute,
  ReportsRoute,
  SubjectsRoute,
  AttendanceSessionLectureIdRoute
};
const routeTree = Route$6._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  Route as R,
  router as r,
  useAuth as u
};
