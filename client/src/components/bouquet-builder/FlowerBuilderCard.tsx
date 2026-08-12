import { Minus, Plus } from "lucide-react";
import {
  BUILDER_FALLBACK_FLOWER_ASSET,
  getBuilderFlowerAsset,
} from "./builderAssets";
import { formatBuilderPrice, getBuilderProductPrice } from "./builderPricing";
import type { BuilderProduct } from "./builderTypes";

interface FlowerBuilderCardProps {
  product: BuilderProduct;
  quantity: number;
  language: "ka" | "en";
  canIncrement: boolean;
  onQuantityChange: (quantity: number) => void;
}

export function FlowerBuilderCard({
  product,
  quantity,
  language,
  canIncrement,
  onQuantityChange,
}: FlowerBuilderCardProps) {
  const asset = getBuilderFlowerAsset(product);
  const available = product.isAvailable !== false;
  const price = getBuilderProductPrice(product);
  const variants = Array.isArray(product.variants) ? product.variants : [];
  const colorVariants = variants
    .filter(variant => typeof variant?.colorHex === "string" && variant.colorHex)
    .slice(0, 4);

  return (
    <article
      className={`group grid min-h-[112px] grid-cols-[68px_minmax(0,1fr)] gap-3 rounded-2xl border p-3 transition duration-200 ${
        available
          ? quantity > 0
            ? "border-[#b98a53] bg-[#fdf7ee] shadow-[0_10px_24px_rgba(120,83,38,0.12)] ring-1 ring-[#b98a53]/20"
            : "border-[#e9ddcc] bg-white hover:-translate-y-0.5 hover:border-[#d8c3a4] hover:shadow-[0_10px_24px_rgba(83,61,40,0.09)]"
          : "border-[#eadfda] bg-[#f8f5f2] opacity-72"
      }`}
    >
      <div className="flex h-[86px] items-center justify-center overflow-hidden rounded-xl bg-[#faf7f2]">
        <img
          src={asset.path}
          alt=""
          aria-hidden="true"
          draggable={false}
        className="h-[80px] w-[54px] select-none object-contain transition duration-200 group-hover:scale-105"
          onError={event => {
            if (event.currentTarget.src.endsWith(BUILDER_FALLBACK_FLOWER_ASSET)) return;
            event.currentTarget.src = BUILDER_FALLBACK_FLOWER_ASSET;
          }}
        />
      </div>

      <div className="flex min-w-0 flex-col justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-2 text-sm font-semibold leading-5 text-[#2c2925]">
              {language === "ka" ? product.nameKa : product.nameEn}
            </h3>
            <span
              className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${
                available ? "bg-[#5ca873]" : "bg-[#dd7b83]"
              }`}
              title={
                available
                  ? language === "ka"
                    ? "მარაგშია"
                    : "In stock"
                  : language === "ka"
                    ? "მარაგში არ არის"
                    : "Out of stock"
              }
            />
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-[#9a6b32]">
              {product.priceOnRequest
                ? language === "ka"
                  ? "ფასი მოთხოვნით"
                  : "Price on request"
                : formatBuilderPrice(price)}
            </span>
            <span className="text-[11px] text-[#9a9188]">
              / {language === "ka" ? "ღერო" : "stem"}
            </span>
          </div>

          {colorVariants.length > 0 && (
            <div className="mt-2 flex items-center gap-1.5" aria-label="Available colors">
              {colorVariants.map((variant, index) => (
                <span
                  key={`${product.id}-${variant.id ?? index}`}
                  className="h-3.5 w-3.5 rounded-full border border-black/10"
                  style={{ backgroundColor: variant.colorHex ?? "#f3e6dc" }}
                  title={
                    language === "ka"
                      ? variant.colorNameKa ?? ""
                      : variant.colorNameEn ?? ""
                  }
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          <span
            className={`text-[11px] font-medium ${
              available ? "text-[#4f9a66]" : "text-[#cf6671]"
            }`}
          >
            {available
              ? language === "ka"
                ? "მარაგშია"
                : "In stock"
              : language === "ka"
                ? "მარაგში არ არის"
                : "Out of stock"}
          </span>

          <div className="flex min-h-11 items-center rounded-full border border-[#dfd1bd] bg-[#fffdf9] p-0.5">
            <button
              type="button"
              onClick={() => onQuantityChange(Math.max(0, quantity - 1))}
              disabled={!available || quantity === 0}
              className="grid h-11 w-11 place-items-center rounded-full text-[#77695d] transition hover:bg-[#f2eadf] disabled:cursor-not-allowed disabled:opacity-30"
              aria-label={
                language === "ka"
                  ? `${product.nameKa}: რაოდენობის შემცირება`
                  : `Decrease ${product.nameEn}`
              }
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="min-w-8 text-center text-sm font-semibold tabular-nums text-[#2c2925]">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => onQuantityChange(Math.min(24, quantity + 1))}
              disabled={!available || quantity >= 24 || !canIncrement}
              className="grid h-11 w-11 place-items-center rounded-full text-[#8f6535] transition hover:bg-[#f2eadf] disabled:cursor-not-allowed disabled:opacity-30"
              aria-label={
                language === "ka"
                  ? `${product.nameKa}: რაოდენობის გაზრდა`
                  : `Increase ${product.nameEn}`
              }
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
