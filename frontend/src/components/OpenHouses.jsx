import { useEffect, useState } from "react";
import { fetchOpenHouses } from "./api";
import { formatDate, formatTime } from "./format";

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
  const [rows, setRows] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    setRows(null);
    setError(null);
    fetchOpenHouses(listingId)
      .then((r) => { if (!ignore) setRows(r); })
      .catch((e) => { if (!ignore) setError(e.message); });
    return () => { ignore = true; };
  }, [listingId]);

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