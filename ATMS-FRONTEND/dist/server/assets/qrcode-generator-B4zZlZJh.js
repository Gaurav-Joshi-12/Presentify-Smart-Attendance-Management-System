import { jsxs, jsx } from "react/jsx-runtime";
import { N as Navbar } from "./Navbar-CPIRaQSZ.js";
import { Q as QrGenerator } from "./QrGenerator-LPlnRksu.js";
import { R as Route } from "./router-BIxLXd9m.js";
import "@tanstack/react-router";
import "lucide-react";
import "clsx";
import "tailwind-merge";
import "react";
import "qrcode.react";
import "./formatters-BydI8FSF.js";
import "@tanstack/react-query";
import "sonner";
import "zod";
function QrCodeGeneratorPage() {
  const {
    lectureId,
    topic
  } = Route.useSearch();
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen pb-16", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsxs("main", { className: "mx-auto w-[min(1280px,calc(100%-2rem))] mt-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsx("div", { className: "text-[11px] uppercase tracking-[0.2em] text-muted-foreground", children: "QR Code Gate" }),
        /* @__PURE__ */ jsx("h1", { className: "text-2xl sm:text-3xl font-semibold mt-1", children: "Live QR Session" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Display this QR code for students to scan and mark their attendance." })
      ] }),
      /* @__PURE__ */ jsx(QrGenerator, { lectureId: lectureId ?? 1, topic: topic ?? "Demo Lecture" })
    ] })
  ] });
}
export {
  QrCodeGeneratorPage as component
};
