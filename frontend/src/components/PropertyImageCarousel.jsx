import { useState } from "react";
import { parsePhotos } from "./photos";

export default function PropertyImageCarousel({ photos: raw, alt }) {
  const photos = parsePhotos(raw);
  const [index, setIndex] = useState(0);
  const [broken, setBroken] = useState({});
  const n = photos.length;

  const go = (e, dir) => {
    e.stopPropagation(); // don't trigger the card's click
    e.preventDefault();
    setIndex((i) => (i + dir + n) % n);
  };

  const src = photos[index];

  return (
    <div className="carousel">
      {src && !broken[index] ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setBroken((b) => ({ ...b, [index]: true }))}
        />
      ) : (
        <div className="no-photo">No photo available</div>
      )}
      {n > 1 && (
        <>
          <button type="button" className="arrow left" aria-label="Previous photo" onClick={(e) => go(e, -1)}>‹</button>
          <button type="button" className="arrow right" aria-label="Next photo" onClick={(e) => go(e, 1)}>›</button>
          <span className="counter">{index + 1} / {n}</span>
        </>
      )}
    </div>
  );
}