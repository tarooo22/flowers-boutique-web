import FlowerImage from "@/components/FlowerImage";
import { AlertCircle, Check, Sparkles, WandSparkles } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { formatBuilderPrice } from "./builderPricing";
import type { BuilderProduct } from "./builderTypes";

interface AIPreviewFlower {
  product: BuilderProduct;
  quantity: number;
}

interface AIFlowerPreviewStageProps {
  language: "ka" | "en";
  products: BuilderProduct[];
  selectedFlowers: AIPreviewFlower[];
  isGenerating: boolean;
  generatedImageUrl: string | null;
  generationError: string | null;
  total: number;
  onGeneratedImageError: () => void;
}

const MAX_PREVIEW_FLOWERS = 8;

const GENERATION_MESSAGES = {
  ka: [
    "ფერთა ჰარმონიის შერჩევა",
    "თაიგულის ფორმის აწყობა",
    "ფოტოს დამუშავება",
  ],
  en: [
    "Balancing the colour palette",
    "Composing the bouquet shape",
    "Rendering your bouquet",
  ],
};

export function AIFlowerPreviewStage({
  language,
  products,
  selectedFlowers,
  isGenerating,
  generatedImageUrl,
  generationError,
  total,
  onGeneratedImageError,
}: AIFlowerPreviewStageProps) {
  const shouldReduceMotion = useReducedMotion();
  const [generationStep, setGenerationStep] = useState(0);

  useEffect(() => {
    if (!isGenerating) {
      setGenerationStep(0);
      return;
    }

    const intervalId = window.setInterval(() => {
      setGenerationStep(
        current => (current + 1) % GENERATION_MESSAGES[language].length
      );
    }, 2600);

    return () => window.clearInterval(intervalId);
  }, [isGenerating, language]);

  const stemCount = useMemo(
    () => selectedFlowers.reduce((sum, flower) => sum + flower.quantity, 0),
    [selectedFlowers]
  );

  const previewFlowers = useMemo<AIPreviewFlower[]>(() => {
    if (selectedFlowers.length > 0) {
      return selectedFlowers.slice(0, MAX_PREVIEW_FLOWERS);
    }

    return products
      .filter(
        product => product.isAvailable !== false && Boolean(product.imageUrl)
      )
      .slice(0, 7)
      .map(product => ({ product, quantity: 0 }));
  }, [products, selectedFlowers]);

  const hiddenFlowerCount = Math.max(
    0,
    selectedFlowers.length - MAX_PREVIEW_FLOWERS
  );
  const hasSelection = selectedFlowers.length > 0;
  const hasResult = Boolean(generatedImageUrl);
  const messages = GENERATION_MESSAGES[language];

  const stageStyle = {
    "--ai-orbit-radius": "clamp(96px, 26vw, 174px)",
  } as CSSProperties;

  return (
    <section
      className="builder-ai-stage overflow-hidden rounded-[30px] border border-[#463c30] bg-[#2c261f] p-3 shadow-[0_30px_80px_rgba(44,38,31,0.2)] sm:p-4"
      aria-busy={isGenerating}
      aria-label={
        language === "ka"
          ? "AI თაიგულის ცოცხალი წინასწარი ნახვა"
          : "Live AI bouquet preview"
      }
    >
      <header className="flex items-start justify-between gap-4 px-2 pb-4 pt-1 sm:px-3 sm:pb-5 sm:pt-2">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#d9bb8b]">
            <span className="h-px w-5 bg-[#d9bb8b]/70" />
            {language === "ka" ? "AI ფლორისტის სტუდია" : "AI florist studio"}
          </div>
          <h2
            className="mt-2 text-[26px] font-medium leading-none text-[#fffaf2] sm:text-[30px]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {language === "ka"
              ? "კომპოზიციის ცოცხალი წინასწარი ნახვა"
              : "Live composition preview"}
          </h2>
        </div>

        <span
          className={`mt-0.5 inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] ${
            isGenerating
              ? "border-[#d9bb8b]/40 bg-[#d9bb8b]/10 text-[#f1d49f]"
              : hasResult
                ? "border-[#79bc96]/35 bg-[#79bc96]/10 text-[#a8ddb9]"
                : "border-white/10 bg-white/[0.06] text-[#d8cec2]"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              isGenerating
                ? "bg-[#e7bd78]"
                : hasResult
                  ? "bg-[#79bc96]"
                  : "bg-[#b9a894]"
            }`}
          />
          {isGenerating
            ? language === "ka"
              ? "AI ქმნის"
              : "AI creating"
            : hasResult
              ? language === "ka"
                ? "მზადაა"
                : "Ready"
              : language === "ka"
                ? "წინასწარი ხედი"
                : "Live preview"}
        </span>
      </header>

      <div
        className="relative min-h-[370px] overflow-hidden rounded-[24px] border border-[#efe2cf] bg-[#f3eadf] sm:min-h-[470px] lg:min-h-[540px]"
        style={stageStyle}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_43%,rgba(255,255,255,0.98)_0%,rgba(255,251,244,0.92)_29%,rgba(239,225,207,0.72)_67%,rgba(224,205,181,0.46)_100%)]" />
        <div className="pointer-events-none absolute left-1/2 top-[43%] h-[64%] w-[64%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#c9a873]/20" />
        <div className="pointer-events-none absolute left-1/2 top-[43%] h-[45%] w-[45%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[#b9925a]/20" />
        <div className="pointer-events-none absolute inset-x-10 bottom-7 h-10 rounded-[50%] bg-[#8e6c45]/10 blur-xl" />

        <AnimatePresence mode="wait">
          {hasResult ? (
            <motion.div
              key="generated-result"
              initial={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.97, filter: "blur(8px)" }
              }
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0 }}
              transition={{ duration: shouldReduceMotion ? 0.15 : 0.48 }}
              className="absolute inset-0 z-20"
            >
              <img
                src={generatedImageUrl ?? ""}
                alt={
                  language === "ka"
                    ? "AI-ის მიერ შექმნილი თაიგული"
                    : "AI-generated bouquet"
                }
                className="h-full w-full object-contain p-2 sm:p-4"
                decoding="async"
                onError={onGeneratedImageError}
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#2c261f]/70 via-[#2c261f]/20 to-transparent px-5 pb-5 pt-16">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-[#2c261f]/75 px-3 py-2 text-xs font-semibold text-white backdrop-blur-md">
                  <Check className="h-3.5 w-3.5 text-[#a8ddb9]" />
                  {language === "ka"
                    ? "თქვენი AI თაიგული მზადაა"
                    : "Your AI bouquet is ready"}
                </span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="live-preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.24 }}
              className="absolute inset-0"
            >
              {previewFlowers.length > 0 && (
                <motion.div
                  className="absolute inset-0 z-10"
                  style={{ transformOrigin: "50% 43%" }}
                  animate={
                    isGenerating
                      ? shouldReduceMotion
                        ? { opacity: [0.72, 1, 0.72] }
                        : { rotate: 360 }
                      : { rotate: 0, opacity: 1 }
                  }
                  transition={
                    isGenerating
                      ? shouldReduceMotion
                        ? {
                            duration: 2.4,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                          }
                        : {
                            duration: 12,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                          }
                      : { duration: 0.3 }
                  }
                >
                  {previewFlowers.map((flower, index) => {
                    const angle = (360 / previewFlowers.length) * index;
                    const flowerName =
                      language === "ka"
                        ? flower.product.nameKa
                        : flower.product.nameEn;

                    return (
                      <div
                        key={flower.product.id}
                        className="absolute left-1/2 top-[43%]"
                        style={{
                          transform: `rotate(${angle}deg) translateX(var(--ai-orbit-radius))`,
                        }}
                      >
                        <div
                          style={{
                            transform: `translate(-50%, -50%) rotate(${-angle}deg)`,
                          }}
                        >
                          <motion.div
                            animate={
                              isGenerating && !shouldReduceMotion
                                ? { rotate: -360 }
                                : { rotate: 0 }
                            }
                            transition={
                              isGenerating && !shouldReduceMotion
                                ? {
                                    duration: 12,
                                    repeat: Number.POSITIVE_INFINITY,
                                    ease: "linear",
                                  }
                                : { duration: 0.3 }
                            }
                          >
                            <motion.div
                              animate={
                                !isGenerating && !shouldReduceMotion
                                  ? { y: [0, -6, 0] }
                                  : { y: 0 }
                              }
                              transition={
                                !isGenerating && !shouldReduceMotion
                                  ? {
                                      duration: 5.5 + (index % 3) * 0.8,
                                      delay: index * 0.12,
                                      repeat: Number.POSITIVE_INFINITY,
                                      ease: "easeInOut",
                                    }
                                  : { duration: 0.2 }
                              }
                              className={`relative h-[58px] w-[58px] overflow-visible rounded-full border-[3px] border-white bg-white shadow-[0_12px_28px_rgba(84,58,34,0.18)] sm:h-[70px] sm:w-[70px] ${
                                hasSelection ? "" : "opacity-55 grayscale-[20%]"
                              }`}
                              title={flowerName}
                            >
                              <FlowerImage
                                src={flower.product.imageUrl}
                                alt=""
                                className="h-full w-full rounded-full object-cover"
                              />
                              {hasSelection && flower.quantity > 0 && (
                                <span className="absolute -right-1.5 -top-1.5 grid min-h-6 min-w-6 place-items-center rounded-full border-2 border-white bg-[#9d6c34] px-1 text-[10px] font-bold text-white shadow-sm">
                                  ×{flower.quantity}
                                </span>
                              )}
                            </motion.div>
                          </motion.div>
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              )}

              <div className="absolute left-1/2 top-[43%] z-10 w-[184px] -translate-x-1/2 -translate-y-1/2 text-center sm:w-[220px]">
                <motion.div
                  role="status"
                  aria-live="polite"
                  animate={
                    isGenerating && shouldReduceMotion
                      ? { opacity: [0.7, 1, 0.7] }
                      : { opacity: 1 }
                  }
                  transition={{
                    duration: 2,
                    repeat:
                      isGenerating && shouldReduceMotion
                        ? Number.POSITIVE_INFINITY
                        : 0,
                  }}
                  className={`rounded-[26px] border px-4 py-5 shadow-[0_20px_55px_rgba(100,72,43,0.13)] backdrop-blur-md sm:px-5 sm:py-6 ${
                    generationError
                      ? "border-[#d89a9a]/45 bg-[#fff7f5]/95"
                      : "border-white/80 bg-white/80"
                  }`}
                >
                  <span
                    className={`mx-auto grid h-11 w-11 place-items-center rounded-full ${
                      generationError
                        ? "bg-[#f7dfdb] text-[#b85d59]"
                        : isGenerating
                          ? "bg-[#2c261f] text-[#e8c991]"
                          : "bg-[#f1e4d2] text-[#9d6c34]"
                    }`}
                  >
                    {generationError ? (
                      <AlertCircle className="h-5 w-5" />
                    ) : isGenerating ? (
                      <motion.span
                        animate={
                          shouldReduceMotion ? undefined : { rotate: 360 }
                        }
                        transition={{
                          duration: 3,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "linear",
                        }}
                      >
                        <Sparkles className="h-5 w-5" />
                      </motion.span>
                    ) : hasSelection ? (
                      <Sparkles className="h-5 w-5" />
                    ) : (
                      <WandSparkles className="h-5 w-5" />
                    )}
                  </span>

                  <p
                    className="mt-3 text-lg font-semibold leading-tight text-[#332b23] sm:text-xl"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    {generationError
                      ? language === "ka"
                        ? "ფოტოს შექმნა ვერ მოხერხდა"
                        : "Image could not be created"
                      : isGenerating
                        ? messages[generationStep]
                        : hasSelection
                          ? language === "ka"
                            ? "კომპოზიცია მზადაა"
                            : "Composition is ready"
                          : language === "ka"
                            ? "თქვენი თაიგული აქ გაცოცხლდება"
                            : "Your bouquet comes alive here"}
                  </p>

                  <p className="mt-2 text-[11px] leading-5 text-[#88796a]">
                    {generationError
                      ? language === "ka"
                        ? "თქვენი არჩევანი შენახულია — სცადეთ ხელახლა."
                        : "Your selection is safe — please try again."
                      : isGenerating
                        ? language === "ka"
                          ? "დარჩით ამ გვერდზე — AI თქვენს თაიგულს ქმნის"
                          : "Stay here while AI composes your bouquet"
                        : hasSelection
                          ? language === "ka"
                            ? `${selectedFlowers.length} სახეობა • ${stemCount} ღერო`
                            : `${selectedFlowers.length} types • ${stemCount} stems`
                          : language === "ka"
                            ? "აირჩიეთ ცალკეული ყვავილები და იხილეთ თაიგულის წინასწარი ხედი."
                            : "Choose individual stems to see a live preview first."}
                  </p>

                  {isGenerating && (
                    <div className="mt-4 h-1 overflow-hidden rounded-full bg-[#eadfce]">
                      <motion.div
                        className="h-full w-1/3 rounded-full bg-[#b17c3f]"
                        animate={
                          shouldReduceMotion
                            ? { opacity: [0.55, 1, 0.55] }
                            : { x: ["-110%", "310%"] }
                        }
                        transition={{
                          duration: shouldReduceMotion ? 2 : 1.7,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        }}
                      />
                    </div>
                  )}
                </motion.div>

                {hiddenFlowerCount > 0 && (
                  <span className="mt-3 inline-flex rounded-full border border-[#c8a675]/30 bg-white/75 px-3 py-1 text-[10px] font-bold text-[#8a6236] shadow-sm backdrop-blur-sm">
                    +{hiddenFlowerCount}{" "}
                    {language === "ka" ? "სხვა სახეობა" : "more types"}
                  </span>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <footer className="grid grid-cols-2 divide-x divide-white/10 px-2 pt-3 sm:px-3 sm:pt-4">
        <div className="pr-4">
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#9f9182]">
            {language === "ka" ? "შემადგენლობა" : "Composition"}
          </p>
          <p className="mt-1 text-sm font-semibold text-[#fffaf2]">
            {stemCount} {language === "ka" ? "ღერო" : "stems"}
          </p>
        </div>
        <div className="pl-4">
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#9f9182]">
            {language === "ka" ? "ღირებულება" : "Bouquet total"}
          </p>
          <p className="mt-1 text-sm font-semibold text-[#e8c991]">
            {formatBuilderPrice(total)}
          </p>
        </div>
      </footer>
    </section>
  );
}
