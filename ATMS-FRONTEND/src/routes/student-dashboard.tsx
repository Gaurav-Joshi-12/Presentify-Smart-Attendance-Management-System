import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/common/Navbar";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import { studentService } from "@/services/studentService";
import { profService } from "@/services/profService";
import type { SubjectDto, AttendanceDto, LectureDto } from "@/types/dto";
import { QrCode, BookOpen, CheckCircle, XCircle, AlertTriangle, Compass, Award, Percent, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { pctColor } from "@/hooks/useAttendance";

export const Route = createFileRoute("/student-dashboard")({
  head: () => ({ meta: [{ title: "Student Dashboard — ATMS" }] }),
  component: StudentDashboard,
});

function StudentDashboard() {
  const { role, student } = useAuth();
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState<SubjectDto[]>([]);
  const [attendance, setAttendance] = useState<AttendanceDto[]>([]);
  const [lectures, setLectures] = useState<LectureDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (role !== "STUDENT") {
      navigate({ to: "/login" });
    }
  }, [role, navigate]);

  useEffect(() => {
    if (!student?.studentId) return;

    setLoading(true);
    Promise.all([
      studentService.listStudentSubjects(student.studentId),
      studentService.listStudentAttendance(student.studentId),
      profService.listAllLectures().catch(() => [] as LectureDto[]),
    ])
      .then(([subjs, atts, lecs]) => {
        setSubjects(subjs);
        setAttendance(atts);
        setLectures(lecs);
      })
      .catch((err) => {
        console.error("Failed to load dashboard data", err);
        toast.error("Error loading dashboard metrics");
      })
      .finally(() => setLoading(false));
  }, [student]);

  // Map lectures by lectureId for quick lookup
  const lectureMap = useMemo(() => {
    return new Map<number, LectureDto>(lectures.map((l) => [l.lectureId!, l]));
  }, [lectures]);

  // Compute stats per subject
  const subjectStats = useMemo(() => {
    return subjects.map((sub) => {
      const subLectures = lectures.filter((l) => l.subjectId === sub.subjectId);
      const subLecIds = new Set(subLectures.map((l) => l.lectureId));

      const records = attendance.filter((r) => subLecIds.has(r.lectureId));
      const total = records.length;
      const present = records.filter(
        (r) => r.attendanceStatus === "PRESENT" || r.attendanceStatus === "LATE"
      ).length;
      const percentage = total > 0 ? Math.round((present / total) * 100) : 100;

      return {
        ...sub,
        total,
        present,
        absent: total - present,
        percentage,
      };
    });
  }, [subjects, attendance, lectures]);

  // Compute overall stats
  const overallStats = useMemo(() => {
    const total = attendance.length;
    const present = attendance.filter(
      (r) => r.attendanceStatus === "PRESENT" || r.attendanceStatus === "LATE"
    ).length;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 100;

    return {
      total,
      present,
      absent: total - present,
      percentage,
    };
  }, [attendance]);

  if (role !== "STUDENT" || !student) return null;

  return (
    <div className="min-h-screen pb-16">
      <Navbar />

      <main className="mx-auto w-[min(1280px,calc(100%-2rem))] mt-8 space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass rounded-2xl p-6">
          <div className="space-y-1">
            <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Student Portal</div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Welcome, {student.firstName} {student.lastName}
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground font-mono">
              <span>Roll No: {student.rollNo}</span>
              <span>•</span>
              <span>Div: {student.division}</span>
              <span>•</span>
              <span>Sem: {student.semester}</span>
              <span>•</span>
              <span>Year: {student.year}</span>
            </div>
          </div>
          <Button
            onClick={() => navigate({ to: "/student-scan" })}
            variant="primary"
            size="lg"
            icon={<QrCode className="h-5 w-5" />}
          >
            Scan Session QR Code
          </Button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="h-10 w-10 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground">Calculating attendance matrices...</p>
          </div>
        ) : (
          <>
            {/* Metric Summary Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <Card padded className="relative overflow-hidden group">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">Attendance Percentage</span>
                    <h3 className="text-3xl font-bold tracking-tight">{overallStats.percentage}%</h3>
                  </div>
                  <div className={`p-2.5 rounded-xl border border-solid ${
                    overallStats.percentage >= 75 ? "badge-success-glow" : "badge-danger-glow"
                  }`}>
                    <Percent className="h-5 w-5" />
                  </div>
                </div>
                {overallStats.percentage < 75 ? (
                  <div className="mt-4 flex items-center gap-1.5 text-xs text-[oklch(0.65_0.24_25)] font-medium">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Below attendance threshold (75%)
                  </div>
                ) : (
                  <div className="mt-4 flex items-center gap-1.5 text-xs text-[oklch(0.72_0.18_155)] font-medium">
                    <CheckCircle className="h-3.5 w-3.5" />
                    Attendance status safe
                  </div>
                )}
              </Card>

              <Card padded>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">Total Sessions Held</span>
                    <h3 className="text-3xl font-bold tracking-tight">{overallStats.total}</h3>
                  </div>
                  <div className="p-2.5 rounded-xl border border-white/10 bg-white/5">
                    <BookOpen className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
                <div className="mt-4 text-xs text-muted-foreground">Across all registered subjects</div>
              </Card>

              <Card padded>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">Lectures Attended</span>
                    <h3 className="text-3xl font-bold tracking-tight text-[oklch(0.72_0.18_155)]">{overallStats.present}</h3>
                  </div>
                  <div className="p-2.5 rounded-xl border border-[oklch(0.72_0.18_155/0.2)] bg-[oklch(0.72_0.18_155/0.05)] text-[oklch(0.72_0.18_155)]">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4 text-xs text-muted-foreground">Present or Late check-ins</div>
              </Card>

              <Card padded>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">Lectures Missed</span>
                    <h3 className="text-3xl font-bold tracking-tight text-[oklch(0.65_0.24_25)]">{overallStats.absent}</h3>
                  </div>
                  <div className="p-2.5 rounded-xl border border-[oklch(0.65_0.24_25/0.2)] bg-[oklch(0.65_0.24_25/0.05)] text-[oklch(0.65_0.24_25)]">
                    <XCircle className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4 text-xs text-muted-foreground">Absent or non-submitted logs</div>
              </Card>
            </div>

            {/* Subject wise Attendance */}
            <Card title="Subject Attendance Breakdown" subtitle="Track your attendance progress for individual subjects">
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                {subjectStats.map((sub) => (
                  <div key={sub.subjectId} className="glass rounded-xl p-5 border border-white/5 hover:border-white/10 transition flex flex-col justify-between space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="font-mono text-[10px] text-muted-foreground tracking-wider uppercase">
                          {sub.subjectCode} · {sub.credits} Credits
                        </div>
                        <h4 className="text-base font-semibold text-foreground mt-0.5">{sub.subjectName}</h4>
                      </div>
                      <div className={`px-2.5 py-1 text-xs font-bold rounded-md border ${
                        sub.percentage >= 75 ? "badge-success-glow" : "badge-danger-glow"
                      }`}>
                        {sub.percentage}%
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Sessions Attended: {sub.present} / {sub.total}</span>
                        <span>Min Requirement: 75%</span>
                      </div>
                      {/* Custom progress bar */}
                      <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            sub.percentage >= 75
                              ? "bg-gradient-to-r from-[oklch(0.72_0.18_155)] to-[oklch(0.78_0.15_190)]"
                              : "bg-gradient-to-r from-[oklch(0.65_0.24_25)] to-[oklch(0.80_0.17_75)]"
                          }`}
                          style={{ width: `${Math.min(sub.percentage, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                {subjectStats.length === 0 && (
                  <div className="col-span-2 text-center py-12 text-sm text-muted-foreground">
                    No registered subjects found for your profile.
                  </div>
                )}
              </div>
            </Card>
          </>
        )}
      </main>
    </div>
  );
}
