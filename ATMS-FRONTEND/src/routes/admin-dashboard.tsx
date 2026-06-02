import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import Navbar from "@/components/common/Navbar";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import Input, { Select } from "@/components/common/Input";
import { Building2, Layers, UserCog, Users, BookOpen, Plus, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { adminService } from "@/services/adminService";
import type { CollegeDto, DepartmentDto, ProfessorDto, StudentDto, SubjectDto } from "@/types/dto";
import { toast } from "sonner";
import { toLocalDate } from "@/utils/formatters";

export const Route = createFileRoute("/admin-dashboard")({
  head: () => ({ meta: [{ title: "Admin Control Hub — ATMS" }] }),
  component: AdminDashboard,
});

type TabKey = "colleges" | "departments" | "professors" | "students" | "subjects";

const TABS: { key: TabKey; label: string; icon: ReactNode; hint: string }[] = [
  { key: "colleges", label: "Colleges", icon: <Building2 className="h-4 w-4" />, hint: "Institutions" },
  { key: "departments", label: "Departments", icon: <Layers className="h-4 w-4" />, hint: "Academic units" },
  { key: "professors", label: "Professors", icon: <UserCog className="h-4 w-4" />, hint: "Faculty roster" },
  { key: "students", label: "Students", icon: <Users className="h-4 w-4" />, hint: "Enrolled learners" },
  { key: "subjects", label: "Subjects", icon: <BookOpen className="h-4 w-4" />, hint: "Course catalog" },
];

function AdminDashboard() {
  const { role } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabKey>("colleges");

  useEffect(() => {
    if (role !== "ADMIN") navigate({ to: "/login" });
  }, [role, navigate]);

  return (
    <div className="min-h-screen pb-16">
      <Navbar />
      <main className="mx-auto w-[min(1280px,calc(100%-2rem))] mt-8 grid lg:grid-cols-[260px_1fr] gap-5">
        <aside className="glass rounded-2xl p-3 h-fit lg:sticky lg:top-24">
          <div className="px-3 py-3">
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Control Hub</div>
            <div className="text-sm font-semibold mt-1">Data Management</div>
          </div>
          <div className="space-y-1">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition btn-press text-left",
                  tab === t.key
                    ? "bg-gradient-to-r from-[oklch(0.72_0.16_195/0.18)] to-[oklch(0.65_0.21_270/0.18)] border border-white/10 text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/3"
                )}
              >
                <span className={cn("h-7 w-7 grid place-items-center rounded-lg",
                  tab === t.key ? "bg-white/8 text-[oklch(0.78_0.15_190)]" : "bg-white/3")}
                >{t.icon}</span>
                <span className="flex-1">
                  <div className="font-medium">{t.label}</div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{t.hint}</div>
                </span>
              </button>
            ))}
          </div>
        </aside>

        <section>
          {tab === "colleges" && <CollegesTab />}
          {tab === "departments" && <DepartmentsTab />}
          {tab === "professors" && <ProfessorsTab />}
          {tab === "students" && <StudentsTab />}
          {tab === "subjects" && <SubjectsTab />}
        </section>
      </main>
    </div>
  );
}

/* ============================================================
 * Generic helpers
 * ============================================================ */

