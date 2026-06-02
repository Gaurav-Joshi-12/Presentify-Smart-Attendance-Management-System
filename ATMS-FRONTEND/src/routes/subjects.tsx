import { useEffect, useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import Navbar from "@/components/common/Navbar";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import { useAuth } from "@/context/AuthContext";
import { profService } from "@/services/profService";
import type { StudentDto, SubjectDto } from "@/types/dto";
import { BookOpen, CalendarPlus, ChevronRight, Loader2, Search, Users, X } from "lucide-react";
import { toast } from "sonner";
import CreateLectureForm from "@/components/lectures/CreateLectureForm";

export const Route = createFileRoute("/subjects")({
  head: () => ({ meta: [{ title: "My Subjects — ATMS" }] }),
  component: SubjectsList,
});

// Mock fallback subjects when backend is unavailable
const MOCK_SUBJECTS: SubjectDto[] = [
  { subjectId: 1, subjectName: "Data Structures & Algorithms", subjectCode: "CS-201", credits: 4, semester: 3, departmentId: 2 },
  { subjectId: 2, subjectName: "Operating Systems", subjectCode: "CS-302", credits: 3, semester: 4, departmentId: 2 },
  { subjectId: 3, subjectName: "Database Management Systems", subjectCode: "CS-303", credits: 4, semester: 4, departmentId: 2 },
  { subjectId: 4, subjectName: "Computer Networks", subjectCode: "CS-401", credits: 3, semester: 5, departmentId: 2 },
];

function SubjectsList() {
  const { role, professor } = useAuth();
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<SubjectDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<SubjectDto | null>(null);
  const [panel, setPanel] = useState<"none" | "lecture" | "roster">("none");

  useEffect(() => {
    if (role !== "PROFESSOR") { navigate({ to: "/login" }); return; }
    setLoading(true);
    profService.listSubjects()
      .then((data) => setSubjects(data?.length ? data : MOCK_SUBJECTS))
      .catch(() => { setSubjects(MOCK_SUBJECTS); toast.message("Showing demo subjects", { description: "Backend unreachable." }); })
      .finally(() => setLoading(false));
  }, [role, navigate]);

  const openSubject = (s: SubjectDto) => { setActive(s); setPanel("none"); };

  return (
    <div className="min-h-screen pb-16">
      <Navbar />
      <main className="mx-auto w-[min(1280px,calc(100%-2rem))] mt-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Faculty Dashboard</div>
            <h1 className="text-2xl sm:text-3xl font-semibold mt-1">Welcome, Prof. {professor?.firstName}</h1>
            <p className="text-sm text-muted-foreground mt-1">Pick a subject to schedule a lecture or view the class roster.</p>
          </div>
        </div>

        {loading ? (
          <div className="glass rounded-2xl p-12 flex items-center justify-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading subjects…</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((s) => (
              <button key={s.subjectId} onClick={() => openSubject(s)}
                className="glass rounded-2xl p-5 text-left btn-press group hover:border-[oklch(0.72_0.16_195/0.5)] hover:shadow-[0_0_30px_-10px_oklch(0.72_0.16_195/0.5)] transition">
                <div className="flex items-start justify-between">
                  <div className="h-10 w-10 grid place-items-center rounded-xl bg-gradient-to-br from-[oklch(0.72_0.16_195/0.25)] to-[oklch(0.65_0.21_270/0.25)] border border-white/10 text-[oklch(0.78_0.15_190)]">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition" />
                </div>
                <div className="mt-4 text-base font-semibold tracking-tight">{s.subjectName}</div>
                <div className="text-xs text-muted-foreground mt-1 font-mono">{s.subjectCode}</div>
                <div className="mt-3 flex items-center gap-2 text-[11px] text-muted-foreground">
                  <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/8">Sem {s.semester}</span>
                  <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/8">{s.credits} cr</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {active && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-3 sm:p-6" onClick={() => setActive(null)}>
            <div className="glass-strong rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{active.subjectCode}</div>
                  <h3 className="text-base font-semibold">{active.subjectName}</h3>
                </div>
                <button onClick={() => setActive(null)} className="h-8 w-8 grid place-items-center rounded-lg hover:bg-white/5"><X className="h-4 w-4" /></button>
              </div>

              <div className="p-6 space-y-5">
                {panel === "none" && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    <ActionTile
                      icon={<CalendarPlus className="h-5 w-5" />}
                      title="Create Lecture"
                      desc="Schedule a new session for this subject."
                      onClick={() => setPanel("lecture")}
                    />
                    <ActionTile
                      icon={<Users className="h-5 w-5" />}
                      title="Students Enrolled"
                      desc="View the class roster for this subject."
                      onClick={() => setPanel("roster")}
                    />
                  </div>
                )}
                {panel === "lecture" && (
                  <Card title="Create Lecture" subtitle={active.subjectName}
                    actions={<Button size="sm" variant="ghost" onClick={() => setPanel("none")}>Back</Button>}>
                    <CreateLectureForm subjectId={active.subjectId!} defaultSemester={active.semester} />
                  </Card>
                )}
                {panel === "roster" && (
                  <RosterPanel subject={active} onBack={() => setPanel("none")} />
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function ActionTile({ icon, title, desc, onClick }: { icon: React.ReactNode; title: string; desc: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="text-left glass rounded-2xl p-5 btn-press hover:border-[oklch(0.72_0.16_195/0.5)] transition">
      <div className="h-10 w-10 grid place-items-center rounded-xl bg-white/5 border border-white/10 text-[oklch(0.78_0.15_190)]">{icon}</div>
      <div className="mt-3 font-semibold">{title}</div>
      <div className="text-sm text-muted-foreground mt-1">{desc}</div>
    </button>
  );
}

function RosterPanel({ subject, onBack }: { subject: SubjectDto; onBack: () => void }) {
  const { professor } = useAuth();
  const [students, setStudents] = useState<StudentDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [year, setYear] = useState(2);
  const [division, setDivision] = useState("A");

  useEffect(() => {
    if (!professor) return;
    setLoading(true);
    profService.listClassStudents({
      year, semester: subject.semester, division, departmentId: professor.departmentId,
    })
      .then(setStudents)
      .catch((e) => { setStudents([]); toast.error("Failed to load roster", { description: e.message }); })
      .finally(() => setLoading(false));
  }, [professor, subject.semester, year, division]);

  const filtered = useMemo(() => {
    const s = q.toLowerCase().trim();
    if (!s) return students;
    return students.filter((x) => x.rollNo.toLowerCase().includes(s) || `${x.firstName} ${x.lastName}`.toLowerCase().includes(s));
  }, [students, q]);

  return (
    <Card title="Students Enrolled" subtitle={`${subject.subjectName} · Sem ${subject.semester}`}
      actions={<Button size="sm" variant="ghost" onClick={onBack}>Back</Button>}>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="glass-input rounded-lg h-9 pl-9 pr-3 text-sm w-56" />
        </div>
        <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="glass-input rounded-lg h-9 px-3 text-sm bg-[oklch(0.22_0.01_280)]">
          {[1,2,3,4].map(y => <option key={y} value={y}>Year {y}</option>)}
        </select>
        <select value={division} onChange={(e) => setDivision(e.target.value)} className="glass-input rounded-lg h-9 px-3 text-sm bg-[oklch(0.22_0.01_280)]">
          {["A","B","C"].map(d => <option key={d} value={d}>Div {d}</option>)}
        </select>
      </div>
      <div className="glass rounded-xl overflow-hidden">
        <div className="grid grid-cols-12 gap-3 px-4 py-3 text-[11px] uppercase tracking-wider text-muted-foreground border-b border-white/5">
          <div className="col-span-3">Roll No</div><div className="col-span-5">Name</div><div className="col-span-4">Email</div>
        </div>
        {loading ? (
          <div className="py-10 flex items-center justify-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin"/>Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="py-10 text-center text-sm text-muted-foreground">No students.</div>
        ) : (
          <div className="max-h-[360px] overflow-y-auto">
            {filtered.map((s) => (
              <div key={s.studentId} className="grid grid-cols-12 gap-3 px-4 py-2.5 row-hover border-b border-white/5 items-center text-sm">
                <div className="col-span-3 font-mono text-xs">{s.rollNo}</div>
                <div className="col-span-5">{s.firstName} {s.lastName}</div>
                <div className="col-span-4 text-muted-foreground">{s.email}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
