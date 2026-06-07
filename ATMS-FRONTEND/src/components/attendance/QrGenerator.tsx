import { useEffect, useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Radio, Timer, Users, Wifi } from "lucide-react";
import { formatClock } from "@/utils/formatters";
import type { AttendanceDto, StudentDto } from "@/types/dto";

interface CheckIn {
  id: number;
  name: string;
  rollNo: string;
  time: string;
  status: string;
}

export default function QrGenerator({
  lectureId,
  topic,
  durationSec = 600,
  students = [],
  existingAttendance = [],
}: {
  lectureId: number;
  topic?: string;
  durationSec?: number;
  students?: StudentDto[];
  existingAttendance?: AttendanceDto[];
}) {
  const [remaining, setRemaining] = useState(durationSec);
  const [seed, setSeed] = useState(0);

  const payload = useMemo(
    () =>
      JSON.stringify({
        lectureId,
      }),
    [lectureId]
  );

  // Parse existing attendance and match with student details to compute the feed
  const feed = useMemo(() => {
    return (existingAttendance || [])
      .filter((att) => att.remarks?.startsWith("Attendance Marked with QR"))
      .map((att) => {
        const student = students.find((s) => s.studentId === att.studentId);
        let timeStr = "--:--";
        if (att.markedAt) {
          try {
            // Spring Boot LocalDateTime might return microsecond precision (e.g. .416631)
            // which can be unsupported or fail to parse in older browsers.
            // Sanitize by keeping only 3 fractional digits (milliseconds).
            let sanitized = att.markedAt;
            if (sanitized.includes(".")) {
              const [main, frac] = sanitized.split(".");
              sanitized = `${main}.${frac.slice(0, 3)}`;
            }
            const date = new Date(sanitized);
            if (!isNaN(date.getTime())) {
              timeStr = formatClock(date);
            }
          } catch (e) {
            console.error("Error parsing markedAt:", e);
          }
        }
        return {
          id: att.studentId!,
          name: student ? `${student.firstName} ${student.lastName}` : `Student #${att.studentId}`,
          rollNo: student ? student.rollNo : "STU-UNKNOWN",
          time: timeStr,
          status: att.attendanceStatus,
          rawTime: att.markedAt ? new Date(att.markedAt).getTime() : 0,
        };
      })
      .sort((a, b) => b.rawTime - a.rawTime);
  }, [existingAttendance, students]);

  // Countdown
  useEffect(() => {
    const t = setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  // Rotating token every 15s (security mock)
  useEffect(() => {
    const t = setInterval(() => setSeed((s) => s + 1), 15000);
    return () => clearInterval(t);
  }, []);

  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");

  return (
    <div className="grid lg:grid-cols-5 gap-5">
      <div className="lg:col-span-3 glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Active session</div>
            <div className="text-lg font-semibold mt-1">{topic || `Lecture #${lectureId}`}</div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[oklch(0.72_0.18_155/0.15)] border border-[oklch(0.72_0.18_155/0.4)]">
            <span className="h-2 w-2 rounded-full bg-[oklch(0.72_0.18_155)] animate-pulse" />
            <span className="text-xs font-medium text-[oklch(0.88_0.14_155)]">LIVE</span>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5 items-center">
          <div className="flex items-center justify-center">
            <div className="p-4 rounded-2xl bg-white shadow-[0_0_60px_-10px_oklch(0.72_0.16_195/0.6)]">
              <QRCodeSVG value={payload} size={220} bgColor="#ffffff" fgColor="#0F0F10" level="H" />
            </div>
          </div>
          <div className="space-y-3">
            <Metric icon={<Timer className="h-4 w-4" />} label="Time remaining" value={`${mm}:${ss}`} accent />
            <Metric icon={<Wifi className="h-4 w-4" />} label="Token rotation" value="every 15s" />
            <Metric icon={<Radio className="h-4 w-4" />} label="Scan frequency" value={`${feed.length} / min`} />
            <Metric icon={<Users className="h-4 w-4" />} label="Check-ins" value={String(feed.length)} />
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 glass rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold">Live check-ins</h4>
          <span className="text-[11px] text-muted-foreground">streaming</span>
        </div>
        <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
          {feed.length === 0 && (
            <div className="text-sm text-muted-foreground py-8 text-center">
              Waiting for students to scan…
            </div>
          )}
          {feed.map((c) => (
            <div
              key={c.id}
              className="animate-ticker flex items-center justify-between rounded-xl border border-white/5 bg-white/3 px-3 py-2.5"
            >
              <div>
                <div className="text-sm font-medium">{c.name}</div>
                <div className="text-[11px] font-mono text-muted-foreground">{c.rollNo}</div>
              </div>
              <div className="text-right">
                <div className="text-[11px] text-muted-foreground">{c.time}</div>
                <div className={
                  c.status === "PRESENT"
                    ? "text-[11px] font-semibold text-[oklch(0.88_0.14_155)]"
                    : "text-[11px] font-semibold text-[oklch(0.65_0.24_25)]"
                }>
                  {c.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Metric({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/8 bg-white/3 px-4 py-3">
      <div className="flex items-center gap-2 text-muted-foreground text-xs">{icon}{label}</div>
      <div className={`text-base font-semibold tabular-nums ${accent ? "neon-text" : ""}`}>{value}</div>
    </div>
  );
}
