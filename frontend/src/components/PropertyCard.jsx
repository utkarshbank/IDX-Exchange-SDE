import { useNavigate } from "react-router-dom";
import PropertyImageCarousel from "./PropertyImageCarousel";
import { useFavorites } from "../hooks/useFavorites";
import { money, num } from "../utils/format";

export default function PropertyCard({ property }) {
  const navigate = useNavigate();
  const { isFavorite, toggle } = useFavorites();
  const id = property.L_ListingID;
  const favorited = isFavorite(id);

  const open = () => navigate(`/property/${encodeURIComponent(id)}`);

  return (
    <div
      className="card"
      role="link"
      tabIndex={0}
      onClick={open}
      onKeyDown={(e) => {
        // only when the card itself is focused, not a button inside it
        if (e.target === e.currentTarget && e.key === "Enter") open();
      }}
    >
      <button
        type="button"
        className={favorited ? "heart active" : "heart"}
        aria-pressed={favorited}
        aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
        onClick={(e) => {
          e.stopPropagation(); // don't navigate to the detail page
          toggle(id);
        }}
      >
        {favorited ? "♥" : "♡"}
      </button>

      <PropertyImageCarousel photos={property.L_Photos} alt={property.L_Address || "Property"} />
      <div className="card-body">
        <div className="price">{money(property.L_SystemPrice)}</div>
        <div>{property.L_Address || "Address unavailable"}</div>
        <div className="muted">
          {[property.L_City, property.L_State].filter(Boolean).join(", ")}
        </div>
        <div className="stats">
          {property.L_Keyword2 ?? "–"} bd · {property.LM_Dec_3 ?? "–"} ba · {num(property.LM_Int2_3)} sqft
        </div>
      </div>
    </div>
  );
}