export default function PropertyMap({ lat, lng }) {
  const latitude = Number(lat);
  const longitude = Number(lng);

  // Only render when both coordinates are present and valid
  if (
    lat == null || lng == null || lat === "" || lng === "" ||
    !Number.isFinite(latitude) || !Number.isFinite(longitude)
  ) {
    return null;
  }

  const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const embedUrl = `https://www.google.com/maps/embed/v1/place?key=${key}&q=${latitude},${longitude}&zoom=15`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

  return (
    <section className="panel map">
      <h2>Location</h2>
      {key ? (
        <iframe
          title="Property location"
          src={embedUrl}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <p className="muted">Map unavailable: Google Maps API key is not configured.</p>
      )}
      <a href={directionsUrl} target="_blank" rel="noopener noreferrer">Get Directions</a>
    </section>
  );
}