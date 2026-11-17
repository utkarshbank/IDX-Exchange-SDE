export const money = (n) =>
  n == null || n === "" ? "Price unavailable" : `$${Number(n).toLocaleString()}`;

export const num = (n) =>
  n == null || n === "" ? "–" : Number(n).toLocaleString();

// "13:00:00" -> "1:00 PM"
export function formatTime(t) {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  if (Number.isNaN(h)) return t;
  const hour = h % 12 || 12;
  return `${hour}:${String(m || 0).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

// "2026-09-19" -> "Saturday, September 19, 2026"
export function formatDate(ymd) {
  const [y, m, d] = String(ymd).split("-").map(Number);
  if (!y || !m || !d) return String(ymd);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });
}