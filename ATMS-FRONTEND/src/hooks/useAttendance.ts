// Performance badges + color indicators based on attendance percentage.

export interface PerfBadge {
  label: string;
  tone: "success" | "warning" | "danger" | "neutral";
  className: string;
}

export function useAttendanceBadge(pct: number | null | undefined): PerfBadge {
  const value = typeof pct === "number" ? pct : 0;
  if (value >= 90)
    return { label: "Excellent", tone: "success", className: "badge-success-glow" };
  if (value >= 75)
    return {
      label: "Good",
      tone: "success",
      className:
        "bg-[oklch(0.72_0.16_195/0.15)] border border-[oklch(0.72_0.16_195/0.4)] text-[oklch(0.88_0.12_195)]",
    };
  if (value >= 60)
    return {
      label: "At Risk",
      tone: "warning",
      className:
        "bg-[oklch(0.80_0.17_75/0.15)] border border-[oklch(0.80_0.17_75/0.4)] text-[oklch(0.90_0.15_75)]",
    };
  return { label: "Critical", tone: "danger", className: "badge-danger-glow" };
}

export const pctColor = (pct: number) => {
  if (pct >= 75) return "text-[oklch(0.85_0.15_155)]";
  if (pct >= 60) return "text-[oklch(0.88_0.15_75)]";
  return "text-[oklch(0.80_0.18_25)]";
};
