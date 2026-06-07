import { jsxs, jsx } from "react/jsx-runtime";
import { useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { N as Navbar, c as cn, B as Button } from "./Navbar-CPIRaQSZ.js";
import { C as Card } from "./api-Rs_hdI2y.js";
import { I as Input } from "./Input-unOD1WgV.js";
import { ShieldCheck, GraduationCap, User, Lock, Mail } from "lucide-react";
import { a as adminService } from "./adminService-aj-xK-hE.js";
import { u as useAuth } from "./router-BIxLXd9m.js";
import { toast } from "sonner";
import "clsx";
import "tailwind-merge";
import "axios";
import "@tanstack/react-query";
import "zod";
function Login() {
  const [tab, setTab] = useState("ADMIN");
  const {
    loginAdmin,
    loginProfessor,
    loginStudent
  } = useAuth();
  const navigate = useNavigate();
  const [aUser, setAUser] = useState("");
  const [aPass, setAPass] = useState("");
  const [aErr, setAErr] = useState(null);
  const [colleges, setColleges] = useState([]);
  const [collegeId, setCollegeId] = useState("");
  const [pEmail, setPEmail] = useState("");
  const [pPass, setPPass] = useState("");
  const [pErr, setPErr] = useState(null);
  const [loadingColleges, setLoadingColleges] = useState(false);
  const [sEmail, setSEmail] = useState("");
  const [sPass, setSPass] = useState("");
  const [sErr, setSErr] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  useEffect(() => {
    if (tab === "ADMIN") return;
    setLoadingColleges(true);
    adminService.listColleges().then((data) => {
      setColleges(data);
      if (data[0]?.collegeId) setCollegeId(String(data[0].collegeId));
    }).catch(() => {
      const mock = [{
        collegeId: 1,
        collegeName: "MIT College of Engineering",
        collegeCode: "MIT-COE",
        address: "Lane 3",
        city: "Pune",
        state: "MH",
        pincode: "411038",
        email: "info@mitcoe.edu",
        phoneNo: "0200000000"
      }, {
        collegeId: 2,
        collegeName: "PICT",
        collegeCode: "PICT",
        address: "Dhankawadi",
        city: "Pune",
        state: "MH",
        pincode: "411043",
        email: "info@pict.edu",
        phoneNo: "0200000001"
      }];
      setColleges(mock);
      setCollegeId("1");
      toast.message("Using offline college list", {
        description: "Backend unreachable — showing demo entries."
      });
    }).finally(() => setLoadingColleges(false));
  }, [tab]);
  const onAdmin = (e) => {
    e.preventDefault();
    if (aUser === "admin" && aPass === "admin") {
      loginAdmin(aUser);
      toast.success("Welcome, admin");
      navigate({
        to: "/admin-dashboard"
      });
    } else setAErr("Invalid credentials. Try admin / admin.");
  };
  const onProf = (e) => {
    e.preventDefault();
    setSubmitting(true);
    adminService.listProfessors().then((profs) => {
      const found = profs.find((p) => p.email.toLowerCase() === pEmail.toLowerCase() && p.password === pPass);
      if (found) {
        loginProfessor({
          professorId: found.professorId,
          firstName: found.firstName,
          lastName: found.lastName,
          email: found.email,
          collegeId: found.collegeId,
          departmentId: found.departmentId
        });
        toast.success(`Welcome, Prof. ${found.lastName}`);
        navigate({
          to: "/subjects"
        });
      } else {
        setPErr("Invalid credentials. Check your email or password.");
      }
    }).catch((err) => {
      setPErr("Failed to connect to auth server: " + err.message);
    }).finally(() => setSubmitting(false));
  };
  const onStudent = (e) => {
    e.preventDefault();
    setSubmitting(true);
    adminService.listStudents().then((students) => {
      const found = students.find((s) => s.email.toLowerCase() === sEmail.toLowerCase() && s.password === sPass);
      if (found) {
        loginStudent(found);
        toast.success(`Welcome, ${found.firstName} ${found.lastName}`);
        navigate({
          to: "/student-dashboard"
        });
      } else {
        setSErr("Invalid credentials. Check your email or password.");
      }
    }).catch((err) => {
      setSErr("Failed to connect to auth server: " + err.message);
    }).finally(() => setSubmitting(false));
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx("main", { className: "mx-auto w-[min(560px,calc(100%-2rem))] mt-16", children: /* @__PURE__ */ jsx(Card, { variant: "strong", padded: false, children: /* @__PURE__ */ jsxs("div", { className: "p-7", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold", children: "Sign in" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Choose your role to continue." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 p-1 rounded-xl bg-white/3 border border-white/8 mb-6", children: ["ADMIN", "PROFESSOR", "STUDENT"].map((t) => /* @__PURE__ */ jsxs("button", { onClick: () => setTab(t), className: cn("flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition btn-press", tab === t ? "bg-gradient-to-r from-[oklch(0.72_0.16_195/0.25)] to-[oklch(0.65_0.21_270/0.25)] text-foreground border border-white/10" : "text-muted-foreground hover:text-foreground"), children: [
        t === "ADMIN" && /* @__PURE__ */ jsx(ShieldCheck, { className: "h-4 w-4" }),
        t === "PROFESSOR" && /* @__PURE__ */ jsx(GraduationCap, { className: "h-4 w-4" }),
        t === "STUDENT" && /* @__PURE__ */ jsx(GraduationCap, { className: "h-4 w-4 text-[oklch(0.72_0.16_195)]" }),
        t === "ADMIN" ? "Admin" : t === "PROFESSOR" ? "Faculty" : "Student"
      ] }, t)) }),
      tab === "ADMIN" && /* @__PURE__ */ jsxs("form", { onSubmit: onAdmin, className: "space-y-4", children: [
        /* @__PURE__ */ jsx(Input, { label: "Username", leading: /* @__PURE__ */ jsx(User, { className: "h-4 w-4" }), value: aUser, onChange: (e) => setAUser(e.target.value), placeholder: "admin", required: true }),
        /* @__PURE__ */ jsx(Input, { label: "Password", type: "password", leading: /* @__PURE__ */ jsx(Lock, { className: "h-4 w-4" }), value: aPass, onChange: (e) => setAPass(e.target.value), placeholder: "••••••", required: true }),
        aErr && /* @__PURE__ */ jsx("p", { className: "text-xs text-[oklch(0.80_0.18_25)]", children: aErr }),
        /* @__PURE__ */ jsx(Button, { type: "submit", className: "w-full", children: "Sign in as Admin" }),
        /* @__PURE__ */ jsx("p", { className: "text-[11px] text-center text-muted-foreground", children: "Demo credentials: admin / admin" })
      ] }),
      tab === "PROFESSOR" && /* @__PURE__ */ jsxs("form", { onSubmit: onProf, className: "space-y-4", children: [
        /* @__PURE__ */ jsx(Input, { label: "Email", type: "email", leading: /* @__PURE__ */ jsx(Mail, { className: "h-4 w-4" }), value: pEmail, onChange: (e) => setPEmail(e.target.value), placeholder: "professor@college.edu", required: true }),
        /* @__PURE__ */ jsx(Input, { label: "Password", type: "password", leading: /* @__PURE__ */ jsx(Lock, { className: "h-4 w-4" }), value: pPass, onChange: (e) => setPPass(e.target.value), placeholder: "••••••", required: true }),
        pErr && /* @__PURE__ */ jsx("p", { className: "text-xs text-[oklch(0.80_0.18_25)]", children: pErr }),
        /* @__PURE__ */ jsx(Button, { type: "submit", className: "w-full", loading: submitting, children: "Sign in as Faculty" })
      ] }),
      tab === "STUDENT" && /* @__PURE__ */ jsxs("form", { onSubmit: onStudent, className: "space-y-4", children: [
        /* @__PURE__ */ jsx(Input, { label: "Email", type: "email", leading: /* @__PURE__ */ jsx(Mail, { className: "h-4 w-4" }), value: sEmail, onChange: (e) => setSEmail(e.target.value), placeholder: "student@college.edu", required: true }),
        /* @__PURE__ */ jsx(Input, { label: "Password", type: "password", leading: /* @__PURE__ */ jsx(Lock, { className: "h-4 w-4" }), value: sPass, onChange: (e) => setSPass(e.target.value), placeholder: "••••••", required: true }),
        sErr && /* @__PURE__ */ jsx("p", { className: "text-xs text-[oklch(0.80_0.18_25)]", children: sErr }),
        /* @__PURE__ */ jsx(Button, { type: "submit", className: "w-full", loading: submitting, children: "Sign in as Student" })
      ] })
    ] }) }) })
  ] });
}
export {
  Login as component
};
