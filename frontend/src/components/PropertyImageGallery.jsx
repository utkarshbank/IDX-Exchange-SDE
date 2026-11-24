import { useEffect, useRef, useState } from "react";
import { parsePhotos } from "./photos";

function Lightbox({ photos, index, onChange, onClose }) {
  const ref = useRef(null);
  const n = photos.length;

  // A div can only receive key events if it is focusable AND has focus
  useEffect(() => { ref.current?.focus(); }, []);

  const step = (d) => onChange((index + d + n) % n);

  const onKeyDown = (e) => {
    if (e.key === "Escape") onClose();
    else if (e.key === "ArrowLeft") step(-1);
    else if (e.key === "ArrowRight") step(1);
  };

  return (
    <div
      className="lightbox"
      ref={ref}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
      onClick={onClose}
      onKeyDown={onKeyDown}
    >
      <button type="button" className="lb-btn lb-close" aria-label="Close"
        onClick={(e) => { e.stopPropagation(); onClose(); }}>×</button>
      {n > 1 && (
        <button type="button" className="lb-btn lb-prev" aria-label="Previous photo"
          onClick={(e) => { e.stopPropagation(); step(-1); }}>‹</button>
      )}
      <img src={photos[index]} alt={`Photo ${index + 1} of ${n}`} onClick={(e) => e.stopPropagation()} />
      {n > 1 && (
        <button type="button" className="lb-btn lb-next" aria-label="Next photo"
          onClick={(e) => { e.stopPropagation(); step(1); }}>›</button>
      )}
      <span className="lb-counter">{index + 1} / {n}</span>
    </div>
  );
}

export default function PropertyImageGallery({ photos: raw, alt }) {
  const photos = parsePhotos(raw);
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);

  if (photos.length === 0) {
    return <div className="no-photo big">No photos available</div>;
  }

  const current = photos[index] ?? photos[0];

  return (
    <div className="gallery">
      <img className="gallery-main" src={current} alt={alt} onClick={() => setOpen(true)} />
      {photos.length > 1 && (
        <div className="thumbs">
          {photos.map((src, i) => (
            <button
              key={i}
              type="button"
              className={i === index ? "thumb active" : "thumb"}
              aria-label={`Show photo ${i + 1}`}
              onClick={() => setIndex(i)}
            >
              <img src={src} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}
      {open && (
        <Lightbox photos={photos} index={index} onChange={setIndex} onClose={() => setOpen(false)} />
      )}
    </div>
  );
}