import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import { B as Button, N as Navbar } from "./Navbar-CPIRaQSZ.js";
import { C as Card } from "./api-Rs_hdI2y.js";
import { u as useAuth } from "./router-BIxLXd9m.js";
import { p as profService } from "./profService-fwcpOvja.js";
import { Loader2, BookOpen, ChevronRight, X, CalendarPlus, Users, Search } from "lucide-react";
import { toast } from "sonner";
import { I as Input, S as Select } from "./Input-unOD1WgV.js";
import { t as toLocalDate, a as toLocalTime } from "./formatters-BydI8FSF.js";
import "clsx";
import "tailwind-merge";
import "axios";
import "@tanstack/react-query";
import "zod";
function CreateLectureForm({
  subjectId,
  defaultYear = 2,
  defaultSemester = 3,
  defaultDivision = "A"
}) {
  const { professor } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [f, setF] = useState({
    lectureDate: toLocalDate(/* @__PURE__ */ new Date()),
    startTime: "10:00",
    endTime: "11:00",
    topic: "",
    roomNo: "",
    year: defaultYear,
    semester: defaultSemester,
    division: defaultDivision
  });
  const update = (patch) => setF((p) => ({ ...p, ...patch }));
  const submit = async (e) => {
    e.preventDefault();
    if (!professor) return toast.error("Professor session missing");
    setSubmitting(true);
    try {
      const created = await profService.createLecture({
        lectureDate: toLocalDate(f.lectureDate),
        startTime: toLocalTime(f.startTime),
        endTime: toLocalTime(f.endTime),
        topic: f.topic,
        roomNo: f.roomNo,
        year: Number(f.year),
        semester: Number(f.semester),
        division: f.division,
        subjectId,
        professorId: professor.professorId,
        departmentId: professor.departmentId
      });
      toast.success("Lecture created", { description: f.topic });
      const newId = Number(created?.lectureId || subjectId);
      navigate({ to: "/attendance-session/$lectureId", params: { lectureId: String(newId) } });
    } catch (err) {
      toast.error("Could not create lecture", { description: err.message });
    } finally {
      setSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid sm:grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsx(Input, { type: "date", label: "Lecture date", value: f.lectureDate, onChange: (e) => update({ lectureDate: e.target.value }), required: true }),
      /* @__PURE__ */ jsx(Input, { type: "time", label: "Start time", value: f.startTime, onChange: (e) => update({ startTime: e.target.value }), required: true }),
      /* @__PURE__ */ jsx(Input, { type: "time", label: "End time", value: f.endTime, onChange: (e) => update({ endTime: e.target.value }), required: true })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid sm:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsx(Input, { label: "Topic", placeholder: "Binary Search Trees", value: f.topic, onChange: (e) => update({ topic: e.target.value }), required: true }),
      /* @__PURE__ */ jsx(Input, { label: "Room number", placeholder: "Seminar Hall B", value: f.roomNo, onChange: (e) => update({ roomNo: e.target.value }), required: true })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid sm:grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsx(Select, { label: "Year", value: f.year, onChange: (e) => update({ year: Number(e.target.value) }), children: [1, 2, 3, 4].map((y) => /* @__PURE__ */ jsx("option", { value: y, children: y }, y)) }),
      /* @__PURE__ */ jsx(Select, { label: "Semester", value: f.semester, onChange: (e) => update({ semester: Number(e.target.value) }), children: [1, 2, 3, 4, 5, 6, 7, 8].map((s) => /* @__PURE__ */ jsx("option", { value: s, children: s }, s)) }),
      /* @__PURE__ */ jsx(Select, { label: "Division", value: f.division, onChange: (e) => update({ division: e.target.value }), children: ["A", "B", "C"].map((d) => /* @__PURE__ */ jsx("option", { value: d, children: d }, d)) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsx(Button, { type: "submit", loading: submitting, children: "Schedule Lecture" }) })
  ] });
}
const MOCK_SUBJECTS = [{
  subjectId: 1,
  subjectName: "Data Structures & Algorithms",
  subjectCode: "CS-201",
  credits: 4,
  semester: 3,
  departmentId: 2
}, {
  subjectId: 2,
  subjectName: "Operating Systems",
  subjectCode: "CS-302",
  credits: 3,
  semester: 4,
  departmentId: 2
}, {
  subjectId: 3,
  subjectName: "Database Management Systems",
  subjectCode: "CS-303",
  credits: 4,
  semester: 4,
  departmentId: 2
}, {
  subjectId: 4,
  subjectName: "Computer Networks",
  subjectCode: "CS-401",
  credits: 3,
  semester: 5,
  departmentId: 2
}];
function SubjectsList() {
  const {
    role,
    professor
  } = useAuth();
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(null);
  const [panel, setPanel] = useState("none");
  useEffect(() => {
    if (role !== "PROFESSOR") {
      navigate({
        to: "/login"
      });
      return;
    }
    setLoading(true);
    profService.listSubjects().then((data) => setSubjects(data?.length ? data : MOCK_SUBJECTS)).catch(() => {
      setSubjects(MOCK_SUBJECTS);
      toast.message("Showing demo subjects", {
        description: "Backend unreachable."
      });
    }).finally(() => setLoading(false));
  }, [role, navigate]);
  const openSubject = (s) => {
    setActive(s);
    setPanel("none");
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen pb-16", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsxs("main", { className: "mx-auto w-[min(1280px,calc(100%-2rem))] mt-8", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-end justify-between mb-6", children: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "text-[11px] uppercase tracking-[0.2em] text-muted-foreground", children: "Faculty Dashboard" }),
        /* @__PURE__ */ jsxs("h1", { className: "text-2xl sm:text-3xl font-semibold mt-1", children: [
          "Welcome, Prof. ",
          professor?.firstName
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Pick a subject to schedule a lecture or view the class roster." })
      ] }) }),
      loading ? /* @__PURE__ */ jsxs("div", { className: "glass rounded-2xl p-12 flex items-center justify-center gap-2 text-muted-foreground", children: [
        /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }),
        " Loading subjects…"
      ] }) : /* @__PURE__ */ jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-4", children: subjects.map((s) => /* @__PURE__ */ jsxs("button", { onClick: () => openSubject(s), className: "glass rounded-2xl p-5 text-left btn-press group hover:border-[oklch(0.72_0.16_195/0.5)] hover:shadow-[0_0_30px_-10px_oklch(0.72_0.16_195/0.5)] transition", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
          /* @__PURE__ */ jsx("div", { className: "h-10 w-10 grid place-items-center rounded-xl bg-gradient-to-br from-[oklch(0.72_0.16_195/0.25)] to-[oklch(0.65_0.21_270/0.25)] border border-white/10 text-[oklch(0.78_0.15_190)]", children: /* @__PURE__ */ jsx(BookOpen, { className: "h-5 w-5" }) }),
          /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-4 text-base font-semibold tracking-tight", children: s.subjectName }),
        /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground mt-1 font-mono", children: s.subjectCode }),
        /* @__PURE__ */ jsxs("div", { className: "mt-3 flex items-center gap-2 text-[11px] text-muted-foreground", children: [
          /* @__PURE__ */ jsxs("span", { className: "px-2 py-0.5 rounded-md bg-white/5 border border-white/8", children: [
            "Sem ",
            s.semester
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "px-2 py-0.5 rounded-md bg-white/5 border border-white/8", children: [
            s.credits,
            " cr"
          ] })
        ] })
      ] }, s.subjectId)) }),
      active && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-3 sm:p-6", onClick: () => setActive(null), children: /* @__PURE__ */ jsxs("div", { className: "glass-strong rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto", onClick: (e) => e.stopPropagation(), children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-6 py-4 border-b border-white/8", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: active.subjectCode }),
            /* @__PURE__ */ jsx("h3", { className: "text-base font-semibold", children: active.subjectName })
          ] }),
          /* @__PURE__ */ jsx("button", { onClick: () => setActive(null), className: "h-8 w-8 grid place-items-center rounded-lg hover:bg-white/5", children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-6 space-y-5", children: [
          panel === "none" && /* @__PURE__ */ jsxs("div", { className: "grid sm:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsx(ActionTile, { icon: /* @__PURE__ */ jsx(CalendarPlus, { className: "h-5 w-5" }), title: "Create Lecture", desc: "Schedule a new session for this subject.", onClick: () => setPanel("lecture") }),
            /* @__PURE__ */ jsx(ActionTile, { icon: /* @__PURE__ */ jsx(Users, { className: "h-5 w-5" }), title: "Students Enrolled", desc: "View the class roster for this subject.", onClick: () => setPanel("roster") })
          ] }),
          panel === "lecture" && /* @__PURE__ */ jsx(Card, { title: "Create Lecture", subtitle: active.subjectName, actions: /* @__PURE__ */ jsx(Button, { size: "sm", variant: "ghost", onClick: () => setPanel("none"), children: "Back" }), children: /* @__PURE__ */ jsx(CreateLectureForm, { subjectId: active.subjectId, defaultSemester: active.semester }) }),
          panel === "roster" && /* @__PURE__ */ jsx(RosterPanel, { subject: active, onBack: () => setPanel("none") })
        ] })
      ] }) })
    ] })
  ] });
}
function ActionTile({
  icon,
  title,
  desc,
  onClick
}) {
  return /* @__PURE__ */ jsxs("button", { onClick, className: "text-left glass rounded-2xl p-5 btn-press hover:border-[oklch(0.72_0.16_195/0.5)] transition", children: [
    /* @__PURE__ */ jsx("div", { className: "h-10 w-10 grid place-items-center rounded-xl bg-white/5 border border-white/10 text-[oklch(0.78_0.15_190)]", children: icon }),
    /* @__PURE__ */ jsx("div", { className: "mt-3 font-semibold", children: title }),
    /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground mt-1", children: desc })
  ] });
}
function RosterPanel({
  subject,
  onBack
}) {
  const {
    professor
  } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [year, setYear] = useState(2);
  const [division, setDivision] = useState("A");
  useEffect(() => {
    if (!professor) return;
    setLoading(true);
    profService.listClassStudents({
      year,
      semester: subject.semester,
      division,
      departmentId: professor.departmentId
    }).then(setStudents).catch((e) => {
      setStudents([]);
      toast.error("Failed to load roster", {
        description: e.message
      });
    }).finally(() => setLoading(false));
  }, [professor, subject.semester, year, division]);
  const filtered = useMemo(() => {
    const s = q.toLowerCase().trim();
    if (!s) return students;
    return students.filter((x) => x.rollNo.toLowerCase().includes(s) || `${x.firstName} ${x.lastName}`.toLowerCase().includes(s));
  }, [students, q]);
  return /* @__PURE__ */ jsxs(Card, { title: "Students Enrolled", subtitle: `${subject.subjectName} · Sem ${subject.semester}`, actions: /* @__PURE__ */ jsx(Button, { size: "sm", variant: "ghost", onClick: onBack, children: "Back" }), children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2 mb-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
        /* @__PURE__ */ jsx("input", { value: q, onChange: (e) => setQ(e.target.value), placeholder: "Search…", className: "glass-input rounded-lg h-9 pl-9 pr-3 text-sm w-56" })
      ] }),
      /* @__PURE__ */ jsx("select", { value: year, onChange: (e) => setYear(Number(e.target.value)), className: "glass-input rounded-lg h-9 px-3 text-sm bg-[oklch(0.22_0.01_280)]", children: [1, 2, 3, 4].map((y) => /* @__PURE__ */ jsxs("option", { value: y, children: [
        "Year ",
        y
      ] }, y)) }),
      /* @__PURE__ */ jsx("select", { value: division, onChange: (e) => setDivision(e.target.value), className: "glass-input rounded-lg h-9 px-3 text-sm bg-[oklch(0.22_0.01_280)]", children: ["A", "B", "C"].map((d) => /* @__PURE__ */ jsxs("option", { value: d, children: [
        "Div ",
        d
      ] }, d)) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "glass rounded-xl overflow-hidden", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-12 gap-3 px-4 py-3 text-[11px] uppercase tracking-wider text-muted-foreground border-b border-white/5", children: [
        /* @__PURE__ */ jsx("div", { className: "col-span-3", children: "Roll No" }),
        /* @__PURE__ */ jsx("div", { className: "col-span-5", children: "Name" }),
        /* @__PURE__ */ jsx("div", { className: "col-span-4", children: "Email" })
      ] }),
      loading ? /* @__PURE__ */ jsxs("div", { className: "py-10 flex items-center justify-center gap-2 text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }),
        "Loading…"
      ] }) : filtered.length === 0 ? /* @__PURE__ */ jsx("div", { className: "py-10 text-center text-sm text-muted-foreground", children: "No students." }) : /* @__PURE__ */ jsx("div", { className: "max-h-[360px] overflow-y-auto", children: filtered.map((s) => /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-12 gap-3 px-4 py-2.5 row-hover border-b border-white/5 items-center text-sm", children: [
        /* @__PURE__ */ jsx("div", { className: "col-span-3 font-mono text-xs", children: s.rollNo }),
        /* @__PURE__ */ jsxs("div", { className: "col-span-5", children: [
          s.firstName,
          " ",
          s.lastName
        ] }),
        /* @__PURE__ */ jsx("div", { className: "col-span-4 text-muted-foreground", children: s.email })
      ] }, s.studentId)) })
    ] })
  ] });
}
export {
  SubjectsList as component
};
