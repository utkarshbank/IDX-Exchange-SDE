async function request(url) {
  let res;
  try {
    res = await fetch(url);
  } catch {
    throw new Error("Could not reach the server. Is the backend running?");
  }
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body.error) message = body.error;
    } catch { /* safe to ignore, falls back to defaults */ }
    throw new Error(message);
  }
  return res.json();
}

export function fetchProperties(params = {}) {
  const clean = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== "" && v != null)
  );
  const query = new URLSearchParams(clean).toString();
  return request(`/api/properties${query ? `?${query}` : ""}`);
}

export function fetchProperty(id) {
  return request(`/api/properties/${encodeURIComponent(id)}`);
}

export function fetchOpenHouses(id) {
  return request(`/api/properties/${encodeURIComponent(id)}/openhouses`);
}