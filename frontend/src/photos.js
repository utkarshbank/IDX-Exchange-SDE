export function parsePhotos(raw) {
  if (!raw) return [];
  let data = raw;
  if (typeof raw === "string") {
    try {
      data = JSON.parse(raw);
    } catch {
      return [];
    }
  }
  if (!Array.isArray(data)) return [];
  return data
    .map((item) => {
      if (typeof item === "string") return item;
      if (item && typeof item === "object") {
        return item.url || item.uri || item.MediaURL || item.src || null;
      }
      return null;
    })
    .filter(Boolean);
}