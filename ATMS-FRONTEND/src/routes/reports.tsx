import { useEffect, useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import Navbar from "@/components/common/Navbar";
import Card from "@/components/common/Card";
import { Select } from "@/components/common/Input";
import { useAuth } from "@/context/AuthContext";
import { profService } from "@/services/profService";
import type { AttendanceDto, LectureDto, StudentDto, SubjectDto } from "@/types/dto";
import AttendanceReport from "@/components/attendance/AttendanceReport";
import { useAttendanceBadge, pctColor } from "@/hooks/useAttendance";
import { Loader2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/reports")({
  head: () => ({ meta: [{ title: "Reports — ATMS" }] }),
  component: Reports,
});

function Reports() {
  const { role, professor } = useAuth();
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<SubjectDto[]>([]);
  const [lectures, setLectures] = useState<LectureDto[]>([]);
  const [students, setStudents] = useState<StudentDto[]>([]);
  const [records, setRecords] = useState<AttendanceDto[]>([]);
  const [percentages, setPercentages] = useState<Record<number, number>>({});
  const [subjectId, setSubjectId] = useState<string>("");
  const [lectureId, setLectureId] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (role !== "PROFESSOR") { navigate({ to: "/login" }); return; }
    profService.listSubjects().then((s) => {
      setSubjects(s);
      if (s[0]?.subjectId) setSubjectId(String(s[0].subjectId));
    }).catch((e) => toast.error("Failed loading subjects", { description: e.message }));
  }, [role, navigate]);

  useEffect(() => {
    if (!subjectId) return;
    setLoading(true);
    profService.listLecturesBySubject(Number(subjectId))
      .then((lecs) => {
        const sorted = [...lecs].sort((a, b) => new Date(`${a.lectureDate}T${a.startTime}`).getTime() - new Date(`${b.lectureDate}T${b.startTime}`).getTime());
        setLectures(sorted);
        if (sorted[0]?.lectureId) {
          setLectureId(String(sorted[0].lectureId));
        } else {
          setLectureId("");
          setLectures([]);
          setStudents([]);
          setRecords([]);
        }
      })
      .catch((e) => toast.error("Failed loading lectures", { description: e.message }))
      .finally(() => setLoading(false));
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
    Promise.all([
      profService.attendanceByLecture(Number(lectureId)).catch(() => [] as AttendanceDto[]),
      profService.listClassStudents({
        year: activeLec.year,
        semester: activeLec.semester,
        division: activeLec.division,
        departmentId: activeLec.departmentId,
      }).catch(() => [] as StudentDto[]),
    ]).then(([recs, st]) => {
      setRecords(recs);
      setStudents(st);

      // fetch percentages for each student
      Promise.all(st.map((s) =>
        profService.studentPercentage(s.studentId!).then((p) => [s.studentId!, p] as const).catch(() => [s.studentId!, 0] as const)
      )).then((pairs) => setPercentages(Object.fromEntries(pairs)));
    }).finally(() => setLoading(false));
  }, [lectureId, lectures, professor]);

  const classPct = useMemo(() => {
    if (records.length === 0) return 0;
    const present = records.filter((r) => r.attendanceStatus === "PRESENT" || r.attendanceStatus === "LATE").length;
    return Math.round((present / records.length) * 100);
  }, [records]);

  const flagged = useMemo(() =>
    students.filter((s) => (percentages[s.studentId!] ?? 0) < 75), [students, percentages]);

  return (
    <div className="min-h-screen pb-16">
      <Navbar />
      <main className="mx-auto w-[min(1280px,calc(100%-2rem))] mt-8 space-y-5">
        <div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Insights</div>
          <h1 className="text-2xl sm:text-3xl font-semibold mt-1">Attendance Reports</h1>
        </div>

        <Card>
          <div className="grid sm:grid-cols-3 gap-4">
            <Select label="Subject" value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
              {subjects.length === 0 && <option value="">No subjects</option>}
              {subjects.map((s) => <option key={s.subjectId} value={s.subjectId}>{s.subjectCode} · {s.subjectName}</option>)}
            </Select>
            <Select label="Lecture" value={lectureId} onChange={(e) => setLectureId(e.target.value)}>
              {lectures.length === 0 && <option value="">No lectures</option>}
              {lectures.map((l, i) => <option key={l.lectureId} value={l.lectureId}>Lec {i + 1} : {l.topic}</option>)}
            </Select>
            <div className="flex items-end">
              <div className="glass rounded-xl px-4 py-3 w-full">
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Class Attendance</div>
                <div className={cn("text-2xl font-bold mt-1 tabular-nums", pctColor(classPct))}>{classPct}%</div>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Lecture roster" subtitle={lectureId ? (
          (() => {
            const idx = lectures.findIndex(l => String(l.lectureId) === lectureId);
            const l = lectures[idx];
            const s = subjects.find(sub => String(sub.subjectId) === subjectId);
            return l && s ? `Lec ${idx + 1} : ${s.subjectName} : ${l.topic}` : `Lecture #${lectureId}`;
          })()
        ) : "Select a lecture"}>
          {loading ? <div className="py-10 flex items-center justify-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin"/>Loading…</div>
            : <AttendanceReport records={records} students={students} />}
        </Card>

        <Card
          title="Student percentages"
          subtitle="Students below 75% are flagged"
          actions={flagged.length > 0 && (
            <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full badge-danger-glow">
              <AlertTriangle className="h-3.5 w-3.5" /> {flagged.length} at risk
            </div>
          )}
        >
          {students.length === 0 ? (
            <div className="py-10 text-center text-sm text-muted-foreground">No students.</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {students.map((s) => <PctTile key={s.studentId} student={s} pct={percentages[s.studentId!] ?? 0} />)}
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}

function PctTile({ student, pct }: { student: StudentDto; pct: number }) {
  const badge = useAttendanceBadge(pct);
  const danger = pct < 75;
  return (
    <div className={cn("rounded-xl p-4 border", danger ? "badge-danger-glow" : "glass border-white/8")}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold">{student.firstName} {student.lastName}</div>
          <div className="text-[11px] font-mono text-muted-foreground">{student.rollNo}</div>
        </div>
        <span className={cn("px-2 py-1 rounded-md text-[10px] font-bold border", badge.className)}>{badge.label}</span>
      </div>
      <div className={cn("mt-3 text-2xl font-bold tabular-nums", pctColor(pct))}>{Math.round(pct)}%</div>
      <div className="mt-2 h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
        <div className="h-full rounded-full bg-gradient-to-r from-[oklch(0.72_0.16_195)] to-[oklch(0.65_0.21_270)]" style={{ width: `${Math.min(100, Math.max(0, pct))}%` }} />
      </div>
    </div>
  );
}
