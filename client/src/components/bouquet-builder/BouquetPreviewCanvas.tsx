import { useMemo } from "react";
import {
  BUILDER_FALLBACK_FLOWER_ASSET,
  getRibbonOption,
  getWrapperOption,
} from "./builderAssets";
import { buildBouquetTokens, getBouquetTokenVisuals } from "./bouquetLayout";
import type { BuilderWrapMode, SelectedBuilderFlower } from "./builderTypes";

interface BouquetPreviewCanvasProps {
  wrapperId: string;
  ribbonId: string;
  selectedFlowers: SelectedBuilderFlower[];
  wrapMode: BuilderWrapMode;
  language: "ka" | "en";
}

export function BouquetPreviewCanvas({
  wrapperId,
  ribbonId,
  selectedFlowers,
  wrapMode,
  language,
}: BouquetPreviewCanvasProps) {
  const wrapper = getWrapperOption(wrapperId);
  const ribbon = getRibbonOption(ribbonId);
  const tokens = useMemo(
    () => buildBouquetTokens(selectedFlowers),
    [selectedFlowers]
  );
  const selectedStemCount = tokens.length;
  const ribbonOnly = wrapMode === "ribbonOnly";

  return (
    <div
      className={`builder-visual-canvas relative isolate mx-auto aspect-[1122/1402] w-full max-w-[560px] overflow-hidden rounded-[28px] border border-[#eadfce] ${
        ribbonOnly
          ? "bg-[radial-gradient(ellipse_at_50%_84%,rgba(83,61,40,0.11),transparent_31%),radial-gradient(circle_at_50%_24%,#fff_0%,#fbf7f0_48%,#eee5d8_100%)]"
          : "bg-[#f7f4ef]"
      }`}
      data-wrap-mode={wrapMode}
      data-stem-count={selectedStemCount}
      role="img"
      aria-label={
        language === "ka"
          ? `ვიზუალური თაიგული: ${selectedStemCount} ღერო, ${
              ribbonOnly ? "შეფუთვის გარეშე" : wrapper.nameKa
            }, ${ribbon.nameKa} ლენტი`
          : `Visual bouquet: ${selectedStemCount} stems, ${
              ribbonOnly ? "no wrapping" : wrapper.nameEn
            }, ${ribbon.nameEn} ribbon`
      }
    >
      {!ribbonOnly && (
        <img
          src={wrapper.backPath}
          alt=""
          aria-hidden="true"
          draggable={false}
          className="pointer-events-none absolute inset-0 z-10 h-full w-full select-none object-contain"
        />
      )}

      <div
        className="pointer-events-none absolute inset-0 z-20 overflow-visible transition-transform duration-300"
        style={{
          transform: ribbonOnly
            ? "translateY(1.5%) scale(0.96)"
            : "translateY(5.5%) scale(0.92)",
          transformOrigin: "50% 34%",
        }}
        aria-hidden="true"
      >
        {tokens.map(token => {
          const visuals = getBouquetTokenVisuals(
            token,
            selectedStemCount,
            wrapMode
          );

          return (
            <div
              key={token.id}
              className="absolute h-[43%] w-[38%] transition-transform duration-300"
              data-bouquet-token={token.id}
              data-flower-key={token.assetKey}
              data-token-slot={token.slotIndex}
              data-head-x={token.headX.toFixed(2)}
              data-head-y={token.headY.toFixed(2)}
              style={{
                left: "50%",
                top: "72%",
                zIndex: token.zIndex,
                transform: `translate(-50%, -100%) rotate(${visuals.angle.toFixed(
                  2
                )}deg) scale(${visuals.densityScale.toFixed(3)})`,
                transformOrigin: "50% 100%",
              }}
            >
              <img
                src={token.assetPath}
                alt=""
                draggable={false}
                className="absolute left-1/2 w-auto max-w-none select-none object-contain object-top"
                style={{
                  top: `calc(-42% + ${visuals.reachDrop.toFixed(2)}%)`,
                  height: "158%",
                  transform: `translateX(-50%) scale(${token.speciesScale})`,
                  transformOrigin: `50% ${token.scaleAnchorRatio * 100}%`,
                  clipPath: ribbonOnly
                    ? undefined
                    : `inset(0 0 ${visuals.clipBottom.toFixed(2)}% 0)`,
                }}
                onError={event => {
                  if (
                    event.currentTarget.src.endsWith(
                      BUILDER_FALLBACK_FLOWER_ASSET
                    )
                  ) {
                    return;
                  }
                  event.currentTarget.src = BUILDER_FALLBACK_FLOWER_ASSET;
                }}
              />
            </div>
          );
        })}
      </div>

      {!ribbonOnly && selectedStemCount > 0 && (
        <>
          <div
            className="pointer-events-none absolute inset-0 z-[25] bg-[#f7f4ef] bg-contain bg-center bg-no-repeat"
            style={{
              backgroundImage: `url("${wrapper.backPath}")`,
              clipPath: "inset(72% 0 0 0)",
            }}
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-0 z-[25] bg-[#f7f4ef] bg-contain bg-center bg-no-repeat"
            style={{
              backgroundImage: `url("${wrapper.backPath}")`,
              clipPath:
                "polygon(0 55%, 26% 55%, 36% 62%, 50% 72%, 60% 84%, 55% 100%, 0 100%)",
            }}
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-0 z-[25] bg-[#f7f4ef] bg-contain bg-center bg-no-repeat"
            style={{
              backgroundImage: `url("${wrapper.backPath}")`,
              clipPath:
                "polygon(100% 55%, 74% 55%, 64% 62%, 50% 72%, 40% 84%, 45% 100%, 100% 100%)",
            }}
            aria-hidden="true"
          />
        </>
      )}

      {!ribbonOnly && (
        <img
          src={wrapper.frontPath}
          alt=""
          aria-hidden="true"
          draggable={false}
          className="pointer-events-none absolute inset-0 z-30 h-full w-full select-none object-contain"
        />
      )}

      {ribbonOnly && selectedStemCount > 0 && (
        <div
          className="pointer-events-none absolute left-1/2 top-[73.5%] z-[35] h-5 w-[22%] -translate-x-1/2 rounded-full bg-[#49392d]/12 blur-md"
          aria-hidden="true"
        />
      )}

      <img
        src={ribbon.assetPath}
        alt=""
        aria-hidden="true"
        draggable={false}
        className={`pointer-events-none absolute left-1/2 z-40 -translate-x-1/2 -translate-y-1/4 select-none object-contain drop-shadow-[0_10px_14px_rgba(65,41,27,0.16)] ${
          ribbonOnly ? "top-[73.8%] w-[21%]" : "top-[72%] w-[23%]"
        }`}
      />

      {selectedStemCount === 0 ? (
        <div className="pointer-events-none absolute left-1/2 top-[31%] z-50 -translate-x-1/2 text-center">
          <span className="inline-flex items-center whitespace-nowrap rounded-full border border-white/75 bg-white/82 px-4 py-2 text-xs font-medium text-[#7a6b5d] shadow-sm backdrop-blur-sm">
            {language === "ka"
              ? "გთხოვთ, აირჩიოთ ყვავილები"
              : "Choose your flowers"}
          </span>
        </div>
      ) : (
        <div className="pointer-events-none absolute right-4 top-4 z-50">
          <span className="inline-flex items-center rounded-full border border-white/75 bg-white/82 px-3 py-1.5 text-[11px] font-semibold text-[#7a6b5d] shadow-sm backdrop-blur-sm">
            {language === "ka"
              ? `${selectedStemCount} ღერო`
              : `${selectedStemCount} stems`}
          </span>
        </div>
      )}

      <div
        className={`pointer-events-none absolute bottom-[4%] z-50 h-8 rounded-[50%] bg-[#7e5d42]/10 blur-xl ${
          ribbonOnly ? "inset-x-[31%]" : "inset-x-[17%]"
        }`}
      />
    </div>
  );
}
