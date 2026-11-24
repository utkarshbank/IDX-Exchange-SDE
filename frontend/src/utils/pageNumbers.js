export function getPageNumbers(current, total) {
  // Few pages: show them all, no ellipsis
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  // Near the start: 1 2 3 4 5 … last
  if (current <= 4) {
    return [1, 2, 3, 4, 5, "…", total];
  }
  // Near the end: 1 … last-4 … last
  if (current >= total - 3) {
    return [1, "…", total - 4, total - 3, total - 2, total - 1, total];
  }
  // Middle: 1 … c-1 c c+1 … last
  return [1, "…", current - 1, current, current + 1, "…", total];
}