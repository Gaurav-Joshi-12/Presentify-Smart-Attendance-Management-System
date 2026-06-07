import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { u as useAuth } from "./router-BIxLXd9m.js";
import { N as Navbar, B as Button } from "./Navbar-CPIRaQSZ.js";
import { a as api, C as Card } from "./api-Rs_hdI2y.js";
import { p as profService } from "./profService-fwcpOvja.js";
import { QrCode, Loader2, Percent, AlertTriangle, CheckCircle, BookOpen, XCircle } from "lucide-react";
import { toast } from "sonner";
import "@tanstack/react-query";
import "zod";
import "clsx";
import "tailwind-merge";
import "axios";
const studentService = {
  getStudentByEmail: (email) => api.get(`/api/student/email/${email}`).then((r) => r.data),
  listStudentSubjects: (studentId) => api.get(`/api/student/${studentId}/subjects`).then((r) => r.data),
  listStudentAttendance: (studentId) => api.get(`/api/student/${studentId}/attendance`).then((r) => r.data)
};
function StudentDashboard() {
  const {
    role,
    student
  } = useAuth();
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (role !== "STUDENT") {
      navigate({
        to: "/login"
      });
    }
  }, [role, navigate]);
  useEffect(() => {
    if (!student?.studentId) return;
    setLoading(true);
    Promise.all([studentService.listStudentSubjects(student.studentId), studentService.listStudentAttendance(student.studentId), profService.listAllLectures().catch(() => [])]).then(([subjs, atts, lecs]) => {
      setSubjects(subjs);
      setAttendance(atts);
      setLectures(lecs);
    }).catch((err) => {
      console.error("Failed to load dashboard data", err);
      toast.error("Error loading dashboard metrics");
    }).finally(() => setLoading(false));
  }, [student]);
  useMemo(() => {
    return new Map(lectures.map((l) => [l.lectureId, l]));
  }, [lectures]);
  const subjectStats = useMemo(() => {
    return subjects.map((sub) => {
      const subLectures = lectures.filter((l) => l.subjectId === sub.subjectId);
      const subLecIds = new Set(subLectures.map((l) => l.lectureId));
      const records = attendance.filter((r) => subLecIds.has(r.lectureId));
      const total = records.length;
      const present = records.filter((r) => r.attendanceStatus === "PRESENT" || r.attendanceStatus === "LATE").length;
      const percentage = total > 0 ? Math.round(present / total * 100) : 100;
      return {
        ...sub,
        total,
        present,
        absent: total - present,
        percentage
      };
    });
  }, [subjects, attendance, lectures]);
  const overallStats = useMemo(() => {
    const total = attendance.length;
    const present = attendance.filter((r) => r.attendanceStatus === "PRESENT" || r.attendanceStatus === "LATE").length;
    const percentage = total > 0 ? Math.round(present / total * 100) : 100;
    return {
      total,
      present,
      absent: total - present,
      percentage
    };
  }, [attendance]);
  if (role !== "STUDENT" || !student) return null;
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen pb-16", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsxs("main", { className: "mx-auto w-[min(1280px,calc(100%-2rem))] mt-8 space-y-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4 glass rounded-2xl p-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx("div", { className: "text-[11px] uppercase tracking-[0.2em] text-muted-foreground", children: "Student Portal" }),
          /* @__PURE__ */ jsxs("h1", { className: "text-2xl sm:text-3xl font-bold tracking-tight text-foreground", children: [
            "Welcome, ",
            student.firstName,
            " ",
            student.lastName
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground font-mono", children: [
            /* @__PURE__ */ jsxs("span", { children: [
              "Roll No: ",
              student.rollNo
            ] }),
            /* @__PURE__ */ jsx("span", { children: "•" }),
            /* @__PURE__ */ jsxs("span", { children: [
              "Div: ",
              student.division
            ] }),
            /* @__PURE__ */ jsx("span", { children: "•" }),
            /* @__PURE__ */ jsxs("span", { children: [
              "Sem: ",
              student.semester
            ] }),
            /* @__PURE__ */ jsx("span", { children: "•" }),
            /* @__PURE__ */ jsxs("span", { children: [
              "Year: ",
              student.year
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx(Button, { onClick: () => navigate({
          to: "/student-scan"
        }), variant: "primary", size: "lg", icon: /* @__PURE__ */ jsx(QrCode, { className: "h-5 w-5" }), children: "Scan Session QR Code" })
      ] }),
      loading ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-20 gap-4", children: [
        /* @__PURE__ */ jsx(Loader2, { className: "h-10 w-10 text-primary animate-spin" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Calculating attendance matrices..." })
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { className: "grid sm:grid-cols-2 lg:grid-cols-4 gap-5", children: [
          /* @__PURE__ */ jsxs(Card, { padded: true, className: "relative overflow-hidden group", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: "Attendance Percentage" }),
                /* @__PURE__ */ jsxs("h3", { className: "text-3xl font-bold tracking-tight", children: [
                  overallStats.percentage,
                  "%"
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: `p-2.5 rounded-xl border border-solid ${overallStats.percentage >= 75 ? "badge-success-glow" : "badge-danger-glow"}`, children: /* @__PURE__ */ jsx(Percent, { className: "h-5 w-5" }) })
            ] }),
            overallStats.percentage < 75 ? /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-center gap-1.5 text-xs text-[oklch(0.65_0.24_25)] font-medium", children: [
              /* @__PURE__ */ jsx(AlertTriangle, { className: "h-3.5 w-3.5" }),
              "Below attendance threshold (75%)"
            ] }) : /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-center gap-1.5 text-xs text-[oklch(0.72_0.18_155)] font-medium", children: [
              /* @__PURE__ */ jsx(CheckCircle, { className: "h-3.5 w-3.5" }),
              "Attendance status safe"
            ] })
          ] }),
          /* @__PURE__ */ jsxs(Card, { padded: true, children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: "Total Sessions Held" }),
                /* @__PURE__ */ jsx("h3", { className: "text-3xl font-bold tracking-tight", children: overallStats.total })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "p-2.5 rounded-xl border border-white/10 bg-white/5", children: /* @__PURE__ */ jsx(BookOpen, { className: "h-5 w-5 text-muted-foreground" }) })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "mt-4 text-xs text-muted-foreground", children: "Across all registered subjects" })
          ] }),
          /* @__PURE__ */ jsxs(Card, { padded: true, children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: "Lectures Attended" }),
                /* @__PURE__ */ jsx("h3", { className: "text-3xl font-bold tracking-tight text-[oklch(0.72_0.18_155)]", children: overallStats.present })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "p-2.5 rounded-xl border border-[oklch(0.72_0.18_155/0.2)] bg-[oklch(0.72_0.18_155/0.05)] text-[oklch(0.72_0.18_155)]", children: /* @__PURE__ */ jsx(CheckCircle, { className: "h-5 w-5" }) })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "mt-4 text-xs text-muted-foreground", children: "Present or Late check-ins" })
          ] }),
          /* @__PURE__ */ jsxs(Card, { padded: true, children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: "Lectures Missed" }),
                /* @__PURE__ */ jsx("h3", { className: "text-3xl font-bold tracking-tight text-[oklch(0.65_0.24_25)]", children: overallStats.absent })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "p-2.5 rounded-xl border border-[oklch(0.65_0.24_25/0.2)] bg-[oklch(0.65_0.24_25/0.05)] text-[oklch(0.65_0.24_25)]", children: /* @__PURE__ */ jsx(XCircle, { className: "h-5 w-5" }) })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "mt-4 text-xs text-muted-foreground", children: "Absent or non-submitted logs" })
          ] })
        ] }),
        /* @__PURE__ */ jsx(Card, { title: "Subject Attendance Breakdown", subtitle: "Track your attendance progress for individual subjects", children: /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-6 mt-6", children: [
          subjectStats.map((sub) => /* @__PURE__ */ jsxs("div", { className: "glass rounded-xl p-5 border border-white/5 hover:border-white/10 transition flex flex-col justify-between space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("div", { className: "font-mono text-[10px] text-muted-foreground tracking-wider uppercase", children: [
                  sub.subjectCode,
                  " · ",
                  sub.credits,
                  " Credits"
                ] }),
                /* @__PURE__ */ jsx("h4", { className: "text-base font-semibold text-foreground mt-0.5", children: sub.subjectName })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: `px-2.5 py-1 text-xs font-bold rounded-md border ${sub.percentage >= 75 ? "badge-success-glow" : "badge-danger-glow"}`, children: [
                sub.percentage,
                "%"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-xs text-muted-foreground", children: [
                /* @__PURE__ */ jsxs("span", { children: [
                  "Sessions Attended: ",
                  sub.present,
                  " / ",
                  sub.total
                ] }),
                /* @__PURE__ */ jsx("span", { children: "Min Requirement: 75%" })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "h-2 w-full rounded-full bg-white/5 overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: `h-full rounded-full transition-all duration-500 ${sub.percentage >= 75 ? "bg-gradient-to-r from-[oklch(0.72_0.18_155)] to-[oklch(0.78_0.15_190)]" : "bg-gradient-to-r from-[oklch(0.65_0.24_25)] to-[oklch(0.80_0.17_75)]"}`, style: {
                width: `${Math.min(sub.percentage, 100)}%`
              } }) })
            ] })
          ] }, sub.subjectId)),
          subjectStats.length === 0 && /* @__PURE__ */ jsx("div", { className: "col-span-2 text-center py-12 text-sm text-muted-foreground", children: "No registered subjects found for your profile." })
        ] }) })
      ] })
    ] })
  ] });
}
export {
  StudentDashboard as component
};
