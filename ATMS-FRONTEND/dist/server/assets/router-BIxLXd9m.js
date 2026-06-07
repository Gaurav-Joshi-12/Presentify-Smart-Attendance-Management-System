import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, useRouter, Link, Outlet, HeadContent, Scripts, createFileRoute, lazyRouteComponent, createRouter } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect, createContext, useContext } from "react";
import { Toaster as Toaster$1 } from "sonner";
import { z } from "zod";
const appCss = "/assets/styles-FXHFLDNE.css";
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
const STORAGE_KEY = "atms.auth.v2";
function AuthProvider({ children }) {
  const [role, setRole] = useState(null);
  const [professor, setProfessor] = useState(null);
  const [student, setStudent] = useState(null);
  const [adminUsername, setAdminUsername] = useState(null);
  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
      if (raw) {
        const s = JSON.parse(raw);
        setRole(s.role || null);
        setProfessor(s.professor || null);
        setStudent(s.student || null);
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
    setStudent(null);
    persist({ role: "ADMIN", professor: null, student: null, adminUsername: username });
  };
  const loginProfessor = (prof) => {
    setRole("PROFESSOR");
    setProfessor(prof);
    setAdminUsername(null);
    setStudent(null);
    persist({ role: "PROFESSOR", professor: prof, student: null, adminUsername: null });
  };
  const loginStudent = (stu) => {
    setRole("STUDENT");
    setStudent(stu);
    setProfessor(null);
    setAdminUsername(null);
    persist({ role: "STUDENT", professor: null, student: stu, adminUsername: null });
  };
  const logout = () => {
    setRole(null);
    setProfessor(null);
    setStudent(null);
    setAdminUsername(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
    }
  };
  return /* @__PURE__ */ jsx(
    AuthContext.Provider,
    {
      value: {
        role,
        professor,
        student,
        adminUsername,
        loginAdmin,
        loginProfessor,
        loginStudent,
        logout
      },
      children
    }
  );
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
const Route$9 = createRootRouteWithContext()({
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
  const { queryClient } = Route$9.useRouteContext();
  return /* @__PURE__ */ jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxs(AuthProvider, { children: [
    /* @__PURE__ */ jsx(Outlet, {}),
    /* @__PURE__ */ jsx(Toaster, { theme: "dark", position: "top-right", richColors: true, closeButton: true })
  ] }) });
}
const $$splitComponentImporter$8 = () => import("./subjects-DSEtYdhw.js");
const Route$8 = createFileRoute("/subjects")({
  head: () => ({
    meta: [{
      title: "My Subjects — ATMS"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./student-scan-C5qL2Tg6.js");
const Route$7 = createFileRoute("/student-scan")({
  head: () => ({
    meta: [{
      title: "Student Scan — ATMS"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./student-dashboard-DfTHPgtC.js");
const Route$6 = createFileRoute("/student-dashboard")({
  head: () => ({
    meta: [{
      title: "Student Dashboard — ATMS"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./reports-BAma4Czs.js");
const Route$5 = createFileRoute("/reports")({
  head: () => ({
    meta: [{
      title: "Reports — ATMS"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./qrcode-generator-B4zZlZJh.js");
const searchSchema = z.object({
  lectureId: z.coerce.number().optional().catch(1),
  topic: z.string().optional().catch("Demo Lecture")
});
const Route$4 = createFileRoute("/qrcode-generator")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [{
      title: "QR Generator — ATMS"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./login-C1g6aVER.js");
const Route$3 = createFileRoute("/login")({
  head: () => ({
    meta: [{
      title: "Login — ATMS"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./admin-dashboard-B-YY-dL5.js");
const Route$2 = createFileRoute("/admin-dashboard")({
  head: () => ({
    meta: [{
      title: "Admin Control Hub — ATMS"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./index-jr6Q6H6A.js");
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
const $$splitComponentImporter = () => import("./attendance-session._lectureId-DvSB06mv.js");
const Route = createFileRoute("/attendance-session/$lectureId")({
  head: () => ({
    meta: [{
      title: "Attendance Session — ATMS"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const SubjectsRoute = Route$8.update({
  id: "/subjects",
  path: "/subjects",
  getParentRoute: () => Route$9
});
const StudentScanRoute = Route$7.update({
  id: "/student-scan",
  path: "/student-scan",
  getParentRoute: () => Route$9
});
const StudentDashboardRoute = Route$6.update({
  id: "/student-dashboard",
  path: "/student-dashboard",
  getParentRoute: () => Route$9
});
const ReportsRoute = Route$5.update({
  id: "/reports",
  path: "/reports",
  getParentRoute: () => Route$9
});
const QrcodeGeneratorRoute = Route$4.update({
  id: "/qrcode-generator",
  path: "/qrcode-generator",
  getParentRoute: () => Route$9
});
const LoginRoute = Route$3.update({
  id: "/login",
  path: "/login",
  getParentRoute: () => Route$9
});
const AdminDashboardRoute = Route$2.update({
  id: "/admin-dashboard",
  path: "/admin-dashboard",
  getParentRoute: () => Route$9
});
const IndexRoute = Route$1.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$9
});
const AttendanceSessionLectureIdRoute = Route.update({
  id: "/attendance-session/$lectureId",
  path: "/attendance-session/$lectureId",
  getParentRoute: () => Route$9
});
const rootRouteChildren = {
  IndexRoute,
  AdminDashboardRoute,
  LoginRoute,
  QrcodeGeneratorRoute,
  ReportsRoute,
  StudentDashboardRoute,
  StudentScanRoute,
  SubjectsRoute,
  AttendanceSessionLectureIdRoute
};
const routeTree = Route$9._addFileChildren(rootRouteChildren)._addFileTypes();
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
  Route$4 as R,
  Route as a,
  router as r,
  useAuth as u
};
