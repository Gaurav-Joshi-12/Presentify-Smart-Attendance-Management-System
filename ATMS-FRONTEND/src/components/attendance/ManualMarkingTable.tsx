import { useMemo, useState } from "react";
import type { AttendanceStatus, StudentDto } from "@/types/dto";
import Button from "@/components/common/Button";
import { Search, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { profService } from "@/services/profService";

interface Row {
  status: AttendanceStatus;
  remarks: string;
}

const STATUSES: AttendanceStatus[] = ["PRESENT", "ABSENT", "LATE", "LEAVE"];

const pillFor = (s: AttendanceStatus, active: boolean) => {
  const base =
    "px-2.5 py-1 text-[11px] font-semibold rounded-md border transition btn-press";
  if (!active)
    return `${base} bg-white/3 border-white/10 text-muted-foreground hover:text-foreground hover:bg-white/5`;
  switch (s) {
    case "PRESENT":
      return `${base} bg-[oklch(0.72_0.18_155/0.18)] border-[oklch(0.72_0.18_155/0.5)] text-[oklch(0.88_0.14_155)] shadow-[0_0_18px_oklch(0.72_0.18_155/0.35)]`;
    case "ABSENT":
      return `${base} bg-[oklch(0.65_0.24_25/0.18)] border-[oklch(0.65_0.24_25/0.55)] text-[oklch(0.85_0.15_25)] shadow-[0_0_18px_oklch(0.65_0.24_25/0.35)]`;
    case "LATE":
      return `${base} bg-[oklch(0.80_0.17_75/0.18)] border-[oklch(0.80_0.17_75/0.5)] text-[oklch(0.90_0.15_75)]`;
    case "LEAVE":
      return `${base} bg-[oklch(0.65_0.21_270/0.18)] border-[oklch(0.65_0.21_270/0.5)] text-[oklch(0.85_0.15_270)]`;
  }
};

export default function ManualMarkingTable({
  students,
  lectureId,
  onSubmitted,
}: {
  students: StudentDto[];
  lectureId: number;
  onSubmitted?: () => void;
}) {
  const [rows, setRows] = useState<Record<number, Row>>(() =>
    Object.fromEntries(
      students.map((s) => [s.studentId!, { status: "PRESENT" as AttendanceStatus, remarks: "" }])
    )
  );
  const [query, setQuery] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return students;
    return students.filter(
      (s) =>
        s.rollNo.toLowerCase().includes(q) ||
        `${s.firstName} ${s.lastName}`.toLowerCase().includes(q)
    );
  }, [students, query]);

  const counts = useMemo(() => {
    const c: Record<AttendanceStatus, number> = { PRESENT: 0, ABSENT: 0, LATE: 0, LEAVE: 0 };
    Object.values(rows).forEach((r) => { c[r.status]++; });
    return c;
  }, [rows]);

  const update = (id: number, patch: Partial<Row>) => {
    if (submitted) return;
    setRows((p) => ({ ...p, [id]: { ...p[id], ...patch } }));
  };

  const markAll = (s: AttendanceStatus) => {
    if (submitted) return;
    setRows((p) => Object.fromEntries(Object.entries(p).map(([k, v]) => [k, { ...v, status: s }])));
  };

  const submit = async () => {
    if (submitted) return;
    setSubmitting(true);
    try {
      await Promise.all(
        students.map((s) =>
          profService.markAttendance({
            attendanceStatus: rows[s.studentId!].status,
            remarks: rows[s.studentId!].remarks,
            lectureId,
            studentId: s.studentId!,
          })
        )
      );
      toast.success("Attendance submitted", { description: `${students.length} students recorded` });
      setSubmitted(true);
      onSubmitted?.();
    } catch (e) {
      const err = e as Error;
      toast.error("Failed to submit", { description: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          {STATUSES.map((s) => (
            <div key={s} className={cn(pillFor(s, true), "cursor-default")}>
              {s} · {counts[s]}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search roll no / name"
              className="glass-input rounded-lg h-9 pl-9 pr-3 text-sm w-64"
            />
          </div>
          <Button size="sm" variant="secondary" onClick={() => markAll("PRESENT")} disabled={submitted}>All Present</Button>
          <Button size="sm" variant="ghost" onClick={() => markAll("ABSENT")} disabled={submitted}>All Absent</Button>
        </div>
      </div>

      <div className="glass rounded-xl overflow-hidden">
        <div className="grid grid-cols-12 gap-3 px-4 py-3 text-[11px] uppercase tracking-wider text-muted-foreground border-b border-white/5">
          <div className="col-span-2">Roll No</div>
          <div className="col-span-3">Student</div>
          <div className="col-span-4">Status</div>
          <div className="col-span-3">Remarks</div>
        </div>
        <div className="max-h-[520px] overflow-y-auto">
          {filtered.length === 0 && (
            <div className="px-4 py-12 text-center text-sm text-muted-foreground">No students match.</div>
          )}
          {filtered.map((s) => {
            const row = rows[s.studentId!];
            return (
              <div key={s.studentId} className="grid grid-cols-12 gap-3 px-4 py-3 row-hover border-b border-white/5 items-center">
                <div className="col-span-2 font-mono text-xs text-foreground/80">{s.rollNo}</div>
                <div className="col-span-3">
                  <div className="text-sm font-medium">{s.firstName} {s.lastName}</div>
                  <div className="text-[11px] text-muted-foreground">{s.email}</div>
                </div>
                <div className="col-span-4 flex items-center gap-1.5 flex-wrap">
                  {STATUSES.map((st) => (
                    <button key={st} type="button" onClick={() => update(s.studentId!, { status: st })} className={pillFor(st, row.status === st)} disabled={submitted}>
                      {st}
                    </button>
                  ))}
                </div>
                <div className="col-span-3">
                  <input
                    value={row.remarks}
                    onChange={(e) => update(s.studentId!, { remarks: e.target.value })}
                    placeholder="Reason / note"
                    className="glass-input rounded-lg h-9 px-3 text-sm w-full"
                    disabled={submitted}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={submit} loading={submitting} disabled={submitted} icon={<CheckCircle2 className="h-4 w-4" />}>
          {submitted ? "Submitted Successfully" : `Submit Attendance (${students.length})`}
        </Button>
      </div>
    </div>
  );
}
