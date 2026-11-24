import { useEffect, useMemo, useState } from "react";
import { fetchProperties } from "../api/properties";
import PropertyCard from "../components/PropertyCard";
import PropertyFilters from "../components/PropertyFilters";
import Pagination from "../components/Pagination";

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
  const [result, setResult] = useState({ key: null, data: null, error: null });

  const params = useMemo(() => {
    const [sortBy, sortOrder] = sort ? sort.split(":") : [];
    return {
      ...filters,
      ...(sortBy ? { sortBy, sortOrder } : {}),
      limit: itemsPerPage,
      offset: (currentPage - 1) * itemsPerPage,
    };
  }, [filters, sort, currentPage, itemsPerPage]);

  const requestKey = JSON.stringify(params);

  useEffect(() => {
    let ignore = false;
    fetchProperties(params)
      .then((data) => { if (!ignore) setResult({ key: requestKey, data, error: null }); })
      .catch((err) => { if (!ignore) setResult({ key: requestKey, data: null, error: err.message }); });
    return () => { ignore = true; };
  }, [params, requestKey]);

  // Loading until the latest request has answered; stale answers are ignored above
  const loading = result.key !== requestKey;
  const data = loading ? null : result.data;
  const error = loading ? null : result.error;

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
  const showResults = Boolean(data) && !error;

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