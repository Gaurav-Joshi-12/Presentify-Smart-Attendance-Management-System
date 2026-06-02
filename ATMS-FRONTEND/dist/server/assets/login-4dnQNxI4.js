import { jsxs, jsx } from "react/jsx-runtime";
import { useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { N as Navbar, c as cn, B as Button } from "./Navbar-6CkWdqZA.js";
import { C as Card } from "./api-BYmOYr6M.js";
import { I as Input, S as Select } from "./Input-SDsw45hQ.js";
import { ShieldCheck, GraduationCap, User, Lock, Mail } from "lucide-react";
import { a as adminService } from "./adminService-CzMVcGUR.js";
import { u as useAuth } from "./router-pUeayUFD.js";
import { toast } from "sonner";
import "clsx";
import "tailwind-merge";
import "axios";
import "@tanstack/react-query";
function Login() {
  const [tab, setTab] = useState("ADMIN");
  const {
    loginAdmin,
    loginProfessor
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
  useEffect(() => {
    if (tab !== "PROFESSOR") return;
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
    if (!collegeId) return setPErr("Select a college.");
    adminService.listProfessors().then((profs) => {
      const found = profs.find((p) => p.email.toLowerCase() === pEmail.toLowerCase() && Number(p.collegeId) === Number(collegeId) && (p.password === pPass || pPass === "professor"));
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
        setPErr("Invalid credentials. Check your email, college selection, or password.");
      }
    }).catch((err) => {
      setPErr("Failed to connect to auth server: " + err.message);
    });
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx("main", { className: "mx-auto w-[min(560px,calc(100%-2rem))] mt-16", children: /* @__PURE__ */ jsx(Card, { variant: "strong", padded: false, children: /* @__PURE__ */ jsxs("div", { className: "p-7", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-semibold", children: "Sign in" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Choose your role to continue." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 p-1 rounded-xl bg-white/3 border border-white/8 mb-6", children: ["ADMIN", "PROFESSOR"].map((t) => /* @__PURE__ */ jsxs("button", { onClick: () => setTab(t), className: cn("flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition btn-press", tab === t ? "bg-gradient-to-r from-[oklch(0.72_0.16_195/0.25)] to-[oklch(0.65_0.21_270/0.25)] text-foreground border border-white/10" : "text-muted-foreground hover:text-foreground"), children: [
        t === "ADMIN" ? /* @__PURE__ */ jsx(ShieldCheck, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(GraduationCap, { className: "h-4 w-4" }),
        t === "ADMIN" ? "Admin Login" : "Professor Login"
      ] }, t)) }),
      tab === "ADMIN" ? /* @__PURE__ */ jsxs("form", { onSubmit: onAdmin, className: "space-y-4", children: [
        /* @__PURE__ */ jsx(Input, { label: "Username", leading: /* @__PURE__ */ jsx(User, { className: "h-4 w-4" }), value: aUser, onChange: (e) => setAUser(e.target.value), placeholder: "admin", required: true }),
        /* @__PURE__ */ jsx(Input, { label: "Password", type: "password", leading: /* @__PURE__ */ jsx(Lock, { className: "h-4 w-4" }), value: aPass, onChange: (e) => setAPass(e.target.value), placeholder: "••••••", required: true }),
        aErr && /* @__PURE__ */ jsx("p", { className: "text-xs text-[oklch(0.80_0.18_25)]", children: aErr }),
        /* @__PURE__ */ jsx(Button, { type: "submit", className: "w-full", children: "Sign in as Admin" }),
        /* @__PURE__ */ jsx("p", { className: "text-[11px] text-center text-muted-foreground", children: "Demo credentials: admin / admin" })
      ] }) : /* @__PURE__ */ jsxs("form", { onSubmit: onProf, className: "space-y-4", children: [
        /* @__PURE__ */ jsxs(Select, { label: "College", value: collegeId, onChange: (e) => setCollegeId(e.target.value), disabled: loadingColleges, children: [
          colleges.length === 0 && /* @__PURE__ */ jsx("option", { value: "", children: "Loading…" }),
          colleges.map((c) => /* @__PURE__ */ jsx("option", { value: c.collegeId, children: c.collegeName }, c.collegeId))
        ] }),
        /* @__PURE__ */ jsx(Input, { label: "Email", type: "email", leading: /* @__PURE__ */ jsx(Mail, { className: "h-4 w-4" }), value: pEmail, onChange: (e) => setPEmail(e.target.value), placeholder: "amit.sharma@college.edu", required: true }),
        /* @__PURE__ */ jsx(Input, { label: "Password", type: "password", leading: /* @__PURE__ */ jsx(Lock, { className: "h-4 w-4" }), value: pPass, onChange: (e) => setPPass(e.target.value), placeholder: "professor", required: true }),
        pErr && /* @__PURE__ */ jsx("p", { className: "text-xs text-[oklch(0.80_0.18_25)]", children: pErr }),
        /* @__PURE__ */ jsx(Button, { type: "submit", className: "w-full", children: "Sign in as Professor" }),
        /* @__PURE__ */ jsx("p", { className: "text-[11px] text-center text-muted-foreground", children: "Demo password: professor" })
      ] })
    ] }) }) })
  ] });
}
export {
  Login as component
};
