const toLocalDate = (d) => {
  if (!d) return "";
  const date = typeof d === "string" ? new Date(d) : d;
  if (isNaN(date.getTime())) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};
const toLocalTime = (t) => {
  if (!t) return "";
  const parts = t.split(":");
  const hh = (parts[0] || "00").padStart(2, "0");
  const mm = (parts[1] || "00").padStart(2, "0");
  const ss = (parts[2] || "00").padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
};
const formatClock = (date) => date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
export {
  toLocalTime as a,
  formatClock as f,
  toLocalDate as t
};
