import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useMemo, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Timer, Wifi, Radio, Users } from "lucide-react";
import { f as formatClock } from "./formatters-BydI8FSF.js";
function QrGenerator({
  lectureId,
  topic,
  durationSec = 600,
  students = [],
  existingAttendance = []
}) {
  const [remaining, setRemaining] = useState(durationSec);
  const [seed, setSeed] = useState(0);
  const payload = useMemo(
    () => JSON.stringify({
      lectureId
    }),
    [lectureId]
  );
  const feed = useMemo(() => {
    return (existingAttendance || []).filter((att) => att.remarks?.startsWith("Attendance Marked with QR")).map((att) => {
      const student = students.find((s) => s.studentId === att.studentId);
      let timeStr = "--:--";
      if (att.markedAt) {
        try {
          let sanitized = att.markedAt;
          if (sanitized.includes(".")) {
            const parts = sanitized.split(".");
            const main = parts[0];
            const frac = parts[1] || "";
            sanitized = frac ? `${main}.${frac.slice(0, 3)}` : main;
          }
          const date = new Date(sanitized);
          if (!isNaN(date.getTime())) {
            timeStr = formatClock(date);
          }
        } catch (e) {
          console.error("Error parsing markedAt:", e);
        }
      }
      return {
        id: att.studentId,
        name: student ? `${student.firstName} ${student.lastName}` : `Student #${att.studentId}`,
        rollNo: student ? student.rollNo : "STU-UNKNOWN",
        time: timeStr,
        status: att.attendanceStatus,
        rawTime: att.markedAt ? new Date(att.markedAt).getTime() : 0
      };
    }).sort((a, b) => b.rawTime - a.rawTime);
  }, [existingAttendance, students]);
  useEffect(() => {
    const t = setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1e3);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    const t = setInterval(() => setSeed((s) => s + 1), 15e3);
    return () => clearInterval(t);
  }, []);
  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");
  return /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-5 gap-5", children: [
    /* @__PURE__ */ jsxs("div", { className: "lg:col-span-3 glass rounded-2xl p-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "text-[11px] uppercase tracking-[0.2em] text-muted-foreground", children: "Active session" }),
          /* @__PURE__ */ jsx("div", { className: "text-lg font-semibold mt-1", children: topic || `Lecture #${lectureId}` })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 px-3 py-1.5 rounded-full bg-[oklch(0.72_0.18_155/0.15)] border border-[oklch(0.72_0.18_155/0.4)]", children: [
          /* @__PURE__ */ jsx("span", { className: "h-2 w-2 rounded-full bg-[oklch(0.72_0.18_155)] animate-pulse" }),
          /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-[oklch(0.88_0.14_155)]", children: "LIVE" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid sm:grid-cols-2 gap-5 items-center", children: [
        /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "p-4 rounded-2xl bg-white shadow-[0_0_60px_-10px_oklch(0.72_0.16_195/0.6)]", children: /* @__PURE__ */ jsx(QRCodeSVG, { value: payload, size: 220, bgColor: "#ffffff", fgColor: "#0F0F10", level: "H" }) }) }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsx(Metric, { icon: /* @__PURE__ */ jsx(Timer, { className: "h-4 w-4" }), label: "Time remaining", value: `${mm}:${ss}`, accent: true }),
          /* @__PURE__ */ jsx(Metric, { icon: /* @__PURE__ */ jsx(Wifi, { className: "h-4 w-4" }), label: "Token rotation", value: "every 15s" }),
          /* @__PURE__ */ jsx(Metric, { icon: /* @__PURE__ */ jsx(Radio, { className: "h-4 w-4" }), label: "Scan frequency", value: `${feed.length} / min` }),
          /* @__PURE__ */ jsx(Metric, { icon: /* @__PURE__ */ jsx(Users, { className: "h-4 w-4" }), label: "Check-ins", value: String(feed.length) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 glass rounded-2xl p-5", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-3", children: [
        /* @__PURE__ */ jsx("h4", { className: "text-sm font-semibold", children: "Live check-ins" }),
        /* @__PURE__ */ jsx("span", { className: "text-[11px] text-muted-foreground", children: "streaming" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2 max-h-[420px] overflow-y-auto pr-1", children: [
        feed.length === 0 && /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground py-8 text-center", children: "Waiting for students to scan…" }),
        feed.map((c) => /* @__PURE__ */ jsxs(
          "div",
          {
            className: "animate-ticker flex items-center justify-between rounded-xl border border-white/5 bg-white/3 px-3 py-2.5",
            children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("div", { className: "text-sm font-medium", children: c.name }),
                /* @__PURE__ */ jsx("div", { className: "text-[11px] font-mono text-muted-foreground", children: c.rollNo })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
                /* @__PURE__ */ jsx("div", { className: "text-[11px] text-muted-foreground", children: c.time }),
                /* @__PURE__ */ jsx("div", { className: c.status === "PRESENT" ? "text-[11px] font-semibold text-[oklch(0.88_0.14_155)]" : c.status === "ABSENT" ? "text-[11px] font-semibold text-[oklch(0.65_0.24_25)]" : c.status === "LATE" ? "text-[11px] font-semibold text-[oklch(0.80_0.17_75)]" : c.status === "LEAVE" ? "text-[11px] font-semibold text-[oklch(0.65_0.21_270)]" : "text-[11px] font-semibold text-muted-foreground", children: c.status })
              ] })
            ]
          },
          c.id
        ))
      ] })
    ] })
  ] });
}
function Metric({ icon, label, value, accent }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between rounded-xl border border-white/8 bg-white/3 px-4 py-3", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-muted-foreground text-xs", children: [
      icon,
      label
    ] }),
    /* @__PURE__ */ jsx("div", { className: `text-base font-semibold tabular-nums ${accent ? "neon-text" : ""}`, children: value })
  ] });
}
export {
  QrGenerator as Q
};
