import { useState } from "react";

interface FlowerImageProps {
  src?: string | null;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * FlowerImage — renders a product image with a branded Flower’s Boutique SVG fallback.
 * - Never shows alt text on the page (role="presentation" on fallback).
 * - Falls back gracefully if the src URL fails to load.
 */
export default function FlowerImage({ src, alt = "", className = "", style }: FlowerImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={className}
        style={{
          background: "linear-gradient(135deg, #FDF0EA 0%, #F5E6DC 50%, #EDD5C5 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          ...style,
        }}
        role="presentation"
        aria-hidden="true"
      >
        <svg
          width="64"
          height="64"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ opacity: 0.45 }}
        >
          {/* Stem */}
          <line x1="32" y1="52" x2="32" y2="36" stroke="#C4603A" strokeWidth="2" strokeLinecap="round" />
          {/* Leaf */}
          <path d="M32 44 Q38 40 40 34 Q34 36 32 44Z" fill="#8B9E6E" opacity="0.7" />
          {/* Center circle */}
          <circle cx="32" cy="28" r="6" fill="#C4603A" opacity="0.8" />
          {/* Petals */}
          <ellipse cx="32" cy="16" rx="5" ry="8" fill="#E8A87C" opacity="0.75" />
          <ellipse cx="32" cy="40" rx="5" ry="8" fill="#E8A87C" opacity="0.75" />
          <ellipse cx="20" cy="28" rx="8" ry="5" fill="#E8A87C" opacity="0.75" />
          <ellipse cx="44" cy="28" rx="8" ry="5" fill="#E8A87C" opacity="0.75" />
          <ellipse cx="23.5" cy="19.5" rx="5" ry="8" fill="#E8A87C" opacity="0.6" transform="rotate(-45 23.5 19.5)" />
          <ellipse cx="40.5" cy="19.5" rx="5" ry="8" fill="#E8A87C" opacity="0.6" transform="rotate(45 40.5 19.5)" />
          <ellipse cx="23.5" cy="36.5" rx="5" ry="8" fill="#E8A87C" opacity="0.6" transform="rotate(45 23.5 36.5)" />
          <ellipse cx="40.5" cy="36.5" rx="5" ry="8" fill="#E8A87C" opacity="0.6" transform="rotate(-45 40.5 36.5)" />
        </svg>
        <span
          style={{
            marginTop: "8px",
            fontSize: "10px",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#C4603A",
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 500,
            opacity: 0.7,
          }}
        >
          Flower’s Boutique
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      onError={() => setFailed(true)}
      loading="lazy"
    />
  );
}
