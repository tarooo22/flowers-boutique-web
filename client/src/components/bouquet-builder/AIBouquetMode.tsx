import FlowerImage from "@/components/FlowerImage";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc";
import {
  Check,
  Flower2,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  Sparkles,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AIFlowerPreviewStage } from "./AIFlowerPreviewStage";
import { formatBuilderPrice, getBuilderProductPrice } from "./builderPricing";
import type { BuilderProduct } from "./builderTypes";

interface AIBouquetModeProps {
  language: "ka" | "en";
  products: BuilderProduct[];
  isLoading: boolean;
}

interface AISelectedFlower {
  product: BuilderProduct;
  quantity: number;
  unitPrice: number;
}

type FlowerFilter = "all" | "available" | "selected";

const MAX_AI_FLOWER_TYPES = 12;
const MAX_STEMS_PER_FLOWER = 24;

export function AIBouquetMode({
  language,
  products,
  isLoading,
}: AIBouquetModeProps) {
  const [selectedFlowers, setSelectedFlowers] = useState<AISelectedFlower[]>(
    []
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(
    null
  );
  const [generatedForFingerprint, setGeneratedForFingerprint] = useState<
    string | null
  >(null);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [flowerFilter, setFlowerFilter] = useState<FlowerFilter>("all");

  const generateImageMutation = trpc.bouquet.generateImage.useMutation();
  const addToCartMutation = trpc.cart.add.useMutation();

  const total = useMemo(
    () =>
      selectedFlowers.reduce(
        (sum, item) => sum + item.unitPrice * item.quantity,
        0
      ),
    [selectedFlowers]
  );

  const totalStemCount = useMemo(
    () => selectedFlowers.reduce((sum, item) => sum + item.quantity, 0),
    [selectedFlowers]
  );
  const hasUnavailableSelection = selectedFlowers.some(
    item => item.product.isAvailable === false
  );

  const selectedProductIds = useMemo(
    () => new Set(selectedFlowers.map(item => item.product.id)),
    [selectedFlowers]
  );

  const availableProductCount = useMemo(
    () => products.filter(product => product.isAvailable !== false).length,
    [products]
  );

  const selectionFingerprint = useMemo(
    () =>
      selectedFlowers
        .map(item => `${item.product.id}:${item.quantity}`)
        .sort()
        .join("|"),
    [selectedFlowers]
  );

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase();

    return products.filter(product => {
      const matchesSearch =
        query.length === 0 ||
        product.nameKa.toLocaleLowerCase().includes(query) ||
        product.nameEn.toLocaleLowerCase().includes(query);
      const matchesFilter =
        flowerFilter === "all" ||
        (flowerFilter === "available" && product.isAvailable !== false) ||
        (flowerFilter === "selected" && selectedProductIds.has(product.id));

      return matchesSearch && matchesFilter;
    });
  }, [flowerFilter, products, searchQuery, selectedProductIds]);

  const resultMatchesSelection =
    Boolean(generatedImageUrl) &&
    generatedForFingerprint === selectionFingerprint &&
    selectionFingerprint.length > 0;

  const invalidateGeneratedResult = () => {
    setGeneratedImageUrl(null);
    setGeneratedForFingerprint(null);
    setGenerationError(null);
  };

  const updateQuantity = (product: BuilderProduct, delta: number) => {
    if (isGenerating) return;

    const existing = selectedFlowers.find(
      item => item.product.id === product.id
    );

    if (product.isAvailable === false && delta > 0) return;
    if (!existing && delta <= 0) return;
    if (existing && delta > 0 && existing.quantity >= MAX_STEMS_PER_FLOWER) {
      return;
    }

    if (
      !existing &&
      delta > 0 &&
      selectedFlowers.length >= MAX_AI_FLOWER_TYPES
    ) {
      toast.error(
        language === "ka"
          ? "AI თაიგულისთვის შეგიძლიათ აირჩიოთ მაქსიმუმ 12 სახეობის ყვავილი"
          : "Choose up to 12 flower types for an AI bouquet"
      );
      return;
    }

    invalidateGeneratedResult();
    setSelectedFlowers(current => {
      const currentItem = current.find(item => item.product.id === product.id);

      if (!currentItem && delta > 0) {
        return [
          ...current,
          {
            product,
            quantity: 1,
            unitPrice: getBuilderProductPrice(product),
          },
        ];
      }

      if (!currentItem) return current;
      const nextQuantity = currentItem.quantity + delta;

      if (nextQuantity <= 0) {
        return current.filter(item => item.product.id !== product.id);
      }

      return current.map(item =>
        item.product.id === product.id
          ? {
              ...item,
              quantity: Math.min(MAX_STEMS_PER_FLOWER, nextQuantity),
            }
          : item
      );
    });
  };

  const removeFlower = (productId: number) => {
    if (isGenerating || !selectedProductIds.has(productId)) return;

    invalidateGeneratedResult();
    setSelectedFlowers(current =>
      current.filter(item => item.product.id !== productId)
    );
  };

  const handleGenerateImage = async () => {
    if (selectedFlowers.length === 0) {
      toast.error(
        language === "ka"
          ? "გთხოვთ, აირჩიოთ მინიმუმ ერთი ყვავილი"
          : "Select at least one flower"
      );
      return;
    }

    const requestFingerprint = selectionFingerprint;
    setGeneratedImageUrl(null);
    setGeneratedForFingerprint(null);
    setGenerationError(null);
    setIsGenerating(true);

    try {
      const result = await generateImageMutation.mutateAsync({
        flowers: selectedFlowers.map(item => ({
          nameKa: item.product.nameKa,
          nameEn: item.product.nameEn,
          quantity: item.quantity,
        })),
      });

      if (result?.imageUrl) {
        setGeneratedImageUrl(result.imageUrl);
        setGeneratedForFingerprint(requestFingerprint);
      } else {
        const message =
          language === "ka"
            ? "ფოტო ვერ შეიქმნა — სცადეთ ხელახლა"
            : "The image could not be created — please try again";
        setGenerationError(message);
        toast.error(message);
      }
    } catch (error) {
      console.error("Image generation error:", error);
      const message =
        language === "ka"
          ? "AI ფოტოს შექმნისას შეცდომა მოხდა — სცადეთ ხელახლა"
          : "Something went wrong while creating the AI image — try again";
      setGenerationError(message);
      toast.error(message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGeneratedImageError = () => {
    setGeneratedImageUrl(null);
    setGeneratedForFingerprint(null);
    setGenerationError(
      language === "ka"
        ? "შექმნილი ფოტო ვერ ჩაიტვირთა — სცადეთ ხელახლა"
        : "The generated image could not be loaded — please try again"
    );
  };

  const handleAddAIToCart = () => {
    if (selectedFlowers.length === 0) {
      toast.error(
        language === "ka"
          ? "კალათაში დამატებისთვის აირჩიეთ მინიმუმ ერთი ყვავილი."
          : "Please select at least one flower to add to cart"
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

    if (!resultMatchesSelection) {
      toast.error(
        language === "ka"
          ? "ჯერ შექმენით არჩეული შემადგენლობისთვის AI ფოტო"
          : "Generate an AI image for this selection first"
      );
      return;
    }

    const bouquetDetails = {
      type: "custom-ai-bouquet",
      flowers: selectedFlowers.map(item => ({
        productId: item.product.id,
        nameKa: item.product.nameKa,
        nameEn: item.product.nameEn,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        imageUrl: item.product.imageUrl,
      })),
      generatedImageUrl,
      totalPrice: total,
    };

    addToCartMutation.mutate(
      {
        productId: 999998,
        quantity: 1,
        customData: JSON.stringify(bouquetDetails),
        generatedImageUrl: generatedImageUrl || undefined,
        bouquetType: 'ai',
      },
      {
        onSuccess: () => {
          toast.success(
            language === "ka"
              ? "AI თაიგული კალათაში დაემატა"
              : "AI bouquet added to cart"
          );
          setSelectedFlowers([]);
          invalidateGeneratedResult();
        },
        onError: () => {
          toast.error(
            language === "ka"
              ? "თაიგულის კალათაში დამატება ვერ მოხერხდა"
              : "Could not add the bouquet to cart"
          );
        },
      }
    );
  };

  const filterOptions: Array<{
    id: FlowerFilter;
    label: string;
    count: number;
  }> = [
    {
      id: "all",
      label: language === "ka" ? "ყველა" : "All",
      count: products.length,
    },
    {
      id: "available",
      label: language === "ka" ? "მარაგში" : "Available",
      count: availableProductCount,
    },
    {
      id: "selected",
      label: language === "ka" ? "არჩეული" : "Selected",
      count: selectedFlowers.length,
    },
  ];

  return (
    <div className="builder-ai-workspace grid items-start gap-6 lg:grid-cols-[minmax(0,1.12fr)_minmax(430px,0.88fr)] xl:gap-8">
      <div className="builder-ai-preview-wrap lg:sticky lg:top-[92px]">
        <AIFlowerPreviewStage
          language={language}
          products={products}
          selectedFlowers={selectedFlowers}
          isGenerating={isGenerating}
          generatedImageUrl={resultMatchesSelection ? generatedImageUrl : null}
          generationError={generationError}
          total={total}
          onGeneratedImageError={handleGeneratedImageError}
        />
      </div>

      <section className="builder-ai-selection-card overflow-hidden rounded-[30px] border border-[#e8dccb] bg-[#fffdf9] shadow-[0_24px_65px_rgba(83,61,40,0.09)]">
        <div className="p-4 sm:p-5">
          <header className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a87539]">
                {language === "ka" ? "ცალკეული ყვავილები" : "Single stems"}
              </p>
              <h2
                className="mt-1.5 text-[28px] font-medium leading-none text-[#2c2925]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {language === "ka"
                  ? "შექმენით თქვენი AI თაიგული"
                  : "Create your AI bouquet"}
              </h2>
              <p className="mt-2 max-w-md text-xs leading-5 text-[#8d8175]">
                {language === "ka"
                  ? "აირჩიეთ ყვავილები და მიუთითეთ მათი რაოდენობა — ცვლილებები მყისიერად გამოჩნდება წინასწარ ხედში."
                  : "Choose flowers and quantities — every change appears instantly in the preview."}
              </p>
            </div>
            <div className="shrink-0 rounded-2xl border border-[#eadfce] bg-[#f8f1e7] px-3 py-2 text-center">
              <span className="block text-lg font-bold leading-none text-[#8c6030]">
                {selectedFlowers.length}
              </span>
              <span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.12em] text-[#9a8c7d]">
                {language === "ka" ? "არჩეული" : "selected"}
              </span>
            </div>
          </header>

          {selectedFlowers.length === 0 && (
            <div className="mt-4 rounded-2xl border border-[#eadfce] bg-[#f8f1e7] p-3">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8c6030]">{language === "ka" ? "შთაგონება" : "Find your starting point"}</p>
              <div className="grid grid-cols-3 gap-2">
                {['/flower-assets/products/8346.webp','/flower-assets/products/8319.webp','/flower-assets/editorial/pink-roses.webp'].map((src) => <img key={src} src={src} alt="" loading="lazy" className="aspect-[4/3] w-full rounded-xl object-cover" />)}
              </div>
            </div>
          )}

          <div className="relative mt-5">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9d8f80]" />
            <input
              type="search"
              value={searchQuery}
              onChange={event => setSearchQuery(event.target.value)}
              placeholder={
                language === "ka" ? "ყვავილის ძიება..." : "Search flowers..."
              }
              className="h-12 w-full rounded-2xl border border-[#e5d8c6] bg-white pl-11 pr-11 text-sm text-[#332e29] outline-none transition placeholder:text-[#aea398] focus:border-[#b98a53] focus:ring-4 focus:ring-[#b98a53]/10"
              aria-label={
                language === "ka" ? "ყვავილის ძიება" : "Search flowers"
              }
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-[#8d8175] transition hover:bg-[#f3eadf]"
                aria-label={
                  language === "ka"
                    ? "ძიების ველის გასუფთავება"
                    : "Clear search"
                }
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div
            className="mt-3 flex gap-2 overflow-x-auto pb-1"
            role="group"
            aria-label={
              language === "ka" ? "ყვავილების ფილტრები" : "Flower filters"
            }
          >
            {filterOptions.map(option => {
              const isActive = flowerFilter === option.id;

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setFlowerFilter(option.id)}
                  aria-pressed={isActive}
                  className={cn(
                    "inline-flex h-9 shrink-0 items-center gap-2 rounded-full border px-3.5 text-xs font-semibold transition",
                    isActive
                      ? "border-[#3a3229] bg-[#3a3229] text-white shadow-sm"
                      : "border-[#e5d8c6] bg-white text-[#74685c] hover:border-[#c9aa82] hover:bg-[#faf5ed]"
                  )}
                >
                  {option.label}
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.5 text-[9px] tabular-nums",
                      isActive
                        ? "bg-white/15 text-white"
                        : "bg-[#f2e9dc] text-[#896d4f]"
                    )}
                  >
                    {option.count}
                  </span>
                </button>
              );
            })}
          </div>

          {selectedFlowers.length > 0 && (
            <div className="mt-5 rounded-[20px] border border-[#e8d9c5] bg-[#f8f1e7]/75 p-3">
              <div className="mb-2.5 flex items-center justify-between gap-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8c6b47]">
                  {language === "ka"
                    ? "თქვენ მიერ არჩეული ყვავილები"
                    : "Your flower palette"}
                </p>
                <p className="text-[10px] font-medium text-[#9b8d7f]">
                  {totalStemCount} {language === "ka" ? "ღერო" : "stems"}
                </p>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-1">
                {selectedFlowers.map(item => {
                  const name =
                    language === "ka"
                      ? item.product.nameKa
                      : item.product.nameEn;

                  return (
                    <div
                      key={item.product.id}
                      className="flex min-w-[164px] max-w-[190px] shrink-0 items-center gap-2 rounded-xl border border-[#e0cfb8] bg-white p-1.5 pr-1.5 shadow-sm"
                    >
                      <FlowerImage
                        src={item.product.imageUrl}
                        alt=""
                        className="h-10 w-10 shrink-0 rounded-lg object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[11px] font-semibold text-[#342f29]">
                          {name}
                        </p>
                        <p className="mt-0.5 text-[10px] font-bold text-[#9a6b32]">
                          ×{item.quantity}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFlower(item.product.id)}
                        disabled={isGenerating}
                        className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[#a36b67] transition hover:bg-[#f8e9e6] disabled:cursor-not-allowed disabled:opacity-35"
                        aria-label={
                          language === "ka"
                            ? `${name} — არჩევანიდან ამოღება`
                            : `Remove ${name} from selection`
                        }
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mb-3 mt-5 flex items-center justify-between gap-3">
            <p className="text-xs font-semibold text-[#5d544c]">
              {language === "ka"
                ? `${filteredProducts.length} ყვავილი`
                : `${filteredProducts.length} flowers`}
            </p>
            <p className="text-[10px] text-[#9c9186]">
              {language === "ka"
                ? `მაქსიმუმ ${MAX_AI_FLOWER_TYPES} სახეობა`
                : `Up to ${MAX_AI_FLOWER_TYPES} types`}
            </p>
          </div>

          {isLoading ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-[126px] animate-pulse rounded-[18px] border border-[#eee4d8] bg-[#faf7f2]"
                />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="grid min-h-44 place-items-center rounded-[20px] border border-dashed border-[#dfd1bf] bg-[#fbf8f3] px-6 py-8 text-center">
              <div>
                <span className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-[#f0e5d5] text-[#9a6b32]">
                  <Flower2 className="h-4.5 w-4.5" />
                </span>
                <p className="mt-3 text-sm font-semibold text-[#4c443c]">
                  {language === "ka"
                    ? "შესაბამისი ყვავილი ვერ მოიძებნა"
                    : "No matching flowers found"}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setFlowerFilter("all");
                  }}
                  className="mt-2 text-xs font-semibold text-[#9a6b32] underline decoration-[#d7b98f] underline-offset-4"
                >
                  {language === "ka"
                    ? "ყველა ყვავილის ნახვა"
                    : "View all flowers"}
                </button>
              </div>
            </div>
          ) : (
            <div className="max-h-[570px] overflow-y-auto pr-1 sm:grid sm:grid-cols-2 sm:gap-3 [&>*]:snap-start [&>*]:scroll-smooth" style={{ scrollBehavior: 'smooth' }}>
              {filteredProducts.map(product => {
                const selected = selectedFlowers.find(
                  item => item.product.id === product.id
                );
                const unitPrice = getBuilderProductPrice(product);
                const isAvailable = product.isAvailable !== false;
                const productName =
                  language === "ka" ? product.nameKa : product.nameEn;

                return (
                  <div key={product.id} className="mb-3 last:mb-0 sm:mb-0">
                    <Card
                      className={cn(
                        "relative overflow-hidden rounded-[18px] border p-2.5 shadow-none transition duration-200",
                      selected
                        ? "border-[#c79c64] bg-[#fdf8ef] shadow-[0_8px_24px_rgba(158,113,58,0.1)] ring-1 ring-[#c79c64]/20"
                        : "border-[#e9ddcc] bg-white hover:-translate-y-0.5 hover:border-[#d7c2a5] hover:shadow-[0_8px_22px_rgba(83,61,40,0.07)]",
                      !isAvailable && "opacity-55"
                    )}
                  >
                    {selected && (
                      <span className="absolute right-2 top-2 z-10 grid h-6 w-6 place-items-center rounded-full border-2 border-white bg-[#9a6b32] text-white shadow-sm">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                    )}

                    <div className="grid grid-cols-[76px_minmax(0,1fr)] gap-3">
                      <div className="h-[100px] overflow-hidden rounded-[14px] bg-[#f7f1e8]">
                        <FlowerImage
                          src={product.imageUrl}
                          alt={productName}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="flex min-w-0 flex-col">
                        <div className="pr-6">
                          <p className="line-clamp-2 text-xs font-semibold leading-[1.15rem] text-[#2f2b27]">
                            {productName}
                          </p>
                          <p className="mt-1 text-xs font-bold text-[#9a6b32]">
                            {formatBuilderPrice(unitPrice)}
                          </p>
                          <p
                            className={cn(
                              "mt-1 inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-[0.08em]",
                              isAvailable ? "text-[#4d9b72]" : "text-[#c46b78]"
                            )}
                          >
                            <span
                              className={cn(
                                "h-1.5 w-1.5 rounded-full",
                                isAvailable ? "bg-[#5aae7e]" : "bg-[#d97a86]"
                              )}
                            />
                            {isAvailable
                              ? language === "ka"
                                ? "მარაგშია"
                                : "Available"
                              : language === "ka"
                                ? "მარაგში არ არის"
                                : "Unavailable"}
                          </p>
                        </div>

                        <div className="mt-auto flex items-center justify-end gap-1.5 pt-2">
                          <button
                            type="button"
                            onClick={() => updateQuantity(product, -1)}
                            disabled={!selected || isGenerating}
                            className="builder-ai-quantity-button grid h-11 w-11 place-items-center rounded-full border border-[#ddcdb9] bg-white text-[#6f6256] transition hover:border-[#b99568] hover:bg-[#faf4eb] disabled:cursor-not-allowed disabled:opacity-30"
                            aria-label={
                              language === "ka"
                                ? `${productName} — რაოდენობის შემცირება`
                                : `Decrease ${productName} quantity`
                            }
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="min-w-6 text-center text-xs font-bold tabular-nums text-[#3c342d]">
                            {selected?.quantity ?? 0}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(product, 1)}
                            disabled={
                              !isAvailable ||
                              isGenerating ||
                              Boolean(
                                selected &&
                                  selected.quantity >= MAX_STEMS_PER_FLOWER
                              ) ||
                              (!selected &&
                                selectedFlowers.length >= MAX_AI_FLOWER_TYPES)
                            }
                            className="builder-ai-quantity-button grid h-11 w-11 place-items-center rounded-full border border-[#c9a77a] bg-[#f6ead9] text-[#8e602e] transition hover:bg-[#eed9bc] disabled:cursor-not-allowed disabled:opacity-30"
                            aria-label={
                              language === "ka"
                                ? `${productName} — რაოდენობის გაზრდა`
                                : `Increase ${productName} quantity`
                            }
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                      </div>
                    </Card>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="border-t border-white/10 bg-[#30291f] p-4 text-white sm:p-5">
          <div className="flex items-end justify-between gap-5">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "h-2 w-2 rounded-full",
                    resultMatchesSelection
                      ? "bg-[#7bc397]"
                      : selectedFlowers.length > 0
                        ? "bg-[#e3bb7d]"
                        : "bg-[#83786b]"
                  )}
                />
                <p className="text-xs font-semibold text-[#fffaf2]">
                  {resultMatchesSelection
                    ? language === "ka"
                      ? "AI ფოტო მზად არის"
                      : "AI image ready"
                    : language === "ka"
                      ? "თქვენი თაიგული"
                      : "Your bouquet"}
                </p>
              </div>
              <p className="mt-1.5 text-[11px] leading-5 text-[#b7aa9c]">
                {selectedFlowers.length}{" "}
                {language === "ka" ? "სახეობა" : "types"} • {totalStemCount}{" "}
                {language === "ka" ? "ღერო" : "stems"}
              </p>
            </div>
            <p
              className="text-3xl font-semibold leading-none text-[#e8c991]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {formatBuilderPrice(total)}
            </p>
          </div>

          {generationError && (
            <div
              className="mt-4 rounded-xl border border-[#e6a7a0]/25 bg-[#8f4f49]/20 px-3 py-2.5 text-[11px] leading-5 text-[#f0c7c2]"
              role="alert"
            >
              {generationError}
            </div>
          )}

          {resultMatchesSelection ? (
            <div className="mt-4 grid gap-2 sm:grid-cols-[1.25fr_0.75fr]">
              <Button
                onClick={handleAddAIToCart}
                disabled={addToCartMutation.isPending || selectedFlowers.length === 0}
                className="h-12 rounded-xl bg-[#d9b274] font-bold text-[#30291f] hover:bg-[#e5c48f] disabled:bg-white/10 disabled:text-white/45"
              >
                <ShoppingBag className="h-4 w-4" />
                {addToCartMutation.isPending
                  ? language === "ka"
                    ? "კალათას ემატება..."
                    : "Adding..."
                  : language === "ka"
                    ? "კალათაში დამატება"
                    : "Add to cart"}
              </Button>
              <Button
                onClick={handleGenerateImage}
                disabled={isGenerating}
                variant="outline"
                className="h-12 rounded-xl border-white/20 bg-white/[0.04] text-white hover:bg-white/10 hover:text-white"
              >
                <Sparkles className="h-4 w-4 text-[#e8c991]" />
                {language === "ka" ? "ხელახლა შექმნა" : "Create again"}
              </Button>
            </div>
          ) : (
            <Button
              onClick={handleGenerateImage}
              disabled={selectedFlowers.length === 0 || isGenerating}
              className="mt-4 h-12 w-full rounded-xl bg-[#d9b274] font-bold text-[#30291f] hover:bg-[#e5c48f] disabled:bg-white/10 disabled:text-white/45"
            >
              <Sparkles className="h-4 w-4" />
              {isGenerating
                ? language === "ka"
                  ? "AI თქვენს თაიგულს ქმნის..."
                  : "AI is creating your bouquet..."
                : selectedFlowers.length === 0
                  ? language === "ka"
                    ? "გთხოვთ, აირჩიოთ მინიმუმ ერთი ყვავილი"
                    : "Choose at least 1 flower"
                  : language === "ka"
                    ? "AI ფოტოს შექმნა"
                    : "Generate AI photo"}
            </Button>
          )}

          <p className="mt-3 text-center text-[9px] leading-4 text-[#8f8376]">
            {language === "ka"
              ? "AI ფოტოს შექმნისას არჩევანს დროებით ვეღარ შეცვლით, რათა შედეგი ზუსტად თქვენს შემადგენლობას დაემთხვეს."
              : "Selection is briefly locked while generating so the image always matches your composition."}
          </p>
        </div>
      </section>
    </div>
  );
}
