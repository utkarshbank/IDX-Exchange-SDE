function getFirstPhoto(raw) {
  if (!raw) return null;
  let data = raw;
  if (typeof raw === "string") {
    try {
      data = JSON.parse(raw);
    } catch {
      return null;
    }
  }
  if (!Array.isArray(data) || data.length === 0) return null;
  const first = data[0];
  if (typeof first === "string") return first || null;
  if (first && typeof first === "object") {
    return first.url || first.uri || first.MediaURL || first.src || null;
  }
  return null;
}

const money = (n) =>
  n == null ? "Price unavailable" : `$${Number(n).toLocaleString()}`;

export default function PropertyCard({ property }) {
  const photo = getFirstPhoto(property.L_Photos);
  const sqft = property.LM_Int2_3;

  return (
    <div className="card">
      {photo ? (
        <img
          src={photo}
          alt={property.L_Address || "Property"}
          onError={(e) => {
            e.currentTarget.style.display = "none";
            e.currentTarget.nextSibling.style.display = "flex";
          }}
        />
      ) : null}
      <div className="no-photo" style={{ display: photo ? "none" : "flex" }}>
        No photo available
      </div>
      <div className="card-body">
        <div className="price">{money(property.L_SystemPrice)}</div>
        <div>{property.L_Address || "Address unavailable"}</div>
        <div className="muted">
          {[property.L_City, property.L_State].filter(Boolean).join(", ")}
        </div>
        <div className="stats">
          {property.L_Keyword2 ?? "–"} bd · {property.LM_Dec_3 ?? "–"} ba ·{" "}
          {sqft ? Number(sqft).toLocaleString() : "–"} sqft
        </div>
      </div>
    </div>
  );
}