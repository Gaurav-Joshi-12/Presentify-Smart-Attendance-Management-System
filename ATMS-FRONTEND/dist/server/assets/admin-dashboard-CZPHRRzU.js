import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import { N as Navbar, c as cn, B as Button } from "./Navbar-6CkWdqZA.js";
import { C as Card } from "./api-BYmOYr6M.js";
import { I as Input, S as Select } from "./Input-SDsw45hQ.js";
import { Building2, Layers, UserCog, Users, BookOpen, Plus, Loader2, X } from "lucide-react";
import { u as useAuth } from "./router-pUeayUFD.js";
import { a as adminService } from "./adminService-CzMVcGUR.js";
import { toast } from "sonner";
import { t as toLocalDate } from "./formatters-BydI8FSF.js";
import "clsx";
import "tailwind-merge";
import "axios";
import "@tanstack/react-query";
const TABS = [{
  key: "colleges",
  label: "Colleges",
  icon: /* @__PURE__ */ jsx(Building2, { className: "h-4 w-4" }),
  hint: "Institutions"
}, {
  key: "departments",
  label: "Departments",
  icon: /* @__PURE__ */ jsx(Layers, { className: "h-4 w-4" }),
  hint: "Academic units"
}, {
  key: "professors",
  label: "Professors",
  icon: /* @__PURE__ */ jsx(UserCog, { className: "h-4 w-4" }),
  hint: "Faculty roster"
}, {
  key: "students",
  label: "Students",
  icon: /* @__PURE__ */ jsx(Users, { className: "h-4 w-4" }),
  hint: "Enrolled learners"
}, {
  key: "subjects",
  label: "Subjects",
  icon: /* @__PURE__ */ jsx(BookOpen, { className: "h-4 w-4" }),
  hint: "Course catalog"
}];
function AdminDashboard() {
  const {
    role
  } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("colleges");
  useEffect(() => {
    if (role !== "ADMIN") navigate({
      to: "/login"
    });
  }, [role, navigate]);
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen pb-16", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsxs("main", { className: "mx-auto w-[min(1280px,calc(100%-2rem))] mt-8 grid lg:grid-cols-[260px_1fr] gap-5", children: [
      /* @__PURE__ */ jsxs("aside", { className: "glass rounded-2xl p-3 h-fit lg:sticky lg:top-24", children: [
        /* @__PURE__ */ jsxs("div", { className: "px-3 py-3", children: [
          /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-[0.2em] text-muted-foreground", children: "Control Hub" }),
          /* @__PURE__ */ jsx("div", { className: "text-sm font-semibold mt-1", children: "Data Management" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "space-y-1", children: TABS.map((t) => /* @__PURE__ */ jsxs("button", { onClick: () => setTab(t.key), className: cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition btn-press text-left", tab === t.key ? "bg-gradient-to-r from-[oklch(0.72_0.16_195/0.18)] to-[oklch(0.65_0.21_270/0.18)] border border-white/10 text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-white/3"), children: [
          /* @__PURE__ */ jsx("span", { className: cn("h-7 w-7 grid place-items-center rounded-lg", tab === t.key ? "bg-white/8 text-[oklch(0.78_0.15_190)]" : "bg-white/3"), children: t.icon }),
          /* @__PURE__ */ jsxs("span", { className: "flex-1", children: [
            /* @__PURE__ */ jsx("div", { className: "font-medium", children: t.label }),
            /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: t.hint })
          ] })
        ] }, t.key)) })
      ] }),
      /* @__PURE__ */ jsxs("section", { children: [
        tab === "colleges" && /* @__PURE__ */ jsx(CollegesTab, {}),
        tab === "departments" && /* @__PURE__ */ jsx(DepartmentsTab, {}),
        tab === "professors" && /* @__PURE__ */ jsx(ProfessorsTab, {}),
        tab === "students" && /* @__PURE__ */ jsx(StudentsTab, {}),
        tab === "subjects" && /* @__PURE__ */ jsx(SubjectsTab, {})
      ] })
    ] })
  ] });
}
function Modal({
  open,
  onClose,
  title,
  children
}) {
  if (!open) return null;
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm", onClick: onClose, children: /* @__PURE__ */ jsxs("div", { className: "glass-strong rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto", onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-6 py-4 border-b border-white/8", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-base font-semibold", children: title }),
      /* @__PURE__ */ jsx("button", { onClick: onClose, className: "h-8 w-8 grid place-items-center rounded-lg hover:bg-white/5", children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "p-6", children })
  ] }) });
}
function DataGrid({
  rows,
  columns,
  loading,
  empty
}) {
  return /* @__PURE__ */ jsxs("div", { className: "glass rounded-xl overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "grid gap-3 px-4 py-3 text-[11px] uppercase tracking-wider text-muted-foreground border-b border-white/5", style: {
      gridTemplateColumns: columns.map((c) => c.w || "1fr").join(" ")
    }, children: columns.map((c) => /* @__PURE__ */ jsx("div", { children: c.label }, String(c.key))) }),
    loading ? /* @__PURE__ */ jsxs("div", { className: "px-4 py-12 flex items-center justify-center gap-2 text-muted-foreground text-sm", children: [
      /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }),
      " Loading…"
    ] }) : rows.length === 0 ? /* @__PURE__ */ jsx("div", { className: "px-4 py-12 text-center text-sm text-muted-foreground", children: empty }) : /* @__PURE__ */ jsx("div", { className: "max-h-[560px] overflow-y-auto", children: rows.map((r, i) => /* @__PURE__ */ jsx("div", { className: "grid gap-3 px-4 py-3 row-hover border-b border-white/5 items-center text-sm", style: {
      gridTemplateColumns: columns.map((c) => c.w || "1fr").join(" ")
    }, children: columns.map((c) => /* @__PURE__ */ jsx("div", { children: c.render ? c.render(r) : String(r[c.key] ?? "—") }, String(c.key))) }, i)) })
  ] });
}
function SectionShell({
  title,
  subtitle,
  action,
  children
}) {
  return /* @__PURE__ */ jsxs(Card, { variant: "strong", padded: false, children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-4 px-6 pt-6 pb-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold tracking-tight", children: title }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mt-1", children: subtitle })
      ] }),
      action
    ] }),
    /* @__PURE__ */ jsx("div", { className: "p-6 pt-2", children })
  ] });
}
function CollegesTab() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const load = () => {
    setLoading(true);
    adminService.listColleges().then(setRows).catch((e) => toast.error("Failed to load colleges", {
      description: e.message
    })).finally(() => setLoading(false));
  };
  useEffect(() => {
    load();
  }, []);
  return /* @__PURE__ */ jsxs(SectionShell, { title: "Manage Colleges", subtitle: "Registered institutions in the system", action: /* @__PURE__ */ jsx(Button, { icon: /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }), onClick: () => setOpen(true), children: "Add College" }), children: [
    /* @__PURE__ */ jsx(DataGrid, { loading, rows, empty: "No colleges yet.", columns: [{
      key: "collegeCode",
      label: "Code",
      w: "100px"
    }, {
      key: "collegeName",
      label: "Name",
      w: "1.5fr"
    }, {
      key: "city",
      label: "City",
      w: "120px"
    }, {
      key: "state",
      label: "State",
      w: "100px"
    }, {
      key: "email",
      label: "Email",
      w: "1.2fr"
    }, {
      key: "phoneNo",
      label: "Phone",
      w: "140px"
    }] }),
    /* @__PURE__ */ jsx(Modal, { open, onClose: () => setOpen(false), title: "Add College", children: /* @__PURE__ */ jsx(CollegeForm, { onDone: () => {
      setOpen(false);
      load();
    } }) })
  ] });
}
function CollegeForm({
  onDone
}) {
  const [f, setF] = useState({
    collegeName: "",
    collegeCode: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    email: "",
    phoneNo: ""
  });
  const [busy, setBusy] = useState(false);
  const u = (p) => setF((x) => ({
    ...x,
    ...p
  }));
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await adminService.createCollege(f);
      toast.success("College added");
      onDone();
    } catch (err) {
      toast.error("Failed", {
        description: err.message
      });
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "grid sm:grid-cols-2 gap-4", children: [
    /* @__PURE__ */ jsx(Input, { label: "College Name", value: f.collegeName, onChange: (e) => u({
      collegeName: e.target.value
    }), required: true }),
    /* @__PURE__ */ jsx(Input, { label: "Code", placeholder: "MIT-COE", value: f.collegeCode, onChange: (e) => u({
      collegeCode: e.target.value
    }), required: true }),
    /* @__PURE__ */ jsx(Input, { label: "Address", className: "sm:col-span-2", value: f.address, onChange: (e) => u({
      address: e.target.value
    }), required: true }),
    /* @__PURE__ */ jsx(Input, { label: "City", value: f.city, onChange: (e) => u({
      city: e.target.value
    }), required: true }),
    /* @__PURE__ */ jsx(Input, { label: "State", value: f.state, onChange: (e) => u({
      state: e.target.value
    }), required: true }),
    /* @__PURE__ */ jsx(Input, { label: "Pincode", value: f.pincode, onChange: (e) => u({
      pincode: e.target.value
    }), required: true }),
    /* @__PURE__ */ jsx(Input, { label: "Email", type: "email", value: f.email, onChange: (e) => u({
      email: e.target.value
    }), required: true }),
    /* @__PURE__ */ jsx(Input, { label: "Phone", value: f.phoneNo, onChange: (e) => u({
      phoneNo: e.target.value
    }), required: true }),
    /* @__PURE__ */ jsx("div", { className: "sm:col-span-2 flex justify-end", children: /* @__PURE__ */ jsx(Button, { type: "submit", loading: busy, children: "Save College" }) })
  ] });
}
function DepartmentsTab() {
  const [rows, setRows] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const load = () => {
    setLoading(true);
    Promise.all([adminService.listDepartments(), adminService.listColleges()]).then(([d, c]) => {
      setRows(d);
      setColleges(c);
    }).catch((e) => toast.error("Load failed", {
      description: e.message
    })).finally(() => setLoading(false));
  };
  useEffect(() => {
    load();
  }, []);
  const collegeName = (id) => colleges.find((c) => c.collegeId === id)?.collegeName || `#${id}`;
  return /* @__PURE__ */ jsxs(SectionShell, { title: "Manage Departments", subtitle: "Academic units across colleges", action: /* @__PURE__ */ jsx(Button, { icon: /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }), onClick: () => setOpen(true), children: "Add Department" }), children: [
    /* @__PURE__ */ jsx(DataGrid, { loading, rows, empty: "No departments yet.", columns: [{
      key: "departmentCode",
      label: "Code",
      w: "100px"
    }, {
      key: "departmentName",
      label: "Name",
      w: "1.5fr"
    }, {
      key: "collegeId",
      label: "College",
      w: "1fr",
      render: (r) => collegeName(Number(r.collegeId))
    }] }),
    /* @__PURE__ */ jsx(Modal, { open, onClose: () => setOpen(false), title: "Add Department", children: /* @__PURE__ */ jsx(DepartmentForm, { colleges, onDone: () => {
      setOpen(false);
      load();
    } }) })
  ] });
}
function DepartmentForm({
  colleges,
  onDone
}) {
  const [f, setF] = useState({
    departmentName: "",
    departmentCode: "",
    collegeId: colleges[0]?.collegeId || 0
  });
  const [busy, setBusy] = useState(false);
  const u = (p) => setF((x) => ({
    ...x,
    ...p
  }));
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await adminService.createDepartment(f);
      toast.success("Department added");
      onDone();
    } catch (err) {
      toast.error("Failed", {
        description: err.message
      });
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "grid sm:grid-cols-2 gap-4", children: [
    /* @__PURE__ */ jsx(Input, { label: "Department Name", placeholder: "Information Technology", value: f.departmentName, onChange: (e) => u({
      departmentName: e.target.value
    }), required: true }),
    /* @__PURE__ */ jsx(Input, { label: "Code", placeholder: "IT", value: f.departmentCode, onChange: (e) => u({
      departmentCode: e.target.value
    }), required: true }),
    /* @__PURE__ */ jsx(Select, { label: "College", className: "sm:col-span-2", value: f.collegeId, onChange: (e) => u({
      collegeId: Number(e.target.value)
    }), required: true, children: colleges.map((c) => /* @__PURE__ */ jsx("option", { value: c.collegeId, children: c.collegeName }, c.collegeId)) }),
    /* @__PURE__ */ jsx("div", { className: "sm:col-span-2 flex justify-end", children: /* @__PURE__ */ jsx(Button, { type: "submit", loading: busy, children: "Save Department" }) })
  ] });
}
function ProfessorsTab() {
  const [rows, setRows] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [depts, setDepts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const load = () => {
    setLoading(true);
    Promise.all([adminService.listProfessors(), adminService.listColleges(), adminService.listDepartments()]).then(([p, c, d]) => {
      setRows(p);
      setColleges(c);
      setDepts(d);
    }).catch((e) => toast.error("Load failed", {
      description: e.message
    })).finally(() => setLoading(false));
  };
  useEffect(() => {
    load();
  }, []);
  return /* @__PURE__ */ jsxs(SectionShell, { title: "Manage Professors", subtitle: "Faculty roster across departments", action: /* @__PURE__ */ jsx(Button, { icon: /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }), onClick: () => setOpen(true), children: "Register Professor" }), children: [
    /* @__PURE__ */ jsx(DataGrid, { loading, rows, empty: "No professors yet.", columns: [{
      key: "firstName",
      label: "Name",
      w: "1.4fr",
      render: (r) => `${r.firstName} ${r.lastName}`
    }, {
      key: "email",
      label: "Email",
      w: "1.6fr"
    }, {
      key: "designation",
      label: "Designation",
      w: "1fr"
    }, {
      key: "phoneNo",
      label: "Phone",
      w: "140px"
    }, {
      key: "joiningDate",
      label: "Joined",
      w: "120px"
    }] }),
    /* @__PURE__ */ jsx(Modal, { open, onClose: () => setOpen(false), title: "Register Professor", children: /* @__PURE__ */ jsx(ProfessorForm, { colleges, depts, onDone: () => {
      setOpen(false);
      load();
    } }) })
  ] });
}
function ProfessorForm({
  colleges,
  depts,
  onDone
}) {
  const [f, setF] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNo: "",
    designation: "",
    joiningDate: toLocalDate(/* @__PURE__ */ new Date()),
    collegeId: colleges[0]?.collegeId || 0,
    departmentId: depts[0]?.departmentId || 0
  });
  const [busy, setBusy] = useState(false);
  const u = (p) => setF((x) => ({
    ...x,
    ...p
  }));
  const filteredDepts = useMemo(() => depts.filter((d) => d.collegeId === f.collegeId), [depts, f.collegeId]);
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await adminService.createProfessor({
        ...f,
        joiningDate: toLocalDate(f.joiningDate)
      });
      toast.success("Professor added");
      onDone();
    } catch (err) {
      toast.error("Failed", {
        description: err.message
      });
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "grid sm:grid-cols-2 gap-4", children: [
    /* @__PURE__ */ jsx(Input, { label: "First Name", value: f.firstName, onChange: (e) => u({
      firstName: e.target.value
    }), required: true }),
    /* @__PURE__ */ jsx(Input, { label: "Last Name", value: f.lastName, onChange: (e) => u({
      lastName: e.target.value
    }), required: true }),
    /* @__PURE__ */ jsx(Input, { label: "Email", type: "email", value: f.email, onChange: (e) => u({
      email: e.target.value
    }), required: true }),
    /* @__PURE__ */ jsx(Input, { label: "Password", type: "password", value: f.password, onChange: (e) => u({
      password: e.target.value
    }), required: true }),
    /* @__PURE__ */ jsx(Input, { label: "Phone", value: f.phoneNo, onChange: (e) => u({
      phoneNo: e.target.value
    }), required: true }),
    /* @__PURE__ */ jsx(Input, { label: "Designation", placeholder: "Head of Department", value: f.designation, onChange: (e) => u({
      designation: e.target.value
    }), required: true }),
    /* @__PURE__ */ jsx(Input, { type: "date", label: "Joining Date", value: f.joiningDate, onChange: (e) => u({
      joiningDate: e.target.value
    }), required: true }),
    /* @__PURE__ */ jsx(Select, { label: "College", value: f.collegeId, onChange: (e) => u({
      collegeId: Number(e.target.value)
    }), children: colleges.map((c) => /* @__PURE__ */ jsx("option", { value: c.collegeId, children: c.collegeName }, c.collegeId)) }),
    /* @__PURE__ */ jsx(Select, { label: "Department", className: "sm:col-span-2", value: f.departmentId, onChange: (e) => u({
      departmentId: Number(e.target.value)
    }), children: filteredDepts.map((d) => /* @__PURE__ */ jsx("option", { value: d.departmentId, children: d.departmentName }, d.departmentId)) }),
    /* @__PURE__ */ jsx("div", { className: "sm:col-span-2 flex justify-end", children: /* @__PURE__ */ jsx(Button, { type: "submit", loading: busy, children: "Save Professor" }) })
  ] });
}
function StudentsTab() {
  const [rows, setRows] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [depts, setDepts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const load = () => {
    setLoading(true);
    Promise.all([adminService.listStudents(), adminService.listColleges(), adminService.listDepartments()]).then(([s, c, d]) => {
      setRows(s);
      setColleges(c);
      setDepts(d);
    }).catch((e) => toast.error("Load failed", {
      description: e.message
    })).finally(() => setLoading(false));
  };
  useEffect(() => {
    load();
  }, []);
  return /* @__PURE__ */ jsxs(SectionShell, { title: "Manage Students", subtitle: "Enrolled learners across programs", action: /* @__PURE__ */ jsx(Button, { icon: /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }), onClick: () => setOpen(true), children: "Enroll Student" }), children: [
    /* @__PURE__ */ jsx(DataGrid, { loading, rows, empty: "No students yet.", columns: [{
      key: "rollNo",
      label: "Roll No",
      w: "150px"
    }, {
      key: "firstName",
      label: "Name",
      w: "1.4fr",
      render: (r) => `${r.firstName} ${r.lastName}`
    }, {
      key: "email",
      label: "Email",
      w: "1.6fr"
    }, {
      key: "year",
      label: "Yr",
      w: "60px"
    }, {
      key: "semester",
      label: "Sem",
      w: "60px"
    }, {
      key: "division",
      label: "Div",
      w: "60px"
    }, {
      key: "gender",
      label: "Gender",
      w: "90px"
    }] }),
    /* @__PURE__ */ jsx(Modal, { open, onClose: () => setOpen(false), title: "Enroll Student", children: /* @__PURE__ */ jsx(StudentForm, { colleges, depts, onDone: () => {
      setOpen(false);
      load();
    } }) })
  ] });
}
function StudentForm({
  colleges,
  depts,
  onDone
}) {
  const [f, setF] = useState({
    rollNo: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNo: "",
    gender: "MALE",
    dob: toLocalDate(new Date(2005, 0, 1)),
    year: 1,
    semester: 1,
    division: "A",
    admissionDate: toLocalDate(/* @__PURE__ */ new Date()),
    collegeId: colleges[0]?.collegeId || 0,
    departmentId: depts[0]?.departmentId || 0
  });
  const [busy, setBusy] = useState(false);
  const u = (p) => setF((x) => ({
    ...x,
    ...p
  }));
  const filteredDepts = useMemo(() => depts.filter((d) => d.collegeId === f.collegeId), [depts, f.collegeId]);
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await adminService.createStudent({
        ...f,
        dob: toLocalDate(f.dob),
        admissionDate: toLocalDate(f.admissionDate),
        year: Number(f.year),
        semester: Number(f.semester)
      });
      toast.success("Student enrolled");
      onDone();
    } catch (err) {
      toast.error("Failed", {
        description: err.message
      });
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "grid sm:grid-cols-2 gap-4", children: [
    /* @__PURE__ */ jsx(Input, { label: "Roll No", placeholder: "STU-2026-0042", value: f.rollNo, onChange: (e) => u({
      rollNo: e.target.value
    }), required: true }),
    /* @__PURE__ */ jsxs(Select, { label: "Gender", value: f.gender, onChange: (e) => u({
      gender: e.target.value
    }), children: [
      /* @__PURE__ */ jsx("option", { value: "MALE", children: "MALE" }),
      /* @__PURE__ */ jsx("option", { value: "FEMALE", children: "FEMALE" }),
      /* @__PURE__ */ jsx("option", { value: "OTHER", children: "OTHER" })
    ] }),
    /* @__PURE__ */ jsx(Input, { label: "First Name", value: f.firstName, onChange: (e) => u({
      firstName: e.target.value
    }), required: true }),
    /* @__PURE__ */ jsx(Input, { label: "Last Name", value: f.lastName, onChange: (e) => u({
      lastName: e.target.value
    }), required: true }),
    /* @__PURE__ */ jsx(Input, { label: "Email", type: "email", value: f.email, onChange: (e) => u({
      email: e.target.value
    }), required: true }),
    /* @__PURE__ */ jsx(Input, { label: "Password", type: "password", value: f.password, onChange: (e) => u({
      password: e.target.value
    }), required: true }),
    /* @__PURE__ */ jsx(Input, { label: "Phone", value: f.phoneNo, onChange: (e) => u({
      phoneNo: e.target.value
    }), required: true }),
    /* @__PURE__ */ jsx(Input, { type: "date", label: "Date of Birth", value: f.dob, onChange: (e) => u({
      dob: e.target.value
    }), required: true }),
    /* @__PURE__ */ jsx(Select, { label: "Year", value: f.year, onChange: (e) => u({
      year: Number(e.target.value)
    }), children: [1, 2, 3, 4].map((y) => /* @__PURE__ */ jsx("option", { value: y, children: y }, y)) }),
    /* @__PURE__ */ jsx(Select, { label: "Semester", value: f.semester, onChange: (e) => u({
      semester: Number(e.target.value)
    }), children: [1, 2, 3, 4, 5, 6, 7, 8].map((s) => /* @__PURE__ */ jsx("option", { value: s, children: s }, s)) }),
    /* @__PURE__ */ jsx(Select, { label: "Division", value: f.division, onChange: (e) => u({
      division: e.target.value
    }), children: ["A", "B", "C"].map((d) => /* @__PURE__ */ jsx("option", { value: d, children: d }, d)) }),
    /* @__PURE__ */ jsx(Input, { type: "date", label: "Admission Date", value: f.admissionDate, onChange: (e) => u({
      admissionDate: e.target.value
    }), required: true }),
    /* @__PURE__ */ jsx(Select, { label: "College", value: f.collegeId, onChange: (e) => u({
      collegeId: Number(e.target.value)
    }), children: colleges.map((c) => /* @__PURE__ */ jsx("option", { value: c.collegeId, children: c.collegeName }, c.collegeId)) }),
    /* @__PURE__ */ jsx(Select, { label: "Department", value: f.departmentId, onChange: (e) => u({
      departmentId: Number(e.target.value)
    }), children: filteredDepts.map((d) => /* @__PURE__ */ jsx("option", { value: d.departmentId, children: d.departmentName }, d.departmentId)) }),
    /* @__PURE__ */ jsx("div", { className: "sm:col-span-2 flex justify-end", children: /* @__PURE__ */ jsx(Button, { type: "submit", loading: busy, children: "Save Student" }) })
  ] });
}
function SubjectsTab() {
  const [rows, setRows] = useState([]);
  const [depts, setDepts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const load = () => {
    setLoading(true);
    Promise.all([adminService.listSubjects(), adminService.listDepartments()]).then(([s, d]) => {
      setRows(s);
      setDepts(d);
    }).catch((e) => toast.error("Load failed", {
      description: e.message
    })).finally(() => setLoading(false));
  };
  useEffect(() => {
    load();
  }, []);
  const deptName = (id) => depts.find((d) => d.departmentId === id)?.departmentName || `#${id}`;
  return /* @__PURE__ */ jsxs(SectionShell, { title: "Manage Subjects", subtitle: "Course catalog by department", action: /* @__PURE__ */ jsx(Button, { icon: /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }), onClick: () => setOpen(true), children: "Add Subject" }), children: [
    /* @__PURE__ */ jsx(DataGrid, { loading, rows, empty: "No subjects yet.", columns: [{
      key: "subjectCode",
      label: "Code",
      w: "120px"
    }, {
      key: "subjectName",
      label: "Name",
      w: "1.8fr"
    }, {
      key: "credits",
      label: "Credits",
      w: "90px"
    }, {
      key: "semester",
      label: "Sem",
      w: "80px"
    }, {
      key: "departmentId",
      label: "Department",
      w: "1fr",
      render: (r) => deptName(Number(r.departmentId))
    }] }),
    /* @__PURE__ */ jsx(Modal, { open, onClose: () => setOpen(false), title: "Add Subject", children: /* @__PURE__ */ jsx(SubjectForm, { depts, onDone: () => {
      setOpen(false);
      load();
    } }) })
  ] });
}
function SubjectForm({
  depts,
  onDone
}) {
  const [f, setF] = useState({
    subjectName: "",
    subjectCode: "",
    credits: 3,
    semester: 1,
    departmentId: depts[0]?.departmentId || 0
  });
  const [busy, setBusy] = useState(false);
  const u = (p) => setF((x) => ({
    ...x,
    ...p
  }));
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await adminService.createSubject({
        ...f,
        credits: Number(f.credits),
        semester: Number(f.semester)
      });
      toast.success("Subject added");
      onDone();
    } catch (err) {
      toast.error("Failed", {
        description: err.message
      });
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "grid sm:grid-cols-2 gap-4", children: [
    /* @__PURE__ */ jsx(Input, { label: "Subject Name", placeholder: "Data Structures & Algorithms", className: "sm:col-span-2", value: f.subjectName, onChange: (e) => u({
      subjectName: e.target.value
    }), required: true }),
    /* @__PURE__ */ jsx(Input, { label: "Code", placeholder: "CS-201", value: f.subjectCode, onChange: (e) => u({
      subjectCode: e.target.value
    }), required: true }),
    /* @__PURE__ */ jsx(Input, { label: "Credits", type: "number", min: 1, max: 10, value: f.credits, onChange: (e) => u({
      credits: Number(e.target.value)
    }), required: true }),
    /* @__PURE__ */ jsx(Select, { label: "Semester", value: f.semester, onChange: (e) => u({
      semester: Number(e.target.value)
    }), children: [1, 2, 3, 4, 5, 6, 7, 8].map((s) => /* @__PURE__ */ jsx("option", { value: s, children: s }, s)) }),
    /* @__PURE__ */ jsx(Select, { label: "Department", value: f.departmentId, onChange: (e) => u({
      departmentId: Number(e.target.value)
    }), children: depts.map((d) => /* @__PURE__ */ jsx("option", { value: d.departmentId, children: d.departmentName }, d.departmentId)) }),
    /* @__PURE__ */ jsx("div", { className: "sm:col-span-2 flex justify-end", children: /* @__PURE__ */ jsx(Button, { type: "submit", loading: busy, children: "Save Subject" }) })
  ] });
}
export {
  AdminDashboard as component
};
