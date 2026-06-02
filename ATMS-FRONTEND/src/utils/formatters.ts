// Serializers for Java LocalDate / LocalTime compatibility.

export const toLocalDate = (d: Date | string | null | undefined): string => {
  if (!d) return "";
  const date = typeof d === "string" ? new Date(d) : d;
  if (isNaN(date.getTime())) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

export const toLocalTime = (t: string | null | undefined): string => {
  if (!t) return "";
  // accept "HH:MM" or "HH:MM:SS"
  const parts = t.split(":");
  const hh = (parts[0] || "00").padStart(2, "0");
  const mm = (parts[1] || "00").padStart(2, "0");
  const ss = (parts[2] || "00").padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
};

export const fullName = (a?: string, b?: string) =>
  [a, b].filter(Boolean).join(" ");

export const formatClock = (date: Date) =>
  date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
