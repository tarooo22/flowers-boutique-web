"use client";

import Image from "next/image";
import { useI18n } from "@/lib/i18n";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "@/components/ui/Icons";
import { builderFlowers } from "@/data/builder";

/** Homepage teaser for the bouquet builder (visual + AI). */
export function BuilderPromo() {
  const { t } = useI18n();
  const preview = builderFlowers.slice(0, 6);

  return (
    <section className="container-fb pt-12 sm:pt-16">
      <Reveal direction="zoom">
        <div className="relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--ink)] px-6 py-10 text-white sm:px-10 sm:py-12">
          {/* soft glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 -top-24 h-[320px] w-[320px] rounded-full bg-[var(--action)]/25 blur-3xl"
          />

          <div className="relative grid items-center gap-8 md:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="mono text-[11px] uppercase tracking-[0.18em] text-white/60">
                {t("nav.builder")}
              </p>
              <h2 className="font-display mt-2 max-w-[20ch] text-[26px] leading-tight tracking-[-0.01em] sm:text-[32px]">
                {t("builder.title")}
              </h2>
              <p className="mt-3 max-w-[46ch] text-[13.5px] leading-relaxed text-white/70">
                {t("builder.subtitle")}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button href="/builder" variant="primary">
                  {t("builder.tabVisual")}
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  href="/builder"
                  variant="outline"
                  className="border-white/30 text-white hover:border-white"
                >
                  {t("builder.tabAI")}
                </Button>
              </div>
            </div>

            {/* floating stems */}
            <div className="relative flex items-end justify-center gap-1 sm:gap-3">
              {preview.map((f, i) => (
                <div
                  key={f.key}
                  className="fb-float relative h-28 w-10 sm:h-40 sm:w-14"
                  style={{ animationDelay: `${i * 0.45}s` }}
                >
                  <Image
                    src={f.asset}
                    alt=""
                    fill
                    sizes="56px"
                    className="object-contain object-top drop-shadow-[0_10px_20px_rgba(0,0,0,0.35)]"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
