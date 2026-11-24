import { useEffect, useState } from "react";
import { fetchProperties } from "./api";
import PropertyCard from "./PropertyCard";
import PropertyFilters from "./PropertyFilters";
import Pagination from "./Pagination";

const SORT_OPTIONS = [
  { value: "", label: "Default" },
  { value: "L_SystemPrice:asc", label: "Price: low to high" },
  { value: "L_SystemPrice:desc", label: "Price: high to low" },
  { value: "ListingContractDate:desc", label: "Date listed: newest" },
  { value: "ListingContractDate:asc", label: "Date listed: oldest" },
  { value: "LM_Int2_3:desc", label: "Square footage: largest" },
  { value: "LM_Int2_3:asc", label: "Square footage: smallest" },
  { value: "L_Keyword2:desc", label: "Beds: most" },
  { value: "L_Keyword2:asc", label: "Beds: fewest" },
];

export default function ListingsPage() {
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError(null);

    const [sortBy, sortOrder] = sort ? sort.split(":") : [];

    fetchProperties({
      ...filters,
      ...(sortBy ? { sortBy, sortOrder } : {}),
      limit: itemsPerPage,
      offset: (currentPage - 1) * itemsPerPage,
    })
      .then((res) => { if (!ignore) setData(res); })
      .catch((err) => { if (!ignore) setError(err.message); })
      .finally(() => { if (!ignore) setLoading(false); });

    return () => { ignore = true; };
  }, [filters, sort, currentPage, itemsPerPage]);

  // New filters reset the page AND the sort
  const handleSearch = (f) => {
    setFilters(f);
    setSort("");
    setCurrentPage(1);
  };
  const handleClear = () => {
    setFilters({});
    setSort("");
    setCurrentPage(1);
  };
  // Changing the sort goes back to page 1; changing the page keeps the sort
  const handleSortChange = (value) => {
    setSort(value);
    setCurrentPage(1);
  };
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const totalPages = data ? Math.ceil(data.total / itemsPerPage) : 0;
  const start = data ? data.offset + 1 : 0;
  const end = data ? data.offset + data.results.length : 0;
  const showResults = !loading && !error && data;

  return (
    <div className="page">
      <h1>Listings</h1>
      <PropertyFilters onSearch={handleSearch} onClear={handleClear} />

      <div className="toolbar">
        <p className="muted">
          {showResults && data.results.length > 0
            ? `Showing ${start.toLocaleString()}-${end.toLocaleString()} of ${data.total.toLocaleString()} properties`
            : "\u00A0"}
        </p>
        <label className="sort">
          Sort by
          <select value={sort} onChange={(e) => handleSortChange(e.target.value)}>
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </label>
      </div>

      {loading && <p className="status">Loading properties...</p>}
      {error && <p className="status error">Error: {error}</p>}

      {showResults &&
        (data.results.length === 0 ? (
          <p className="status">No properties found. Try adjusting or clearing your filters.</p>
        ) : (
          <>
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
        ))}
    </div>
  );
}