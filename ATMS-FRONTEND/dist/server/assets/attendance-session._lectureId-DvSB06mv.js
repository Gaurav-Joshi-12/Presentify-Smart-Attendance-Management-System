import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import { c as cn, B as Button, N as Navbar } from "./Navbar-CPIRaQSZ.js";
import { C as Card } from "./api-Rs_hdI2y.js";
import { a as Route, u as useAuth } from "./router-BIxLXd9m.js";
import { p as profService } from "./profService-fwcpOvja.js";
import { Search, QrCode, CheckCircle2, ClipboardCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Q as QrGenerator } from "./QrGenerator-LPlnRksu.js";
import "clsx";
import "tailwind-merge";
import "axios";
import "@tanstack/react-query";
import "zod";
import "qrcode.react";
import "./formatters-BydI8FSF.js";
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
  existingAttendance = [],
  onSubmitted
}) {
  const [rows, setRows] = useState(() => {
    const initialRows = {};
    const attMap = new Map((existingAttendance || []).map((a) => [a.studentId, a]));
    students.forEach((s) => {
      const match = attMap.get(s.studentId);
      if (match) {
        initialRows[s.studentId] = {
          status: match.attendanceStatus,
          remarks: match.remarks || ""
        };
      } else {
        initialRows[s.studentId] = {
          status: "PRESENT",
          remarks: ""
        };
      }
    });
    return initialRows;
  });
  const [query, setQuery] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  useEffect(() => {
    if (submitted) return;
    setRows((prevRows) => {
      const updated = { ...prevRows };
      let changed = false;
      const attMap = new Map((existingAttendance || []).map((a) => [a.studentId, a]));
      students.forEach((s) => {
        const match = attMap.get(s.studentId);
        if (match) {
          const currentVal = prevRows[s.studentId];
          if (!currentVal || match.remarks?.startsWith("Attendance Marked with QR") && !currentVal.remarks?.startsWith("Attendance Marked with QR")) {
            updated[s.studentId] = {
              status: match.attendanceStatus,
              remarks: match.remarks || ""
            };
            changed = true;
          }
        }
      });
      return changed ? updated : prevRows;
    });
  }, [existingAttendance, students, submitted]);
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return students;
    return students.filter(
      (s) => s.rollNo.toLowerCase().includes(q) || `${s.firstName} ${s.lastName}`.toLowerCase().includes(q)
    );
  }, [students, query]);
  const counts = useMemo(() => {
    const c = { PRESENT: 0, ABSENT: 0, LATE: 0, LEAVE: 0 };
    Object.values(rows || {}).forEach((r) => {
      if (r?.status && c[r.status] !== void 0) {
        c[r.status]++;
      }
    });
    return c;
  }, [rows]);
  const update = (id, patch) => {
    if (submitted) return;
    setRows((p) => {
      const current = p?.[id] || { status: "PRESENT", remarks: "" };
      const newPatch = { ...patch };
      if (patch.status && patch.status !== current.status) {
        if (current.remarks?.startsWith("Attendance Marked with QR")) {
          newPatch.remarks = "";
        }
      }
      return { ...p, [id]: { ...current, ...newPatch } };
    });
  };
  const markAll = (s) => {
    if (submitted) return;
    setRows(
      (p) => Object.fromEntries(
        Object.entries(p || {}).map(([k, v]) => {
          const newRemarks = v.remarks?.startsWith("Attendance Marked with QR") && v.status !== s ? "" : v.remarks;
          return [k, { ...v, status: s, remarks: newRemarks }];
        })
      )
    );
  };
  const submit = async () => {
    if (submitted) return;
    setSubmitting(true);
    try {
      const promises = students.map((s) => {
        const dbMatch = (existingAttendance || []).find((a) => a.studentId === s.studentId);
        const uiRow = rows?.[s.studentId];
        const uiStatus = uiRow?.status || "PRESENT";
        const uiRemarks = uiRow?.remarks || "";
        if (dbMatch) {
          const wasQr = dbMatch.remarks?.startsWith("Attendance Marked with QR");
          const uiIsStillQr = uiRemarks.startsWith("Attendance Marked with QR");
          if (wasQr && dbMatch.attendanceStatus === uiStatus && uiIsStillQr) {
            return Promise.resolve(null);
          }
        }
        return profService.markAttendance({
          attendanceStatus: uiStatus,
          remarks: uiRemarks,
          lectureId,
          studentId: s.studentId
        });
      });
      await Promise.all(promises);
      toast.success("Attendance submitted", { description: `${students.length} students recorded` });
      setSubmitted(true);
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
        /* @__PURE__ */ jsx(Button, { size: "sm", variant: "secondary", onClick: () => markAll("PRESENT"), disabled: submitted, children: "All Present" }),
        /* @__PURE__ */ jsx(Button, { size: "sm", variant: "ghost", onClick: () => markAll("ABSENT"), disabled: submitted, children: "All Absent" })
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
          const isQrCheckedIn = row?.remarks?.startsWith("Attendance Marked with QR");
          return /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-12 gap-3 px-4 py-3 row-hover border-b border-white/5 items-center", children: [
            /* @__PURE__ */ jsx("div", { className: "col-span-2 font-mono text-xs text-foreground/80", children: s.rollNo }),
            /* @__PURE__ */ jsxs("div", { className: "col-span-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "text-sm font-medium flex items-center gap-1.5 flex-wrap", children: [
                /* @__PURE__ */ jsxs("span", { children: [
                  s.firstName,
                  " ",
                  s.lastName
                ] }),
                isQrCheckedIn && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 text-[9px] font-bold bg-[oklch(0.72_0.16_195/0.15)] border border-[oklch(0.72_0.16_195/0.4)] text-[oklch(0.78_0.15_190)] px-1.5 py-0.5 rounded-full select-none", children: [
                  /* @__PURE__ */ jsx(QrCode, { className: "h-2.5 w-2.5" }),
                  "QR Scan"
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "text-[11px] text-muted-foreground", children: s.email })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "col-span-4 flex items-center gap-1.5 flex-wrap", children: STATUSES.map((st) => /* @__PURE__ */ jsx("button", { type: "button", onClick: () => update(s.studentId, { status: st }), className: pillFor(st, row.status === st), disabled: submitted, children: st }, st)) }),
            /* @__PURE__ */ jsx("div", { className: "col-span-3", children: /* @__PURE__ */ jsx(
              "input",
              {
                value: row.remarks,
                onChange: (e) => update(s.studentId, { remarks: e.target.value }),
                placeholder: "Reason / note",
                className: "glass-input rounded-lg h-9 px-3 text-sm w-full",
                disabled: submitted
              }
            ) })
          ] }, s.studentId);
        })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsx(Button, { onClick: submit, loading: submitting, disabled: submitted, icon: /* @__PURE__ */ jsx(CheckCircle2, { className: "h-4 w-4" }), children: submitted ? "Submitted Successfully" : `Submit Attendance (${students.length})` }) })
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
  const [existingAttendance, setExistingAttendance] = useState([]);
  const [lecture, setLecture] = useState(null);
  const [formattedTitle, setFormattedTitle] = useState("");
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
    profService.getLectureById(lecId).then((lectureData) => {
      setLecture(lectureData);
      return Promise.all([profService.listClassStudents({
        year: lectureData.year,
        semester: lectureData.semester,
        division: lectureData.division,
        departmentId: lectureData.departmentId
      }).catch(() => []), profService.attendanceByLecture(lecId).catch(() => [])]);
    }).then(([st, att]) => {
      setStudents(st.length ? st : MOCK_STUDENTS);
      setExistingAttendance(att);
    }).catch(() => {
      setStudents(MOCK_STUDENTS);
      toast.message("Showing demo roster");
    }).finally(() => setLoading(false));
  }, [role, professor, navigate, lecId]);
  useEffect(() => {
    if (!professor || !lecId) return;
    const interval = setInterval(() => {
      profService.attendanceByLecture(lecId).then((att) => {
        setExistingAttendance((prev) => {
          if (JSON.stringify(prev) === JSON.stringify(att)) return prev;
          return att;
        });
      }).catch((e) => console.error("Error polling live attendance:", e));
    }, 3e3);
    return () => clearInterval(interval);
  }, [lecId, professor]);
  useEffect(() => {
    if (!lecture) return;
    Promise.all([profService.listLecturesBySubject(lecture.subjectId).catch(() => []), profService.listSubjects().catch(() => [])]).then(([lectures, subjects]) => {
      const sorted = [...lectures].sort((a, b) => {
        return (/* @__PURE__ */ new Date(`${a.lectureDate}T${a.startTime}`)).getTime() - (/* @__PURE__ */ new Date(`${b.lectureDate}T${b.startTime}`)).getTime();
      });
      const idx = sorted.findIndex((l) => l.lectureId === lecture.lectureId);
      const lecNo = idx >= 0 ? idx + 1 : 1;
      const subj = subjects.find((s) => s.subjectId === lecture.subjectId);
      const subjName = subj ? subj.subjectName : "Unknown Subject";
      setFormattedTitle(`Lec ${lecNo} : ${subjName} : ${lecture.topic}`);
    });
  }, [lecture]);
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen pb-16", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsxs("main", { className: "mx-auto w-[min(1280px,calc(100%-2rem))] mt-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "text-[11px] uppercase tracking-[0.2em] text-muted-foreground", children: "Live Attendance" }),
          /* @__PURE__ */ jsx("h1", { className: "text-2xl sm:text-3xl font-semibold mt-1", children: formattedTitle || lecture?.topic || `Lecture #${lecId}` }),
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
      ] }) : /* @__PURE__ */ jsx(ManualMarkingTable, { students, lectureId: lecId, existingAttendance }) }) : /* @__PURE__ */ jsx(QrGenerator, { lectureId: lecId, topic: formattedTitle || lecture?.topic || `Lecture #${lecId}`, students, existingAttendance })
    ] })
  ] });
}
export {
  AttendanceSession as component
};
