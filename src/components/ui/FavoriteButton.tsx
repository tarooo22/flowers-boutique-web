"use client";

import { useStore } from "@/lib/store";
import { HeartIcon } from "./Icons";

interface Props {
  productId: string;
  className?: string;
  floating?: boolean;
}

/** Wishlist toggle. `floating` renders the round white chip used on product cards. */
export function FavoriteButton({ productId, className = "", floating = true }: Props) {
  const { isFavorite, toggleFavorite, hydrated } = useStore();
  const active = hydrated && isFavorite(productId);

  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(productId);
      }}
      className={
        floating
          ? `grid h-9 w-9 place-items-center rounded-full bg-white/90 text-[var(--ink)] shadow-[0_2px_8px_rgba(26,26,26,0.10)] backdrop-blur transition hover:bg-white ${className}`
          : `grid h-11 w-11 place-items-center rounded-full border border-[var(--line-strong)] text-[var(--ink)] transition hover:border-[var(--ink)] ${className}`
      }
    >
      <HeartIcon
        className="h-[18px] w-[18px]"
        style={active ? { fill: "var(--action)", stroke: "var(--action)" } : undefined}
      />
    </button>
  );
}
