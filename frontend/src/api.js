export async function fetchProperties(params = {}) {
  const query = new URLSearchParams(params).toString();
  let res;
  try {
    res = await fetch(`/api/properties${query ? `?${query}` : ""}`);
  } catch {
    throw new Error("Could not reach the server. Is the backend running?");
  }
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body.error) message = body.error;
    } catch {}
    throw new Error(message);
  }
  return res.json();
}
