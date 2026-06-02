import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import { c as cn, N as Navbar } from "./Navbar-6CkWdqZA.js";
import { C as Card } from "./api-BYmOYr6M.js";
import { S as Select } from "./Input-SDsw45hQ.js";
import { u as useAuth } from "./router-pUeayUFD.js";
import { p as profService } from "./profService-D0eDg11o.js";
import { Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import "clsx";
import "tailwind-merge";
import "axios";
import "@tanstack/react-query";
const tone = {
  PRESENT: "text-[oklch(0.88_0.14_155)] bg-[oklch(0.72_0.18_155/0.15)] border-[oklch(0.72_0.18_155/0.4)]",
  ABSENT: "text-[oklch(0.85_0.15_25)] bg-[oklch(0.65_0.24_25/0.15)] border-[oklch(0.65_0.24_25/0.4)]",
  LATE: "text-[oklch(0.90_0.15_75)] bg-[oklch(0.80_0.17_75/0.15)] border-[oklch(0.80_0.17_75/0.4)]",
  LEAVE: "text-[oklch(0.85_0.15_270)] bg-[oklch(0.65_0.21_270/0.15)] border-[oklch(0.65_0.21_270/0.4)]"
};
function AttendanceReport({
  records,
  students
}) {
  const map = new Map(students.map((s) => [s.studentId, s]));
  return /* @__PURE__ */ jsxs("div", { className: "glass rounded-xl overflow-hidden", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-12 gap-3 px-4 py-3 text-[11px] uppercase tracking-wider text-muted-foreground border-b border-white/5", children: [
      /* @__PURE__ */ jsx("div", { className: "col-span-2", children: "Roll No" }),
      /* @__PURE__ */ jsx("div", { className: "col-span-4", children: "Student" }),
      /* @__PURE__ */ jsx("div", { className: "col-span-2", children: "Status" }),
      /* @__PURE__ */ jsx("div", { className: "col-span-4", children: "Remarks" })
    ] }),
    records.length === 0 && /* @__PURE__ */ jsx("div", { className: "px-4 py-10 text-center text-sm text-muted-foreground", children: "No attendance records." }),
    records.map((r) => {
      const s = map.get(r.studentId);
      return /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-12 gap-3 px-4 py-3 row-hover border-b border-white/5 items-center", children: [
        /* @__PURE__ */ jsx("div", { className: "col-span-2 font-mono text-xs", children: s?.rollNo || `#${r.studentId}` }),
        /* @__PURE__ */ jsx("div", { className: "col-span-4 text-sm", children: s ? `${s.firstName} ${s.lastName}` : "—" }),
        /* @__PURE__ */ jsx("div", { className: "col-span-2", children: /* @__PURE__ */ jsx("span", { className: cn("px-2 py-1 rounded-md text-[11px] font-semibold border", tone[r.attendanceStatus]), children: r.attendanceStatus }) }),
        /* @__PURE__ */ jsx("div", { className: "col-span-4 text-sm text-muted-foreground", children: r.remarks || "—" })
      ] }, `${r.studentId}-${r.lectureId}`);
    })
  ] });
}
function useAttendanceBadge(pct) {
  const value = typeof pct === "number" ? pct : 0;
  if (value >= 90)
    return { label: "Excellent", tone: "success", className: "badge-success-glow" };
  if (value >= 75)
    return {
      label: "Good",
      tone: "success",
      className: "bg-[oklch(0.72_0.16_195/0.15)] border border-[oklch(0.72_0.16_195/0.4)] text-[oklch(0.88_0.12_195)]"
    };
  if (value >= 60)
    return {
      label: "At Risk",
      tone: "warning",
      className: "bg-[oklch(0.80_0.17_75/0.15)] border border-[oklch(0.80_0.17_75/0.4)] text-[oklch(0.90_0.15_75)]"
    };
  return { label: "Critical", tone: "danger", className: "badge-danger-glow" };
}
const pctColor = (pct) => {
  if (pct >= 75) return "text-[oklch(0.85_0.15_155)]";
  if (pct >= 60) return "text-[oklch(0.88_0.15_75)]";
  return "text-[oklch(0.80_0.18_25)]";
};
function Reports() {
  const {
    role,
    professor
  } = useAuth();
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [lectures, setLectures] = useState([]);
  const [students, setStudents] = useState([]);
  const [records, setRecords] = useState([]);
  const [percentages, setPercentages] = useState({});
  const [subjectId, setSubjectId] = useState("");
  const [lectureId, setLectureId] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (role !== "PROFESSOR") {
      navigate({
        to: "/login"
      });
      return;
    }
    profService.listSubjects().then((s) => {
      setSubjects(s);
      if (s[0]?.subjectId) setSubjectId(String(s[0].subjectId));
    }).catch((e) => toast.error("Failed loading subjects", {
      description: e.message
    }));
  }, [role, navigate]);
  useEffect(() => {
    if (!subjectId) return;
    setLoading(true);
    profService.listLecturesBySubject(Number(subjectId)).then((lecs) => {
      setLectures(lecs);
      if (lecs[0]?.lectureId) {
        setLectureId(String(lecs[0].lectureId));
      } else {
        setLectureId("");
        setLectures([]);
        setStudents([]);
        setRecords([]);
      }
    }).catch((e) => toast.error("Failed loading lectures", {
      description: e.message
    })).finally(() => setLoading(false));
  }, [subjectId]);
  useEffect(() => {
    if (!lectureId || !professor) {
      setRecords([]);
      setStudents([]);
      return;
    }
    const activeLec = lectures.find((l) => String(l.lectureId) === lectureId);
    if (!activeLec) return;
    setLoading(true);
    Promise.all([profService.attendanceByLecture(Number(lectureId)).catch(() => []), profService.listClassStudents({
      year: activeLec.year,
      semester: activeLec.semester,
      division: activeLec.division,
      departmentId: activeLec.departmentId
    }).catch(() => [])]).then(([recs, st]) => {
      setRecords(recs);
      setStudents(st);
      Promise.all(st.map((s) => profService.studentPercentage(s.studentId).then((p) => [s.studentId, p]).catch(() => [s.studentId, 0]))).then((pairs) => setPercentages(Object.fromEntries(pairs)));
    }).finally(() => setLoading(false));
  }, [lectureId, lectures, professor]);
  const classPct = useMemo(() => {
    if (records.length === 0) return 0;
    const present = records.filter((r) => r.attendanceStatus === "PRESENT" || r.attendanceStatus === "LATE").length;
    return Math.round(present / records.length * 100);
  }, [records]);
  const flagged = useMemo(() => students.filter((s) => (percentages[s.studentId] ?? 0) < 75), [students, percentages]);
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen pb-16", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsxs("main", { className: "mx-auto w-[min(1280px,calc(100%-2rem))] mt-8 space-y-5", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "text-[11px] uppercase tracking-[0.2em] text-muted-foreground", children: "Insights" }),
        /* @__PURE__ */ jsx("h1", { className: "text-2xl sm:text-3xl font-semibold mt-1", children: "Attendance Reports" })
      ] }),
      /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs("div", { className: "grid sm:grid-cols-3 gap-4", children: [
        /* @__PURE__ */ jsxs(Select, { label: "Subject", value: subjectId, onChange: (e) => setSubjectId(e.target.value), children: [
          subjects.length === 0 && /* @__PURE__ */ jsx("option", { value: "", children: "No subjects" }),
          subjects.map((s) => /* @__PURE__ */ jsxs("option", { value: s.subjectId, children: [
            s.subjectCode,
            " · ",
            s.subjectName
          ] }, s.subjectId))
        ] }),
        /* @__PURE__ */ jsxs(Select, { label: "Lecture", value: lectureId, onChange: (e) => setLectureId(e.target.value), children: [
          lectures.length === 0 && /* @__PURE__ */ jsx("option", { value: "", children: "No lectures" }),
          lectures.map((l) => /* @__PURE__ */ jsxs("option", { value: l.lectureId, children: [
            l.lectureDate,
            " · ",
            l.topic
          ] }, l.lectureId))
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex items-end", children: /* @__PURE__ */ jsxs("div", { className: "glass rounded-xl px-4 py-3 w-full", children: [
          /* @__PURE__ */ jsx("div", { className: "text-[11px] uppercase tracking-wider text-muted-foreground", children: "Class Attendance" }),
          /* @__PURE__ */ jsxs("div", { className: cn("text-2xl font-bold mt-1 tabular-nums", pctColor(classPct)), children: [
            classPct,
            "%"
          ] })
        ] }) })
      ] }) }),
      /* @__PURE__ */ jsx(Card, { title: "Lecture roster", subtitle: lectureId ? `Lecture #${lectureId}` : "Select a lecture", children: loading ? /* @__PURE__ */ jsxs("div", { className: "py-10 flex items-center justify-center gap-2 text-muted-foreground", children: [
        /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }),
        "Loading…"
      ] }) : /* @__PURE__ */ jsx(AttendanceReport, { records, students }) }),
      /* @__PURE__ */ jsx(Card, { title: "Student percentages", subtitle: "Students below 75% are flagged", actions: flagged.length > 0 && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs px-3 py-1.5 rounded-full badge-danger-glow", children: [
        /* @__PURE__ */ jsx(AlertTriangle, { className: "h-3.5 w-3.5" }),
        " ",
        flagged.length,
        " at risk"
      ] }), children: students.length === 0 ? /* @__PURE__ */ jsx("div", { className: "py-10 text-center text-sm text-muted-foreground", children: "No students." }) : /* @__PURE__ */ jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-3", children: students.map((s) => /* @__PURE__ */ jsx(PctTile, { student: s, pct: percentages[s.studentId] ?? 0 }, s.studentId)) }) })
    ] })
  ] });
}
function PctTile({
  student,
  pct
}) {
  const badge = useAttendanceBadge(pct);
  const danger = pct < 75;
  return /* @__PURE__ */ jsxs("div", { className: cn("rounded-xl p-4 border", danger ? "badge-danger-glow" : "glass border-white/8"), children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "text-sm font-semibold", children: [
          student.firstName,
          " ",
          student.lastName
        ] }),
        /* @__PURE__ */ jsx("div", { className: "text-[11px] font-mono text-muted-foreground", children: student.rollNo })
      ] }),
      /* @__PURE__ */ jsx("span", { className: cn("px-2 py-1 rounded-md text-[10px] font-bold border", badge.className), children: badge.label })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: cn("mt-3 text-2xl font-bold tabular-nums", pctColor(pct)), children: [
      Math.round(pct),
      "%"
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-2 h-1.5 w-full rounded-full bg-white/5 overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "h-full rounded-full bg-gradient-to-r from-[oklch(0.72_0.16_195)] to-[oklch(0.65_0.21_270)]", style: {
      width: `${Math.min(100, Math.max(0, pct))}%`
    } }) })
  ] });
}
export {
  Reports as component
};
