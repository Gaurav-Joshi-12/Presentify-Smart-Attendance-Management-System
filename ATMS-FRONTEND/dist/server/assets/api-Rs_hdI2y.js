import { jsxs, jsx } from "react/jsx-runtime";
import { c as cn } from "./Navbar-CPIRaQSZ.js";
import axios from "axios";
function Card({
  title,
  subtitle,
  actions,
  padded = true,
  variant = "default",
  className,
  children,
  ...rest
}) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ...rest,
      className: cn(
        variant === "strong" ? "glass-strong" : "glass",
        "rounded-2xl overflow-hidden",
        className
      ),
      children: [
        (title || actions) && /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-4 px-5 pt-5", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            title && /* @__PURE__ */ jsx("h3", { className: "text-base font-semibold tracking-tight", children: title }),
            subtitle && /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mt-1", children: subtitle })
          ] }),
          actions
        ] }),
        /* @__PURE__ */ jsx("div", { className: cn(padded ? "p-5" : ""), children })
      ]
    }
  );
}
const __vite_import_meta_env__ = {};
const API_BASE_URL = __vite_import_meta_env__?.VITE_API_BASE_URL || "http://localhost:8082";
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15e3
});
api.interceptors.response.use(
  (r) => r,
  (err) => {
    const msg = err?.response?.data?.body || err?.response?.data?.message || err?.response?.data?.error || err?.message || "Network error";
    return Promise.reject(new Error(msg));
  }
);
export {
  Card as C,
  api as a
};
