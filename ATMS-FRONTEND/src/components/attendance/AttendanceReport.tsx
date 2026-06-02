import type { AttendanceDto, StudentDto } from "@/types/dto";
import { cn } from "@/lib/utils";

const tone: Record<AttendanceDto["attendanceStatus"], string> = {
  PRESENT: "text-[oklch(0.88_0.14_155)] bg-[oklch(0.72_0.18_155/0.15)] border-[oklch(0.72_0.18_155/0.4)]",
  ABSENT: "text-[oklch(0.85_0.15_25)] bg-[oklch(0.65_0.24_25/0.15)] border-[oklch(0.65_0.24_25/0.4)]",
  LATE: "text-[oklch(0.90_0.15_75)] bg-[oklch(0.80_0.17_75/0.15)] border-[oklch(0.80_0.17_75/0.4)]",
  LEAVE: "text-[oklch(0.85_0.15_270)] bg-[oklch(0.65_0.21_270/0.15)] border-[oklch(0.65_0.21_270/0.4)]",
};

export default function AttendanceReport({
  records,
  students,
}: { records: AttendanceDto[]; students: StudentDto[] }) {
  const map = new Map(students.map((s) => [s.studentId, s]));
  return (
    <div className="glass rounded-xl overflow-hidden">
      <div className="grid grid-cols-12 gap-3 px-4 py-3 text-[11px] uppercase tracking-wider text-muted-foreground border-b border-white/5">
        <div className="col-span-1">Sr No</div>
        <div className="col-span-2">Roll No</div>
        <div className="col-span-4">Student</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-3">Remarks</div>
      </div>
      {records.length === 0 && (
        <div className="px-4 py-10 text-center text-sm text-muted-foreground">No attendance records.</div>
      )}
      {records.map((r, index) => {
        const s = map.get(r.studentId);
        return (
          <div key={`${r.studentId}-${r.lectureId}`} className="grid grid-cols-12 gap-3 px-4 py-3 row-hover border-b border-white/5 items-center">
            <div className="col-span-1 text-[11px] text-muted-foreground">{index + 1}</div>
            <div className="col-span-2 font-mono text-xs">{s?.rollNo || "—"}</div>
            <div className="col-span-4 text-sm">{s ? `${s.firstName} ${s.lastName}` : "Unknown"}</div>
            <div className="col-span-2">
              <span className={cn("px-2 py-1 rounded-md text-[11px] font-semibold border", tone[r.attendanceStatus])}>
                {r.attendanceStatus}
              </span>
            </div>
            <div className="col-span-3 text-sm text-muted-foreground">{r.remarks || "—"}</div>
          </div>
        );
      })}
    </div>
  );
}
