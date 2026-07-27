import React from "react";
import { VisualBouquetCartData } from "@/lib/cartUtils";
import { getFlowerTokenPosition } from "@/lib/builderAssetMap";

interface BouquetCartPreviewProps {
  bouquetData: VisualBouquetCartData;
  className?: string;
}

/**
 * Renders a small thumbnail preview of a visual bouquet for cart display
 */
export function BouquetCartPreview({
  bouquetData,
  className = "",
}: BouquetCartPreviewProps) {
  const { flowers, wrapper, ribbon, stemCount } = bouquetData;

  return (
    <div
      className={`relative w-full h-full bg-gradient-to-b from-[#F5F0E8] to-[#EAE0D5] rounded-lg overflow-hidden flex items-center justify-center ${className}`}
    >
      <svg
        viewBox="0 0 200 240"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Wrapper (Paper) */}
        {wrapper && (
          <ellipse
            cx="100"
            cy="160"
            rx="45"
            ry="35"
            fill={wrapper.color}
            opacity="0.9"
          />
        )}

        {/* Ribbon */}
        {ribbon && (
          <>
            <path
              d="M 70 155 Q 100 170 130 155"
              stroke={ribbon.color}
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M 70 165 Q 100 180 130 165"
              stroke={ribbon.color}
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              opacity="0.7"
            />
          </>
        )}

        {/* Flowers (simplified dots for thumbnail) */}
        {flowers.slice(0, 5).map((flower, idx) => {
          const position = getFlowerTokenPosition(idx, flowers.length, 100);
          const size = 8 + Math.random() * 4;

          return (
            <circle
              key={idx}
              cx={position.x}
              cy={position.y}
              r={size}
              fill={`hsl(${(idx * 60) % 360}, 70%, 50%)`}
              opacity="0.85"
            />
          );
        })}

        {/* Stems indicator */}
        {stemCount > 0 && (
          <text
            x="100"
            y="220"
            textAnchor="middle"
            fontSize="10"
            fill="#8B6F47"
            fontWeight="bold"
          >
            {stemCount}
          </text>
        )}
      </svg>
    </div>
  );
}
