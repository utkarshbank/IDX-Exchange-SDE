import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchProperty } from "../api/properties";
import { useFavorites } from "../hooks/useFavorites";
import PropertyCard from "../components/PropertyCard";

export default function FavoritesPage() {
  const { favorites } = useFavorites();
  // Snapshot of what was saved when the page opened; later changes only filter the list below
  const [initialIds] = useState(favorites);
  const [loaded, setLoaded] = useState(null);

  useEffect(() => {
    let ignore = false;
    Promise.allSettled(initialIds.map((id) => fetchProperty(id))).then((results) => {
      if (ignore) return;
      setLoaded(results.filter((r) => r.status === "fulfilled").map((r) => r.value));
    });
    return () => { ignore = true; };
  }, [initialIds]);

  if (initialIds.length > 0 && loaded === null) {
    return <p className="status">Loading favorites...</p>;
  }

  const visible = (loaded ?? []).filter((p) => favorites.includes(String(p.L_ListingID)));

  return (
    <div className="page">
      <h1>Favorites ({favorites.length})</h1>
      {visible.length === 0 ? (
        <p className="status">
          No favorites yet. Tap the heart on a listing to save it. <Link to="/">Browse listings</Link>
        </p>
      ) : (
        <div className="grid">
          {visible.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      )}
    </div>
  );
}