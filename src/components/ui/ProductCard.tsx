"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types";
import { useStore } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { defaultVariant } from "@/lib/catalog";
import { focusFor } from "@/lib/imageFocus";
import { FavoriteButton } from "./FavoriteButton";
import { Price } from "./Price";
import { PlusIcon } from "./Icons";

interface Props {
  product: Product;
  priority?: boolean;
  sizes?: string;
}

/** Shared product card — reproduces the reference card geometry (3:4 media, meta below). */
export function ProductCard({
  product: base,
  priority = false,
  sizes = "(max-width:640px) 50vw, (max-width:1024px) 33vw, 288px",
}: Props) {
  const { addToCart, withOverrides } = useStore();
  const { t } = useI18n();
  const product = withOverrides(base);
  const onSale = product.compareAt && product.compareAt > product.price;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex min-w-0 flex-col transition-transform duration-300 hover:-translate-y-1"
      aria-label={product.name}
    >
      <div className="card-media relative aspect-[3/4] overflow-hidden rounded-[10px] bg-[var(--surface-warm)] transition-shadow duration-300 group-hover:shadow-[var(--shadow-float)]">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes={sizes}
          priority={priority}
          unoptimized
          className="object-cover"
          style={{ objectPosition: focusFor(product.images[0]) }}
        />

        {/* badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {onSale ? (
            <span className="rounded-full bg-[var(--action)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
              Sale
            </span>
          ) : null}
          {product.isNew ? (
            <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[var(--ink)] backdrop-blur">
              New
            </span>
          ) : null}
          {!product.available ? (
            <span className="rounded-full bg-[var(--ink)]/85 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
              {t("common.soldOut")}
            </span>
          ) : null}
        </div>

        {/* wishlist */}
        <div className="absolute right-3 top-3">
          <FavoriteButton productId={product.id} />
        </div>

        {/* quick add */}
        {product.available ? (
          <button
            type="button"
            aria-label={`${t("common.addToCart")} — ${product.name}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart(product.id, defaultVariant(product).id, 1);
            }}
            className="absolute bottom-3 right-3 grid h-9 w-9 translate-y-1 place-items-center rounded-full bg-[var(--ink)] text-white opacity-0 shadow-[0_4px_14px_rgba(26,26,26,0.25)] transition-all duration-200 hover:bg-[var(--action)] group-hover:translate-y-0 group-hover:opacity-100 max-md:translate-y-0 max-md:opacity-100"
          >
            <PlusIcon className="h-[18px] w-[18px]" />
          </button>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col pt-3">
        <h3 className="break-words text-[12.5px] font-semibold uppercase leading-snug tracking-[0.03em] text-[var(--ink)] transition-colors group-hover:text-[var(--action-deep)]">
          {product.name}
        </h3>
        {product.subtitle ? (
          <p className="mt-1 truncate text-[12px] leading-snug text-[var(--muted)]">
            {product.subtitle}
          </p>
        ) : null}
        <div className="mt-1.5">
          <Price value={product.price} compareAt={product.compareAt} />
        </div>
      </div>
    </Link>
  );
}
