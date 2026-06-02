import { useEffect, useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Radio, Timer, Users, Wifi } from "lucide-react";
import { formatClock } from "@/utils/formatters";

interface CheckIn { id: number; name: string; rollNo: string; time: string; }

const MOCK_NAMES = [
  ["Arjun", "Sharma", "STU-2026-0021"],
  ["Priya", "Iyer", "STU-2026-0022"],
  ["Rohit", "Verma", "STU-2026-0023"],
  ["Neha", "Patil", "STU-2026-0024"],
  ["Kabir", "Khan", "STU-2026-0025"],
  ["Aditi", "Rao", "STU-2026-0026"],
  ["Ishaan", "Mehta", "STU-2026-0027"],
];

export default function QrGenerator({
  lectureId,
  topic,
  durationSec = 600,
}: { lectureId: number; topic?: string; durationSec?: number }) {
  const [remaining, setRemaining] = useState(durationSec);
  const [feed, setFeed] = useState<CheckIn[]>([]);
  const [seed, setSeed] = useState(0);

  const payload = useMemo(
    () =>
      JSON.stringify({
        lectureId,
        ts: Date.now(),
        token: Math.random().toString(36).slice(2, 10),
        seed,
      }),
    [lectureId, seed]
  );

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

  // Mock check-ins
  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      if (i >= MOCK_NAMES.length) return clearInterval(t);
      const [f, l, r] = MOCK_NAMES[i++];
      setFeed((prev) => [
        { id: Date.now(), name: `${f} ${l}`, rollNo: r, time: formatClock(new Date()) },
        ...prev,
      ]);
    }, 2200);
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
                <div className="text-[11px] font-semibold text-[oklch(0.88_0.14_155)]">PRESENT</div>
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
