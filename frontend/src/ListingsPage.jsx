import { useEffect, useState } from "react";
import { fetchProperties } from "./api";
import PropertyCard from "./PropertyCard";
import PropertyFilters from "./PropertyFilters";
import Pagination from "./Pagination";

export default function ListingsPage() {
  const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError(null);

    fetchProperties({
      ...filters,
      limit: itemsPerPage,
      offset: (currentPage - 1) * itemsPerPage,
    })
      .then((res) => { if (!ignore) setData(res); })
      .catch((err) => { if (!ignore) setError(err.message); })
      .finally(() => { if (!ignore) setLoading(false); });

    return () => { ignore = true; };
  }, [filters, currentPage, itemsPerPage]);

  // New filters always go back to page 1
  const handleSearch = (f) => {
    setFilters(f);
    setCurrentPage(1);
  };
  const handleClear = () => {
    setFilters({});
    setCurrentPage(1);
  };
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const totalPages = data ? Math.ceil(data.total / itemsPerPage) : 0;
  const start = data ? data.offset + 1 : 0;
  const end = data ? data.offset + data.results.length : 0;

  return (
    <div className="page">
      <h1>Listings</h1>
      <PropertyFilters onSearch={handleSearch} onClear={handleClear} />

      {loading && <p className="status">Loading properties...</p>}
      {error && <p className="status error">Error: {error}</p>}

      {!loading && !error && data && (
        data.results.length === 0 ? (
          <p className="status">No properties found. Try adjusting or clearing your filters.</p>
        ) : (
          <>
            <p className="muted">
              Showing {start.toLocaleString()}-{end.toLocaleString()} of {data.total.toLocaleString()} properties
            </p>
            <div className="grid">
              {data.results.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )
      )}
    </div>
  );
}