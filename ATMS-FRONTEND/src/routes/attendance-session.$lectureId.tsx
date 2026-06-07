import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import Navbar from "@/components/common/Navbar";
import Card from "@/components/common/Card";
import { useAuth } from "@/context/AuthContext";
import { profService } from "@/services/profService";
import type { StudentDto } from "@/types/dto";
import ManualMarkingTable from "@/components/attendance/ManualMarkingTable";
import QrGenerator from "@/components/attendance/QrGenerator";
import { ClipboardCheck, Loader2, QrCode } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/attendance-session/$lectureId")({
  head: () => ({ meta: [{ title: "Attendance Session — ATMS" }] }),
  component: AttendanceSession,
});

const MOCK_STUDENTS: StudentDto[] = Array.from({ length: 10 }).map((_, i) => ({
  studentId: 100 + i,
  rollNo: `STU-2026-00${String(20 + i).padStart(2, "0")}`,
  firstName: ["Arjun","Priya","Rohit","Neha","Kabir","Aditi","Ishaan","Riya","Vikas","Sara"][i],
  lastName: ["Sharma","Iyer","Verma","Patil","Khan","Rao","Mehta","Kapoor","Reddy","Joshi"][i],
  email: `student${i}@college.edu`,
  phoneNo: "9999999999",
  gender: i % 2 ? "FEMALE" : "MALE",
  dob: "2005-01-01",
  year: 2, semester: 3, division: "A",
  admissionDate: "2024-08-01", collegeId: 1, departmentId: 2,
}));

type Mode = "MANUAL" | "QR";

function AttendanceSession() {
  const { lectureId } = Route.useParams();
  const lecId = Number(lectureId);
  const { role, professor } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("MANUAL");
  const [students, setStudents] = useState<StudentDto[]>([]);
  const [existingAttendance, setExistingAttendance] = useState<AttendanceDto[]>([]);
  const [lecture, setLecture] = useState<any>(null);
  const [formattedTitle, setFormattedTitle] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (role !== "PROFESSOR") { navigate({ to: "/login" }); return; }
    if (!professor) return;
    setLoading(true);
    profService.getLectureById(lecId)
      .then((lectureData) => {
        setLecture(lectureData);
        return Promise.all([
          profService.listClassStudents({
            year: lectureData.year,
            semester: lectureData.semester,
            division: lectureData.division,
            departmentId: lectureData.departmentId,
          }).catch(() => [] as StudentDto[]),
          profService.attendanceByLecture(lecId).catch(() => [] as AttendanceDto[]),
        ]);
      })
      .then(([st, att]) => {
        setStudents(st.length ? st : MOCK_STUDENTS);
        setExistingAttendance(att);
      })
      .catch(() => { setStudents(MOCK_STUDENTS); toast.message("Showing demo roster"); })
      .finally(() => setLoading(false));
  }, [role, professor, navigate, lecId]);

  useEffect(() => {
    if (!professor || !lecId) return;

    const interval = setInterval(() => {
      profService.attendanceByLecture(lecId)
        .then((att) => {
          setExistingAttendance((prev) => {
            if (JSON.stringify(prev) === JSON.stringify(att)) return prev;
            return att;
          });
        })
        .catch((e) => console.error("Error polling live attendance:", e));
    }, 3000);

    return () => clearInterval(interval);
  }, [lecId, professor]);

  useEffect(() => {
    if (!lecture) return;
    Promise.all([
      profService.listLecturesBySubject(lecture.subjectId).catch(() => []),
      profService.listSubjects().catch(() => [])
    ]).then(([lectures, subjects]) => {
      const sorted = [...lectures].sort((a, b) => {
        return new Date(`${a.lectureDate}T${a.startTime}`).getTime() - new Date(`${b.lectureDate}T${b.startTime}`).getTime();
      });
      const idx = sorted.findIndex(l => l.lectureId === lecture.lectureId);
      const lecNo = idx >= 0 ? idx + 1 : 1;
      const subj = subjects.find(s => s.subjectId === lecture.subjectId);
      const subjName = subj ? subj.subjectName : "Unknown Subject";
      setFormattedTitle(`Lec ${lecNo} : ${subjName} : ${lecture.topic}`);
    });
  }, [lecture]);

  return (
    <div className="min-h-screen pb-16">
      <Navbar />
      <main className="mx-auto w-[min(1280px,calc(100%-2rem))] mt-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Live Attendance</div>
            <h1 className="text-2xl sm:text-3xl font-semibold mt-1">
              {formattedTitle || lecture?.topic || `Lecture #${lecId}`}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Mark students manually or open a live QR session.</p>
          </div>
          <Link to="/subjects" className="text-sm text-muted-foreground hover:text-foreground">← Subjects</Link>
        </div>

        <div className="grid grid-cols-2 p-1 rounded-xl bg-white/3 border border-white/8 mb-6 max-w-md">
          {[
            { k: "MANUAL" as Mode, label: "Manual Roster", icon: <ClipboardCheck className="h-4 w-4" /> },
            { k: "QR" as Mode, label: "QR Code Gate", icon: <QrCode className="h-4 w-4" /> },
          ].map((t) => (
            <button key={t.k} onClick={() => setMode(t.k)} className={cn(
              "flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition btn-press",
              mode === t.k
                ? "bg-gradient-to-r from-[oklch(0.72_0.16_195/0.25)] to-[oklch(0.65_0.21_270/0.25)] text-foreground border border-white/10"
                : "text-muted-foreground hover:text-foreground"
            )}>
              {t.icon}{t.label}
            </button>
          ))}
        </div>

        {mode === "MANUAL" ? (
          <Card title="Mark attendance" subtitle={`${students.length} students enrolled`}>
            {loading ? (
              <div className="py-12 flex items-center justify-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin"/>Loading roster…</div>
            ) : (
              <ManualMarkingTable students={students} lectureId={lecId} existingAttendance={existingAttendance} />
            )}
          </Card>
        ) : (
          <QrGenerator
            lectureId={lecId}
            topic={formattedTitle || lecture?.topic || `Lecture #${lecId}`}
            students={students}
            existingAttendance={existingAttendance}
          />
        )}
      </main>
    </div>
  );
}
