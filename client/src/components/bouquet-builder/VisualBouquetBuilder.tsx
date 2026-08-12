import { RotateCcw, ShoppingBag } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { addToCart, CUSTOM_VISUAL_BOUQUET_PRODUCT_ID } from "@/lib/cartUtils";
import {
  BUILDER_RIBBONS,
  BUILDER_WRAPPERS,
  getRibbonOption,
  getWrapperOption,
  isPhaseOneBuilderProduct,
} from "./builderAssets";
import { BouquetPreviewCanvas } from "./BouquetPreviewCanvas";
import { FlowerBuilderCard } from "./FlowerBuilderCard";
import { formatBuilderPrice, getBuilderProductPrice } from "./builderPricing";
import type {
  BuilderProduct,
  BuilderWrapMode,
  SelectedBuilderFlower,
} from "./builderTypes";

interface VisualBouquetBuilderProps {
  products: BuilderProduct[];
  isLoading: boolean;
  language: "ka" | "en";
  onCartOpen?: () => void;
}

const PHASE_ONE_PRODUCT_ORDER = [
  690003, 30001, 90001, 90003, 90008, 180001, 90011, 90017, 60001,
];

const MAX_BOUQUET_STEMS = 24;

export function VisualBouquetBuilder({
  products,
  isLoading,
  language,
  onCartOpen,
}: VisualBouquetBuilderProps) {
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [wrapperId, setWrapperId] = useState("cream");
  const [ribbonId, setRibbonId] = useState("burgundy");
  const [wrapMode, setWrapMode] = useState<BuilderWrapMode>("paper");

  const builderProducts = useMemo(() => {
    const order = new Map(
      PHASE_ONE_PRODUCT_ORDER.map((id, index) => [id, index])
    );
    return products
      .filter(isPhaseOneBuilderProduct)
      .sort(
        (left, right) =>
          (order.get(left.id) ?? Number.MAX_SAFE_INTEGER) -
          (order.get(right.id) ?? Number.MAX_SAFE_INTEGER)
      );
  }, [products]);

  const selectedFlowers = useMemo<SelectedBuilderFlower[]>(
    () =>
      builderProducts
        .map(product => ({
          product,
          quantity: quantities[product.id] ?? 0,
          unitPrice: getBuilderProductPrice(product),
        }))
        .filter(item => item.quantity > 0),
    [builderProducts, quantities]
  );

  const selectedStemCount = selectedFlowers.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  const hasUnavailableSelection = selectedFlowers.some(
    item => item.product.isAvailable === false
  );
  const total = selectedFlowers.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );
  const selectedWrapper = getWrapperOption(wrapperId);
  const selectedRibbon = getRibbonOption(ribbonId);

  const resetBuilder = () => {
    setQuantities({});
    setWrapperId("cream");
    setRibbonId("burgundy");
    setWrapMode("paper");
  };

  const handleAddToCart = () => {
    if (selectedStemCount === 0) {
      toast.error(
        language === "ka" ? "გთხოვთ, აირჩიოთ ყვავილები" : "Choose your flowers"
      );
      return;
    }

    if (hasUnavailableSelection) {
      toast.error(
        language === "ka"
          ? "არჩეულ თაიგულში ერთ-ერთი ყვავილი აღარ არის მარაგში. გთხოვთ, განაახლოთ არჩევანი."
          : "One of the selected flowers is no longer in stock. Please update your bouquet."
      );
      return;
    }

    const configurationId = [
      "visual",
      wrapMode,
      wrapMode === "paper" ? wrapperId : "no-wrapper",
      ribbonId,
      selectedFlowers
        .map(item => `${item.product.id}x${item.quantity}`)
        .join(","),
    ].join(":");

    addToCart({
      productId: CUSTOM_VISUAL_BOUQUET_PRODUCT_ID,
      name:
        language === "ka"
          ? "თქვენ მიერ შექმნილი ვიზუალური თაიგული"
          : "Custom visual bouquet",
      price: total,
      quantity: 1,
      unitType:
        language === "ka"
          ? `${selectedStemCount} ღერო`
          : `${selectedStemCount} stems`,
      selectedVariantId: configurationId,
      bouquetType: 'visual',
      previewImage: "/manus-storage/flowers-boutique-bouquet-preview.png", // Visual bouquet preview
      customData: {
        type: "visual-bouquet",
        flowers: selectedFlowers.map(item => ({
          productId: item.product.id,
          nameKa: item.product.nameKa,
          nameEn: item.product.nameEn,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
        wrapMode,
        wrapper:
          wrapMode === "paper"
            ? {
                id: selectedWrapper.id,
                nameKa: selectedWrapper.nameKa,
                nameEn: selectedWrapper.nameEn,
                color: selectedWrapper.color,
              }
            : null,
        ribbon: {
          id: selectedRibbon.id,
          nameKa: selectedRibbon.nameKa,
          nameEn: selectedRibbon.nameEn,
          color: selectedRibbon.color,
        },
        stemCount: selectedStemCount,
        totalPrice: total,
      },
    });

    toast.success(
      language === "ka" ? "თაიგული კალათაში დაემატა" : "Bouquet added to cart"
    );
    onCartOpen?.();
  };

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(390px,0.92fr)_minmax(520px,1.08fr)] xl:gap-8">
      <section className="order-1 lg:sticky lg:top-28 lg:col-start-1 lg:row-start-1">
        <div className="rounded-[28px] border border-[#eadfce] bg-white p-4 shadow-[0_18px_55px_rgba(83,61,40,0.08)] sm:p-5">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a47740]">
                {language === "ka"
                  ? "ვიზუალური კონსტრუქტორი"
                  : "Visual Builder"}
              </p>
              <h2
                className="mt-1 text-2xl font-medium text-[#2c2925]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {language === "ka"
                  ? "თაიგულის წინასწარი ნახვა"
                  : "Bouquet preview"}
              </h2>
            </div>
            <button
              type="button"
              onClick={resetBuilder}
              disabled={
                selectedStemCount === 0 &&
                wrapperId === "cream" &&
                ribbonId === "burgundy" &&
                wrapMode === "paper"
              }
              className="inline-flex h-9 items-center gap-2 rounded-full border border-[#e6d8c5] px-3 text-xs font-medium text-[#7a6a5a] transition hover:bg-[#f7f1e8] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              {language === "ka" ? "თავიდან დაწყება" : "Reset"}
            </button>
          </div>

          <BouquetPreviewCanvas
            wrapperId={wrapperId}
            ribbonId={ribbonId}
            selectedFlowers={selectedFlowers}
            wrapMode={wrapMode}
            language={language}
          />

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <fieldset
              disabled={wrapMode === "ribbonOnly"}
              className={
                wrapMode === "ribbonOnly"
                  ? "opacity-40 transition-opacity"
                  : "transition-opacity"
              }
            >
              <legend className="mb-2.5 text-sm font-semibold text-[#342f2a]">
                {language === "ka" ? "შეფუთვის ფერი" : "Wrapper color"}
              </legend>
              <div className="flex flex-wrap gap-2.5">
                {BUILDER_WRAPPERS.map(option => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setWrapperId(option.id)}
                    className={`grid h-11 w-11 place-items-center rounded-full border shadow-sm transition duration-200 ${
                      wrapperId === option.id
                        ? "scale-110 border-[#7e5d42] ring-2 ring-[#f4e5cf] ring-offset-2 shadow-[0_5px_14px_rgba(126,93,66,0.25)]"
                        : "border-black/10 hover:scale-105 hover:shadow-[0_4px_12px_rgba(83,61,40,0.16)]"
                    }`}
                    style={{ backgroundColor: option.color }}
                    title={language === "ka" ? option.nameKa : option.nameEn}
                    aria-label={
                      language === "ka" ? option.nameKa : option.nameEn
                    }
                    aria-pressed={wrapperId === option.id}
                  />
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="mb-2.5 text-sm font-semibold text-[#342f2a]">
                {language === "ka" ? "ლენტის ფერი" : "Ribbon color"}
              </legend>
              <div className="flex flex-wrap gap-2.5">
                {BUILDER_RIBBONS.map(option => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setRibbonId(option.id)}
                    className={`grid h-11 w-11 place-items-center rounded-full border shadow-sm transition duration-200 ${
                      ribbonId === option.id
                        ? "scale-110 border-[#7e5d42] ring-2 ring-[#f4e5cf] ring-offset-2 shadow-[0_5px_14px_rgba(126,93,66,0.25)]"
                        : "border-black/10 hover:scale-105 hover:shadow-[0_4px_12px_rgba(83,61,40,0.16)]"
                    }`}
                    style={{ backgroundColor: option.color }}
                    title={language === "ka" ? option.nameKa : option.nameEn}
                    aria-label={
                      language === "ka" ? option.nameKa : option.nameEn
                    }
                    aria-pressed={ribbonId === option.id}
                  />
                ))}
              </div>
            </fieldset>
          </div>

          <fieldset className="mt-5 border-t border-[#eee4d8] pt-4">
            <legend className="mb-2.5 text-sm font-semibold text-[#342f2a]">
              {language === "ka" ? "შეფუთვის ტიპი" : "Wrapping style"}
            </legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {(
                [
                  {
                    id: "paper",
                    nameKa: "შეფუთვით",
                    nameEn: "With wrapping",
                    detailKa: "არჩეული ფერის შესაფუთი ქაღალდი",
                    detailEn: "Selected paper color",
                  },
                  {
                    id: "ribbonOnly",
                    nameKa: "შეფუთვის გარეშე",
                    nameEn: "No wrapping",
                    detailKa: "მხოლოდ ლენტით",
                    detailEn: "Ribbon only",
                  },
                ] as const
              ).map(option => (
                <label
                  key={option.id}
                  className={`relative flex cursor-pointer items-center gap-3 rounded-2xl border px-3.5 py-3 transition ${
                    wrapMode === option.id
                      ? "border-[#a87539] bg-[#f8efe3] shadow-[0_0_0_2px_rgba(168,117,57,0.08)]"
                      : "border-[#e6d9c7] bg-[#fffdf9] hover:border-[#d6c0a1]"
                  }`}
                >
                  <input
                    type="radio"
                    name="bouquet-wrap-mode"
                    value={option.id}
                    checked={wrapMode === option.id}
                    onChange={() => setWrapMode(option.id)}
                    className="h-4 w-4 accent-[#9a6b32]"
                  />
                  <span className="min-w-0">
                    <span className="block text-xs font-semibold text-[#342f2a]">
                      {language === "ka" ? option.nameKa : option.nameEn}
                    </span>
                    <span className="mt-0.5 block text-[11px] text-[#8f8377]">
                      {language === "ka" ? option.detailKa : option.detailEn}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>
      </section>

      <section className="order-2 flex flex-col gap-6 lg:col-start-2 lg:row-start-1">
        <aside
          className="order-2 rounded-[24px] border border-[#d6c2a4] bg-[#30291f] p-5 text-[#fffaf2] shadow-[0_18px_45px_rgba(53,40,27,0.14)]"
          aria-live="polite"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d9bb8b]">
                {language === "ka" ? "თქვენი თაიგული" : "Your bouquet"}
              </p>
              <p className="mt-1 text-sm text-white/65">
                {language === "ka"
                  ? `${selectedStemCount} ღერო`
                  : `${selectedStemCount} stems`}
              </p>
            </div>
            <p
              className="text-3xl font-semibold text-[#f4d199]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {formatBuilderPrice(total)}
            </p>
          </div>

          <div className="mt-4 border-t border-white/12 pt-4">
            {selectedFlowers.length > 0 ? (
              <div className="max-h-32 space-y-2 overflow-y-auto pr-1 text-xs">
                {selectedFlowers.map(item => (
                  <div
                    key={item.product.id}
                    className="flex items-center justify-between gap-4 text-white/78"
                  >
                    <span className="truncate">
                      {language === "ka"
                        ? item.product.nameKa
                        : item.product.nameEn}{" "}
                      × {item.quantity}
                    </span>
                    <span className="shrink-0 tabular-nums text-[#f0d2a3]">
                      {formatBuilderPrice(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs leading-5 text-white/55">
                {language === "ka"
                  ? "ყვავილებისა და მათი რაოდენობის არჩევის შემდეგ აქ შეჯამება გამოჩნდება."
                  : "Your selection summary will appear here."}
              </p>
            )}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-white/12 pt-4 text-xs text-white/64">
            <div>
              <span className="block text-white/40">
                {language === "ka" ? "შეფუთვა" : "Wrapper"}
              </span>
              <span className="mt-1 block text-white/82">
                {wrapMode === "ribbonOnly"
                  ? language === "ka"
                    ? "შეფუთვის გარეშე · მხოლოდ ლენტი"
                    : "No wrapping · ribbon only"
                  : language === "ka"
                    ? selectedWrapper.nameKa
                    : selectedWrapper.nameEn}
              </span>
            </div>
            <div>
              <span className="block text-white/40">
                {language === "ka" ? "ლენტი" : "Ribbon"}
              </span>
              <span className="mt-1 block text-white/82">
                {language === "ka"
                  ? selectedRibbon.nameKa
                  : selectedRibbon.nameEn}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={selectedStemCount === 0}
            className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#f4d199] px-5 py-3 text-sm font-bold text-[#30291f] shadow-[0_10px_28px_rgba(0,0,0,0.16)] transition hover:bg-[#ffe0aa] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ShoppingBag className="h-4.5 w-4.5" />
            {language === "ka" ? "კალათაში დამატება" : "Add to cart"}
          </button>
        </aside>

        <div className="order-1 rounded-[28px] border border-[#eadfce] bg-white p-4 shadow-[0_18px_55px_rgba(83,61,40,0.07)] sm:p-5">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a47740]">
                {language === "ka" ? "ცალკეული ყვავილები" : "Single stems"}
              </p>
              <h2
                className="mt-1 text-2xl font-medium text-[#2c2925]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {language === "ka"
                  ? "აირჩიეთ ცალკეული ყვავილები"
                  : "Choose individual flowers"}
              </h2>
            </div>
            <div className="text-right">
              <span className="inline-flex rounded-full bg-[#f5eee4] px-3 py-1 text-xs font-semibold text-[#86633b]">
                {language === "ka"
                  ? `${builderProducts.length} სახეობა`
                  : `${builderProducts.length} types`}
              </span>
              <span className="mt-1 block text-[10px] text-[#9a9188]">
                {language === "ka"
                  ? `მაქსიმუმ ${MAX_BOUQUET_STEMS} ღერო`
                  : `Max ${MAX_BOUQUET_STEMS} stems`}
              </span>
            </div>
          </div>

          {isLoading ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-[112px] animate-pulse rounded-2xl border border-[#eee4d8] bg-[#faf7f2]"
                />
              ))}
            </div>
          ) : builderProducts.length > 0 ? (
            <div className="max-h-[760px] overflow-y-auto pr-1 sm:grid sm:grid-cols-2 sm:gap-3 [&>*]:snap-start [&>*]:scroll-smooth" style={{ scrollBehavior: 'smooth' }}>
              {builderProducts.map(product => (
                <div key={product.id} className="mb-3 last:mb-0 sm:mb-0">
                  <FlowerBuilderCard
                    product={product}
                    quantity={quantities[product.id] ?? 0}
                    language={language}
                    canIncrement={selectedStemCount < MAX_BOUQUET_STEMS}
                    onQuantityChange={quantity =>
                      setQuantities(current => {
                        const currentQuantity = current[product.id] ?? 0;
                        if (
                          product.isAvailable === false &&
                          quantity > currentQuantity
                        ) {
                          return current;
                        }
                        if (
                          quantity > currentQuantity &&
                          selectedStemCount >= MAX_BOUQUET_STEMS
                        ) {
                          return current;
                        }

                        return {
                          ...current,
                          [product.id]: quantity,
                        };
                      })
                    }
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[#ddcdb7] bg-[#faf7f2] px-5 py-12 text-center text-sm text-[#8d8177]">
              {language === "ka"
                ? "ცალკეული ყვავილები ვერ მოიძებნა."
                : "Visual Builder flowers were not found."}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
