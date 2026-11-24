import { useEffect, useState } from "react";
import { fetchOpenHouses } from "../api/properties";
import { formatDate, formatTime } from "../utils/format";

function parseAllData(raw) {
  if (!raw) return {};
  if (typeof raw === "object") return raw;
  try {
    return JSON.parse(raw) || {};
  } catch {
    return {};
  }
}

export default function OpenHouses({ listingId }) {
  const [result, setResult] = useState({ id: null, rows: null, error: null });

  useEffect(() => {
    let ignore = false;
    fetchOpenHouses(listingId)
      .then((rows) => { if (!ignore) setResult({ id: listingId, rows, error: null }); })
      .catch((e) => { if (!ignore) setResult({ id: listingId, rows: null, error: e.message }); });
    return () => { ignore = true; };
  }, [listingId]);

  const loading = result.id !== listingId;
  const rows = loading ? null : result.rows;
  const error = loading ? null : result.error;

  return (
    <section className="panel">
      <h2>Open Houses</h2>
      {error && <p className="error">Could not load open houses: {error}</p>}
      {!error && rows === null && <p className="muted">Loading open houses...</p>}
      {rows && rows.length === 0 && <p className="muted">No open houses scheduled</p>}
      {rows && rows.map((oh) => {
        const extra = parseAllData(oh.all_data);
        // all_data holds a plain "YYYY-MM-DD" date, so no timezone shifting
        const date = extra.OpenHouseDate || (oh.API_OH_StartDate || "").slice(0, 10);
        const remarks = extra.OpenHouseRemarks;
        return (
          <div className="oh" key={oh.id}>
            <strong>{date ? formatDate(date) : "Date to be announced"}</strong>
            <div>{formatTime(oh.OH_StartTime)} – {formatTime(oh.OH_EndTime)}</div>
            {remarks && <p className="muted">{remarks}</p>}
          </div>
        );
      })}
    </section>
  );
}