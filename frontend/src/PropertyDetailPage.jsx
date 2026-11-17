import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchProperty } from "./api";
import { money, num } from "./format";
import PropertyImageGallery from "./PropertyImageGallery";
import PropertyMap from "./PropertyMap";
import OpenHouses from "./OpenHouses";

const yesNo = (v) => (v == null ? null : v ? "Yes" : "No");

export default function PropertyDetailPage() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError(null);
    setProperty(null);
    window.scrollTo(0, 0);

    fetchProperty(id)
      .then((p) => { if (!ignore) setProperty(p); })
      .catch((e) => { if (!ignore) setError(e.message); })
      .finally(() => { if (!ignore) setLoading(false); });

    return () => { ignore = true; };
  }, [id]);

  if (loading) return <p className="status">Loading property...</p>;

  if (error) {
    return (
      <div className="page">
        <Link to="/" className="back-link">← All listings</Link>
        <p className="status error">Error: {error}</p>
      </div>
    );
  }

  const p = property;
  const address = [p.L_Address, p.L_City, [p.L_State, p.L_Zip].filter(Boolean).join(" ")]
    .filter(Boolean)
    .join(", ");

  const details = [
    ["Property type", p.L_Type_],
    ["Status", p.L_Status],
    ["Subdivision", p.SubdivisionName],
    ["County", p.CountyOrParish],
    ["Stories", p.StoriesTotal],
    ["Lot size (sqft)", p.LotSizeSquareFeet ? num(p.LotSizeSquareFeet) : null],
    ["Cooling", p.Cooling],
    ["Heating", p.Heating],
    ["Garage", yesNo(p.GarageYN)],
    ["HOA fee", p.AssociationFee ? money(p.AssociationFee) : null],
    ["Days on market", p.DaysOnMarket],
    ["Listing ID", p.L_DisplayId],
  ].filter(([, v]) => v != null && v !== "");

  return (
    <div className="page">
      <Link to="/" className="back-link">← All listings</Link>

      <PropertyImageGallery photos={p.L_Photos} alt={p.L_Address || "Property"} />

      <div className="panel">
        <div className="price big-price">{money(p.L_SystemPrice)}</div>
        <div>{address}</div>
        <div className="stats-row">
          <span><strong>{p.L_Keyword2 ?? "–"}</strong> beds</span>
          <span><strong>{p.LM_Dec_3 ?? "–"}</strong> baths</span>
          <span><strong>{num(p.LM_Int2_3)}</strong> sqft</span>
          <span>Built <strong>{p.YearBuilt ?? "–"}</strong></span>
        </div>
      </div>

      {p.L_Remarks && (
        <section className="panel">
          <h2>Description</h2>
          <p>{p.L_Remarks}</p>
        </section>
      )}

      {details.length > 0 && (
        <section className="panel">
          <h2>Property Details</h2>
          <dl className="details-list">
            {details.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      <PropertyMap lat={p.LMD_MP_Latitude} lng={p.LMD_MP_Longitude} />
      <OpenHouses listingId={p.L_ListingID} />
    </div>
  );
}