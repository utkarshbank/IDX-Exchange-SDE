import { useEffect, useState } from "react";
import { fetchProperties } from "./api";
import PropertyCard from "./PropertyCard";
import PropertyFilters from "./PropertyFilters";

export default function ListingsPage() {
  const [filters, setFilters] = useState({});
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError(null);

    fetchProperties({ ...filters, limit: 20, offset: 0 })
      .then((res) => { if (!ignore) setData(res); })
      .catch((err) => { if (!ignore) setError(err.message); })
      .finally(() => { if (!ignore) setLoading(false); });

    return () => { ignore = true; };
  }, [filters]);

  return (
    <div className="page">
      <h1>Listings</h1>
      <PropertyFilters
        onSearch={(f) => setFilters(f)}
        onClear={() => setFilters({})}
      />

      {loading && <p className="status">Loading properties...</p>}
      {error && <p className="status error">Error: {error}</p>}

      {!loading && !error && data && (
        data.results.length === 0 ? (
          <p className="status">No properties found. Try adjusting or clearing your filters.</p>
        ) : (
          <>
            <p className="muted">
              Showing {data.results.length} of {data.total.toLocaleString()} properties
            </p>
            <div className="grid">
              {data.results.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          </>
        )
      )}
    </div>
  );
}