function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex p-4 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto" onClick={onClose}>
      <div className="m-auto glass-strong flex flex-col rounded-2xl w-full max-w-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
          <h3 className="text-base font-semibold">{title}</h3>
          <button onClick={onClose} className="h-8 w-8 grid place-items-center rounded-lg hover:bg-white/5"><X className="h-4 w-4" /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function DataGrid<T extends Record<string, unknown>>({
  rows, columns, loading, empty,
}: { rows: T[]; columns: { key: keyof T; label: string; render?: (r: T) => ReactNode; w?: string }[]; loading: boolean; empty: string }) {
  return (
    <div className="glass rounded-xl overflow-hidden">
      <div className="grid gap-3 px-4 py-3 text-[11px] uppercase tracking-wider text-muted-foreground border-b border-white/5"
        style={{ gridTemplateColumns: columns.map((c) => c.w || "1fr").join(" ") }}>
        {columns.map((c) => <div key={String(c.key)}>{c.label}</div>)}
      </div>
      {loading ? (
        <div className="px-4 py-12 flex items-center justify-center gap-2 text-muted-foreground text-sm">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading…
        </div>
      ) : rows.length === 0 ? (
        <div className="px-4 py-12 text-center text-sm text-muted-foreground">{empty}</div>
      ) : (
        <div className="max-h-[560px] overflow-y-auto">
          {rows.map((r, i) => (
            <div key={i} className="grid gap-3 px-4 py-3 row-hover border-b border-white/5 items-center text-sm"
              style={{ gridTemplateColumns: columns.map((c) => c.w || "1fr").join(" ") }}>
              {columns.map((c) => <div key={String(c.key)}>{c.render ? c.render(r) : String(r[c.key] ?? "—")}</div>)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SectionShell({ title, subtitle, action, children }: { title: string; subtitle: string; action: ReactNode; children: ReactNode }) {
  return (
    <Card variant="strong" padded={false}>
      <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        </div>
        {action}
      </div>
      <div className="p-6 pt-2">{children}</div>
    </Card>
  );
}

/* ============================================================
 * Colleges
 * ============================================================ */
function CollegesTab() {
  const [rows, setRows] = useState<CollegeDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const load = () => {
    setLoading(true);
    adminService.listColleges().then(setRows).catch((e) => toast.error("Failed to load colleges", { description: e.message })).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  return (
    <SectionShell
      title="Manage Colleges"
      subtitle="Registered institutions in the system"
      action={<Button icon={<Plus className="h-4 w-4" />} onClick={() => setOpen(true)}>Add College</Button>}
    >
      <DataGrid
        loading={loading}
        rows={rows as unknown as Record<string, unknown>[]}
        empty="No colleges yet."
        columns={[
          { key: "collegeCode", label: "Code", w: "100px" },
          { key: "collegeName", label: "Name", w: "1.5fr" },
          { key: "city", label: "City", w: "120px" },
          { key: "state", label: "State", w: "100px" },
          { key: "email", label: "Email", w: "1.2fr" },
          { key: "phoneNo", label: "Phone", w: "140px" },
        ]}
      />
      <Modal open={open} onClose={() => setOpen(false)} title="Add College">
        <CollegeForm onDone={() => { setOpen(false); load(); }} />
      </Modal>
    </SectionShell>
  );
}

function CollegeForm({ onDone }: { onDone: () => void }) {
  const [f, setF] = useState<CollegeDto>({ collegeName: "", collegeCode: "", address: "", city: "", state: "", pincode: "", email: "", phoneNo: "" });
  const [busy, setBusy] = useState(false);
  const u = (p: Partial<CollegeDto>) => setF((x) => ({ ...x, ...p }));
  const submit = async (e: FormEvent) => {
    e.preventDefault(); setBusy(true);
    try { await adminService.createCollege(f); toast.success("College added"); onDone(); }
    catch (err) { toast.error("Failed", { description: (err as Error).message }); }
    finally { setBusy(false); }
  };
  return (
    <form onSubmit={submit} className="grid sm:grid-cols-2 gap-4">
      <Input label="College Name" value={f.collegeName} onChange={(e) => u({ collegeName: e.target.value })} required />
      <Input label="Code" placeholder="MIT-COE" value={f.collegeCode} onChange={(e) => u({ collegeCode: e.target.value })} required />
      <Input label="Address" className="sm:col-span-2" value={f.address} onChange={(e) => u({ address: e.target.value })} required />
      <Input label="City" value={f.city} onChange={(e) => u({ city: e.target.value })} required />
      <Input label="State" value={f.state} onChange={(e) => u({ state: e.target.value })} required />
      <Input label="Pincode" value={f.pincode} onChange={(e) => u({ pincode: e.target.value })} required />
      <Input label="Email" type="email" value={f.email} onChange={(e) => u({ email: e.target.value })} required />
      <Input label="Phone" value={f.phoneNo} onChange={(e) => u({ phoneNo: e.target.value })} required />
      <div className="sm:col-span-2 flex justify-end"><Button type="submit" loading={busy}>Save College</Button></div>
    </form>
  );
}

/* ============================================================
 * Departments
 * ============================================================ */
function DepartmentsTab() {
  const [rows, setRows] = useState<DepartmentDto[]>([]);
  const [colleges, setColleges] = useState<CollegeDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([adminService.listDepartments(), adminService.listColleges()])
      .then(([d, c]) => { setRows(d); setColleges(c); })
      .catch((e) => toast.error("Load failed", { description: e.message }))
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const collegeName = (id: number) => colleges.find((c) => c.collegeId === id)?.collegeName || `#${id}`;

  return (
    <SectionShell
      title="Manage Departments"
      subtitle="Academic units across colleges"
      action={<Button icon={<Plus className="h-4 w-4" />} onClick={() => setOpen(true)}>Add Department</Button>}
    >
      <DataGrid
        loading={loading}
        rows={rows as unknown as Record<string, unknown>[]}
        empty="No departments yet."
        columns={[
          { key: "departmentCode", label: "Code", w: "100px" },
          { key: "departmentName", label: "Name", w: "1.5fr" },
          { key: "collegeId", label: "College", w: "1fr", render: (r) => collegeName(Number(r.collegeId)) },
        ]}
      />
      <Modal open={open} onClose={() => setOpen(false)} title="Add Department">
        <DepartmentForm colleges={colleges} onDone={() => { setOpen(false); load(); }} />
      </Modal>
    </SectionShell>
  );
}

function DepartmentForm({ colleges, onDone }: { colleges: CollegeDto[]; onDone: () => void }) {
  const [f, setF] = useState<DepartmentDto>({ departmentName: "", departmentCode: "", collegeId: colleges[0]?.collegeId || 0 });
  const [busy, setBusy] = useState(false);
  const u = (p: Partial<DepartmentDto>) => setF((x) => ({ ...x, ...p }));
  const submit = async (e: FormEvent) => {
    e.preventDefault(); setBusy(true);
    try { await adminService.createDepartment(f); toast.success("Department added"); onDone(); }
    catch (err) { toast.error("Failed", { description: (err as Error).message }); }
    finally { setBusy(false); }
  };
  return (
    <form onSubmit={submit} className="grid sm:grid-cols-2 gap-4">
      <Input label="Department Name" placeholder="Information Technology" value={f.departmentName} onChange={(e) => u({ departmentName: e.target.value })} required />
      <Input label="Code" placeholder="IT" value={f.departmentCode} onChange={(e) => u({ departmentCode: e.target.value })} required />
      <Select label="College" className="sm:col-span-2" value={f.collegeId} onChange={(e) => u({ collegeId: Number(e.target.value) })} required>
        {colleges.map((c) => <option key={c.collegeId} value={c.collegeId}>{c.collegeName}</option>)}
      </Select>
      <div className="sm:col-span-2 flex justify-end"><Button type="submit" loading={busy}>Save Department</Button></div>
    </form>
  );
}

/* ============================================================
 * Professors
 * ============================================================ */
function ProfessorsTab() {
  const [rows, setRows] = useState<ProfessorDto[]>([]);
  const [colleges, setColleges] = useState<CollegeDto[]>([]);
  const [depts, setDepts] = useState<DepartmentDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([adminService.listProfessors(), adminService.listColleges(), adminService.listDepartments()])
      .then(([p, c, d]) => { setRows(p); setColleges(c); setDepts(d); })
      .catch((e) => toast.error("Load failed", { description: e.message }))
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  return (
    <SectionShell
      title="Manage Professors"
      subtitle="Faculty roster across departments"
      action={<Button icon={<Plus className="h-4 w-4" />} onClick={() => setOpen(true)}>Register Professor</Button>}
    >
      <DataGrid
        loading={loading}
        rows={rows as unknown as Record<string, unknown>[]}
        empty="No professors yet."
        columns={[
          { key: "firstName", label: "Name", w: "1.4fr", render: (r) => `${r.firstName} ${r.lastName}` },
          { key: "email", label: "Email", w: "1.6fr" },
          { key: "designation", label: "Designation", w: "1fr" },
          { key: "phoneNo", label: "Phone", w: "140px" },
          { key: "joiningDate", label: "Joined", w: "120px" },
        ]}
      />
      <Modal open={open} onClose={() => setOpen(false)} title="Register Professor">
        <ProfessorForm colleges={colleges} depts={depts} onDone={() => { setOpen(false); load(); }} />
      </Modal>
    </SectionShell>
  );
}

function ProfessorForm({ colleges, depts, onDone }: { colleges: CollegeDto[]; depts: DepartmentDto[]; onDone: () => void }) {
  const [f, setF] = useState<ProfessorDto>({
    firstName: "", lastName: "", email: "", password: "", phoneNo: "",
    designation: "", joiningDate: toLocalDate(new Date()),
    collegeId: colleges[0]?.collegeId || 0, departmentId: depts[0]?.departmentId || 0,
  });
  const [busy, setBusy] = useState(false);
  const u = (p: Partial<ProfessorDto>) => setF((x) => ({ ...x, ...p }));
  const filteredDepts = useMemo(() => depts.filter((d) => d.collegeId === f.collegeId), [depts, f.collegeId]);
  const submit = async (e: FormEvent) => {
    e.preventDefault(); setBusy(true);
    try { await adminService.createProfessor({ ...f, joiningDate: toLocalDate(f.joiningDate) }); toast.success("Professor added"); onDone(); }
    catch (err) { toast.error("Failed", { description: (err as Error).message }); }
    finally { setBusy(false); }
  };
  return (
    <form onSubmit={submit} className="grid sm:grid-cols-2 gap-4">
      <Input label="First Name" value={f.firstName} onChange={(e) => u({ firstName: e.target.value })} required />
      <Input label="Last Name" value={f.lastName} onChange={(e) => u({ lastName: e.target.value })} required />
      <Input label="Email" type="email" value={f.email} onChange={(e) => u({ email: e.target.value })} required />
      <Input label="Password" type="password" value={f.password} onChange={(e) => u({ password: e.target.value })} required />
      <Input label="Phone" value={f.phoneNo} onChange={(e) => u({ phoneNo: e.target.value })} required />
      <Input label="Designation" placeholder="Head of Department" value={f.designation} onChange={(e) => u({ designation: e.target.value })} required />
      <Input type="date" label="Joining Date" value={f.joiningDate} onChange={(e) => u({ joiningDate: e.target.value })} required />
      <Select label="College" value={f.collegeId} onChange={(e) => u({ collegeId: Number(e.target.value) })}>
        {colleges.map((c) => <option key={c.collegeId} value={c.collegeId}>{c.collegeName}</option>)}
      </Select>
      <Select label="Department" className="sm:col-span-2" value={f.departmentId} onChange={(e) => u({ departmentId: Number(e.target.value) })}>
        {filteredDepts.map((d) => <option key={d.departmentId} value={d.departmentId}>{d.departmentName}</option>)}
      </Select>
      <div className="sm:col-span-2 flex justify-end"><Button type="submit" loading={busy}>Save Professor</Button></div>
    </form>
  );
}

/* ============================================================
 * Students
 * ============================================================ */
function StudentsTab() {
  const [rows, setRows] = useState<StudentDto[]>([]);
  const [colleges, setColleges] = useState<CollegeDto[]>([]);
  const [depts, setDepts] = useState<DepartmentDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([adminService.listStudents(), adminService.listColleges(), adminService.listDepartments()])
      .then(([s, c, d]) => { setRows(s); setColleges(c); setDepts(d); })
      .catch((e) => toast.error("Load failed", { description: e.message }))
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  return (
    <SectionShell
      title="Manage Students"
      subtitle="Enrolled learners across programs"
      action={<Button icon={<Plus className="h-4 w-4" />} onClick={() => setOpen(true)}>Enroll Student</Button>}
    >
      <DataGrid
        loading={loading}
        rows={rows as unknown as Record<string, unknown>[]}
        empty="No students yet."
        columns={[
          { key: "rollNo", label: "Roll No", w: "150px" },
          { key: "firstName", label: "Name", w: "1.4fr", render: (r) => `${r.firstName} ${r.lastName}` },
          { key: "email", label: "Email", w: "1.6fr" },
          { key: "year", label: "Yr", w: "60px" },
          { key: "semester", label: "Sem", w: "60px" },
          { key: "division", label: "Div", w: "60px" },
          { key: "gender", label: "Gender", w: "90px" },
        ]}
      />
      <Modal open={open} onClose={() => setOpen(false)} title="Enroll Student">
        <StudentForm colleges={colleges} depts={depts} onDone={() => { setOpen(false); load(); }} />
      </Modal>
    </SectionShell>
  );
}

function StudentForm({ colleges, depts, onDone }: { colleges: CollegeDto[]; depts: DepartmentDto[]; onDone: () => void }) {
  const [f, setF] = useState<StudentDto>({
    rollNo: "", firstName: "", lastName: "", email: "", password: "", phoneNo: "",
    gender: "MALE", dob: toLocalDate(new Date(2005, 0, 1)),
    year: 1, semester: 1, division: "A",
    admissionDate: toLocalDate(new Date()),
    collegeId: colleges[0]?.collegeId || 0, departmentId: depts[0]?.departmentId || 0,
  });
  const [busy, setBusy] = useState(false);
  const u = (p: Partial<StudentDto>) => setF((x) => ({ ...x, ...p }));
  const filteredDepts = useMemo(() => depts.filter((d) => d.collegeId === f.collegeId), [depts, f.collegeId]);
  const submit = async (e: FormEvent) => {
    e.preventDefault(); setBusy(true);
    try {
      await adminService.createStudent({
        ...f,
        dob: toLocalDate(f.dob),
        admissionDate: toLocalDate(f.admissionDate),
        year: Number(f.year), semester: Number(f.semester),
      });
      toast.success("Student enrolled"); onDone();
    } catch (err) { toast.error("Failed", { description: (err as Error).message }); }
    finally { setBusy(false); }
  };
  return (
    <form onSubmit={submit} className="grid sm:grid-cols-2 gap-4">
      <Input label="Roll No" placeholder="STU-2026-0042" value={f.rollNo} onChange={(e) => u({ rollNo: e.target.value })} required />
      <Select label="Gender" value={f.gender} onChange={(e) => u({ gender: e.target.value as StudentDto["gender"] })}>
        <option value="MALE">MALE</option><option value="FEMALE">FEMALE</option><option value="OTHER">OTHER</option>
      </Select>
      <Input label="First Name" value={f.firstName} onChange={(e) => u({ firstName: e.target.value })} required />
      <Input label="Last Name" value={f.lastName} onChange={(e) => u({ lastName: e.target.value })} required />
      <Input label="Email" type="email" value={f.email} onChange={(e) => u({ email: e.target.value })} required />
      <Input label="Password" type="password" value={f.password} onChange={(e) => u({ password: e.target.value })} required />
      <Input label="Phone" value={f.phoneNo} onChange={(e) => u({ phoneNo: e.target.value })} required />
      <Input type="date" label="Date of Birth" value={f.dob} onChange={(e) => u({ dob: e.target.value })} required />
      <Select label="Year" value={f.year} onChange={(e) => u({ year: Number(e.target.value) })}>
        {[1,2,3,4].map(y => <option key={y} value={y}>{y}</option>)}
      </Select>
      <Select label="Semester" value={f.semester} onChange={(e) => u({ semester: Number(e.target.value) })}>
        {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>{s}</option>)}
      </Select>
      <Select label="Division" value={f.division} onChange={(e) => u({ division: e.target.value })}>
        {["A","B","C"].map(d => <option key={d} value={d}>{d}</option>)}
      </Select>
      <Input type="date" label="Admission Date" value={f.admissionDate} onChange={(e) => u({ admissionDate: e.target.value })} required />
      <Select label="College" value={f.collegeId} onChange={(e) => u({ collegeId: Number(e.target.value) })}>
        {colleges.map((c) => <option key={c.collegeId} value={c.collegeId}>{c.collegeName}</option>)}
      </Select>
      <Select label="Department" value={f.departmentId} onChange={(e) => u({ departmentId: Number(e.target.value) })}>
        {filteredDepts.map((d) => <option key={d.departmentId} value={d.departmentId}>{d.departmentName}</option>)}
      </Select>
      <div className="sm:col-span-2 flex justify-end"><Button type="submit" loading={busy}>Save Student</Button></div>
    </form>
  );
}

/* ============================================================
 * Subjects
 * ============================================================ */
function SubjectsTab() {
  const [rows, setRows] = useState<SubjectDto[]>([]);
  const [depts, setDepts] = useState<DepartmentDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([adminService.listSubjects(), adminService.listDepartments()])
      .then(([s, d]) => { setRows(s); setDepts(d); })
      .catch((e) => toast.error("Load failed", { description: e.message }))
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);
  const deptName = (id: number) => depts.find((d) => d.departmentId === id)?.departmentName || `#${id}`;

  return (
    <SectionShell
      title="Manage Subjects"
      subtitle="Course catalog by department"
      action={<Button icon={<Plus className="h-4 w-4" />} onClick={() => setOpen(true)}>Add Subject</Button>}
    >
      <DataGrid
        loading={loading}
        rows={rows as unknown as Record<string, unknown>[]}
        empty="No subjects yet."
        columns={[
          { key: "subjectCode", label: "Code", w: "120px" },
          { key: "subjectName", label: "Name", w: "1.8fr" },
          { key: "credits", label: "Credits", w: "90px" },
          { key: "semester", label: "Sem", w: "80px" },
          { key: "departmentId", label: "Department", w: "1fr", render: (r) => deptName(Number(r.departmentId)) },
        ]}
      />
      <Modal open={open} onClose={() => setOpen(false)} title="Add Subject">
        <SubjectForm depts={depts} onDone={() => { setOpen(false); load(); }} />
      </Modal>
    </SectionShell>
  );
}

function SubjectForm({ depts, onDone }: { depts: DepartmentDto[]; onDone: () => void }) {
  const [f, setF] = useState<SubjectDto>({ subjectName: "", subjectCode: "", credits: 3, semester: 1, departmentId: depts[0]?.departmentId || 0 });
  const [busy, setBusy] = useState(false);
  const u = (p: Partial<SubjectDto>) => setF((x) => ({ ...x, ...p }));
  const submit = async (e: FormEvent) => {
    e.preventDefault(); setBusy(true);
    try { await adminService.createSubject({ ...f, credits: Number(f.credits), semester: Number(f.semester) }); toast.success("Subject added"); onDone(); }
    catch (err) { toast.error("Failed", { description: (err as Error).message }); }
    finally { setBusy(false); }
  };
  return (
    <form onSubmit={submit} className="grid sm:grid-cols-2 gap-4">
      <Input label="Subject Name" placeholder="Data Structures & Algorithms" className="sm:col-span-2" value={f.subjectName} onChange={(e) => u({ subjectName: e.target.value })} required />
      <Input label="Code" placeholder="CS-201" value={f.subjectCode} onChange={(e) => u({ subjectCode: e.target.value })} required />
      <Input label="Credits" type="number" min={1} max={10} value={f.credits} onChange={(e) => u({ credits: Number(e.target.value) })} required />
      <Select label="Semester" value={f.semester} onChange={(e) => u({ semester: Number(e.target.value) })}>
        {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>{s}</option>)}
      </Select>
      <Select label="Department" value={f.departmentId} onChange={(e) => u({ departmentId: Number(e.target.value) })}>
        {depts.map((d) => <option key={d.departmentId} value={d.departmentId}>{d.departmentName}</option>)}
      </Select>
      <div className="sm:col-span-2 flex justify-end"><Button type="submit" loading={busy}>Save Subject</Button></div>
    </form>
  );
}
