import { useCallback, useSyncExternalStore } from "react";

const KEY = "idx-favorites";
const listeners = new Set();

let lastRaw = null;
let lastValue = [];

function parse(raw) {
  try {
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data.map(String) : [];
  } catch {
    return [];
  }
}

// Returns the same array object until localStorage actually changes
function getSnapshot() {
  let raw = null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {}
  if (raw !== lastRaw) {
    lastRaw = raw;
    lastValue = parse(raw);
  }
  return lastValue;
}

function subscribe(listener) {
  listeners.add(listener);
  window.addEventListener("storage", listener); // changes from other tabs
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function write(next) {
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {}
  listeners.forEach((l) => l());
}

export function useFavorites() {
  const favorites = useSyncExternalStore(subscribe, getSnapshot);

  const isFavorite = useCallback((id) => favorites.includes(String(id)), [favorites]);

  const toggle = useCallback((id) => {
    const key = String(id);
    const current = getSnapshot();
    write(current.includes(key) ? current.filter((x) => x !== key) : [...current, key]);
  }, []);

  return { favorites, isFavorite, toggle, count: favorites.length };
}