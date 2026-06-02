import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useMemo, useEffect } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import { c as cn, B as Button, N as Navbar } from "./Navbar-6CkWdqZA.js";
import { C as Card } from "./api-BYmOYr6M.js";
import { R as Route, u as useAuth } from "./router-pUeayUFD.js";
import { p as profService } from "./profService-D0eDg11o.js";
import { Search, CheckCircle2, Timer, Wifi, Radio, Users, ClipboardCheck, QrCode, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";
import { f as formatClock } from "./formatters-BydI8FSF.js";
import "clsx";
import "tailwind-merge";
import "axios";
import "@tanstack/react-query";
const STATUSES = ["PRESENT", "ABSENT", "LATE", "LEAVE"];
const pillFor = (s, active) => {
  const base = "px-2.5 py-1 text-[11px] font-semibold rounded-md border transition btn-press";
  if (!active)
    return `${base} bg-white/3 border-white/10 text-muted-foreground hover:text-foreground hover:bg-white/5`;
  switch (s) {
    case "PRESENT":
      return `${base} bg-[oklch(0.72_0.18_155/0.18)] border-[oklch(0.72_0.18_155/0.5)] text-[oklch(0.88_0.14_155)] shadow-[0_0_18px_oklch(0.72_0.18_155/0.35)]`;
    case "ABSENT":
      return `${base} bg-[oklch(0.65_0.24_25/0.18)] border-[oklch(0.65_0.24_25/0.55)] text-[oklch(0.85_0.15_25)] shadow-[0_0_18px_oklch(0.65_0.24_25/0.35)]`;
    case "LATE":
      return `${base} bg-[oklch(0.80_0.17_75/0.18)] border-[oklch(0.80_0.17_75/0.5)] text-[oklch(0.90_0.15_75)]`;
    case "LEAVE":
      return `${base} bg-[oklch(0.65_0.21_270/0.18)] border-[oklch(0.65_0.21_270/0.5)] text-[oklch(0.85_0.15_270)]`;
  }
};
function ManualMarkingTable({
  students,
  lectureId,
  onSubmitted
}) {
  const [rows, setRows] = useState(
    () => Object.fromEntries(
      students.map((s) => [s.studentId, { status: "PRESENT", remarks: "" }])
    )
  );
  const [query, setQuery] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return students;
    return students.filter(
      (s) => s.rollNo.toLowerCase().includes(q) || `${s.firstName} ${s.lastName}`.toLowerCase().includes(q)
    );
  }, [students, query]);
  const counts = useMemo(() => {
    const c = { PRESENT: 0, ABSENT: 0, LATE: 0, LEAVE: 0 };
    Object.values(rows).forEach((r) => {
      c[r.status]++;
    });
    return c;
  }, [rows]);
  const update = (id, patch) => setRows((p) => ({ ...p, [id]: { ...p[id], ...patch } }));
  const markAll = (s) => setRows((p) => Object.fromEntries(Object.entries(p).map(([k, v]) => [k, { ...v, status: s }])));
  const submit = async () => {
    setSubmitting(true);
    try {
      await Promise.all(
        students.map(
          (s) => profService.markAttendance({
            attendanceStatus: rows[s.studentId].status,
            remarks: rows[s.studentId].remarks,
            lectureId,
            studentId: s.studentId
          })
        )
      );
      toast.success("Attendance submitted", { description: `${students.length} students recorded` });
      onSubmitted?.();
    } catch (e) {
      const err = e;
      toast.error("Failed to submit", { description: err.message });
    } finally {
      setSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-3 justify-between", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2 flex-wrap", children: STATUSES.map((s) => /* @__PURE__ */ jsxs("div", { className: cn(pillFor(s, true), "cursor-default"), children: [
        s,
        " · ",
        counts[s]
      ] }, s)) }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              value: query,
              onChange: (e) => setQuery(e.target.value),
              placeholder: "Search roll no / name",
              className: "glass-input rounded-lg h-9 pl-9 pr-3 text-sm w-64"
            }
          )
        ] }),
        /* @__PURE__ */ jsx(Button, { size: "sm", variant: "secondary", onClick: () => markAll("PRESENT"), children: "All Present" }),
        /* @__PURE__ */ jsx(Button, { size: "sm", variant: "ghost", onClick: () => markAll("ABSENT"), children: "All Absent" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "glass rounded-xl overflow-hidden", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-12 gap-3 px-4 py-3 text-[11px] uppercase tracking-wider text-muted-foreground border-b border-white/5", children: [
        /* @__PURE__ */ jsx("div", { className: "col-span-2", children: "Roll No" }),
        /* @__PURE__ */ jsx("div", { className: "col-span-3", children: "Student" }),
        /* @__PURE__ */ jsx("div", { className: "col-span-4", children: "Status" }),
        /* @__PURE__ */ jsx("div", { className: "col-span-3", children: "Remarks" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "max-h-[520px] overflow-y-auto", children: [
        filtered.length === 0 && /* @__PURE__ */ jsx("div", { className: "px-4 py-12 text-center text-sm text-muted-foreground", children: "No students match." }),
        filtered.map((s) => {
          const row = rows[s.studentId];
          return /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-12 gap-3 px-4 py-3 row-hover border-b border-white/5 items-center", children: [
            /* @__PURE__ */ jsx("div", { className: "col-span-2 font-mono text-xs text-foreground/80", children: s.rollNo }),
            /* @__PURE__ */ jsxs("div", { className: "col-span-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "text-sm font-medium", children: [
                s.firstName,
                " ",
                s.lastName
              ] }),
              /* @__PURE__ */ jsx("div", { className: "text-[11px] text-muted-foreground", children: s.email })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "col-span-4 flex items-center gap-1.5 flex-wrap", children: STATUSES.map((st) => /* @__PURE__ */ jsx("button", { type: "button", onClick: () => update(s.studentId, { status: st }), className: pillFor(st, row.status === st), children: st }, st)) }),
            /* @__PURE__ */ jsx("div", { className: "col-span-3", children: /* @__PURE__ */ jsx(
              "input",
              {
                value: row.remarks,
                onChange: (e) => update(s.studentId, { remarks: e.target.value }),
                placeholder: "Reason / note",
                className: "glass-input rounded-lg h-9 px-3 text-sm w-full"
              }
            ) })
          ] }, s.studentId);
        })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxs(Button, { onClick: submit, loading: submitting, icon: /* @__PURE__ */ jsx(CheckCircle2, { className: "h-4 w-4" }), children: [
      "Submit Attendance (",
      students.length,
      ")"
    ] }) })
  ] });
}
const MOCK_NAMES = [
  ["Arjun", "Sharma", "STU-2026-0021"],
  ["Priya", "Iyer", "STU-2026-0022"],
  ["Rohit", "Verma", "STU-2026-0023"],
  ["Neha", "Patil", "STU-2026-0024"],
  ["Kabir", "Khan", "STU-2026-0025"],
  ["Aditi", "Rao", "STU-2026-0026"],
  ["Ishaan", "Mehta", "STU-2026-0027"]
];
function QrGenerator({
  lectureId,
  topic,
  durationSec = 600
}) {
  const [remaining, setRemaining] = useState(durationSec);
  const [feed, setFeed] = useState([]);
  const [seed, setSeed] = useState(0);
  const payload = useMemo(
    () => JSON.stringify({
      lectureId,
      ts: Date.now(),
      token: Math.random().toString(36).slice(2, 10),
      seed
    }),
    [lectureId, seed]
  );
  useEffect(() => {
    const t = setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1e3);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    const t = setInterval(() => setSeed((s) => s + 1), 15e3);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      if (i >= MOCK_NAMES.length) return clearInterval(t);
      const [f, l, r] = MOCK_NAMES[i++];
      setFeed((prev) => [
        { id: Date.now(), name: `${f} ${l}`, rollNo: r, time: formatClock(/* @__PURE__ */ new Date()) },
        ...prev
      ]);
    }, 2200);
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
                /* @__PURE__ */ jsx("div", { className: "text-[11px] font-semibold text-[oklch(0.88_0.14_155)]", children: "PRESENT" })
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
const MOCK_STUDENTS = Array.from({
  length: 10
}).map((_, i) => ({
  studentId: 100 + i,
  rollNo: `STU-2026-00${String(20 + i).padStart(2, "0")}`,
  firstName: ["Arjun", "Priya", "Rohit", "Neha", "Kabir", "Aditi", "Ishaan", "Riya", "Vikas", "Sara"][i],
  lastName: ["Sharma", "Iyer", "Verma", "Patil", "Khan", "Rao", "Mehta", "Kapoor", "Reddy", "Joshi"][i],
  email: `student${i}@college.edu`,
  phoneNo: "9999999999",
  gender: i % 2 ? "FEMALE" : "MALE",
  dob: "2005-01-01",
  year: 2,
  semester: 3,
  division: "A",
  admissionDate: "2024-08-01",
  collegeId: 1,
  departmentId: 2
}));
function AttendanceSession() {
  const {
    lectureId
  } = Route.useParams();
  const lecId = Number(lectureId);
  const {
    role,
    professor
  } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState("MANUAL");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (role !== "PROFESSOR") {
      navigate({
        to: "/login"
      });
      return;
    }
    if (!professor) return;
    setLoading(true);
    profService.listClassStudents({
      year: 2,
      semester: 3,
      division: "A",
      departmentId: professor.departmentId
    }).then((data) => setStudents(data?.length ? data : MOCK_STUDENTS)).catch(() => {
      setStudents(MOCK_STUDENTS);
      toast.message("Showing demo roster");
    }).finally(() => setLoading(false));
  }, [role, professor, navigate]);
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen pb-16", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsxs("main", { className: "mx-auto w-[min(1280px,calc(100%-2rem))] mt-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "text-[11px] uppercase tracking-[0.2em] text-muted-foreground", children: "Live Attendance" }),
          /* @__PURE__ */ jsxs("h1", { className: "text-2xl sm:text-3xl font-semibold mt-1", children: [
            "Lecture #",
            lecId
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Mark students manually or open a live QR session." })
        ] }),
        /* @__PURE__ */ jsx(Link, { to: "/subjects", className: "text-sm text-muted-foreground hover:text-foreground", children: "← Subjects" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 p-1 rounded-xl bg-white/3 border border-white/8 mb-6 max-w-md", children: [{
        k: "MANUAL",
        label: "Manual Roster",
        icon: /* @__PURE__ */ jsx(ClipboardCheck, { className: "h-4 w-4" })
      }, {
        k: "QR",
        label: "QR Code Gate",
        icon: /* @__PURE__ */ jsx(QrCode, { className: "h-4 w-4" })
      }].map((t) => /* @__PURE__ */ jsxs("button", { onClick: () => setMode(t.k), className: cn("flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition btn-press", mode === t.k ? "bg-gradient-to-r from-[oklch(0.72_0.16_195/0.25)] to-[oklch(0.65_0.21_270/0.25)] text-foreground border border-white/10" : "text-muted-foreground hover:text-foreground"), children: [
        t.icon,
        t.label
      ] }, t.k)) }),
      mode === "MANUAL" ? /* @__PURE__ */ jsx(Card, { title: "Mark attendance", subtitle: `${students.length} students enrolled`, children: loading ? /* @__PURE__ */ jsxs("div", { className: "py-12 flex items-center justify-center gap-2 text-muted-foreground", children: [
        /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }),
        "Loading roster…"
      ] }) : /* @__PURE__ */ jsx(ManualMarkingTable, { students, lectureId: lecId }) }) : /* @__PURE__ */ jsx(QrGenerator, { lectureId: lecId, topic: `Lecture #${lecId}` })
    ] })
  ] });
}
export {
  AttendanceSession as component
};
