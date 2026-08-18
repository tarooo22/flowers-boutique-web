"use client";

import { useState } from "react";
import Image from "next/image";
import { focusFor } from "@/lib/imageFocus";

interface Props {
  images: string[];
  name: string;
}

export function ProductGallery({ images, name }: Props) {
  const [active, setActive] = useState(0);
  const list = images.length ? images : ["/manus-storage/studio-5_c8839d18.png"];

  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:gap-4">
      {/* thumbnails */}
      {list.length > 1 ? (
        <div className="flex gap-3 sm:flex-col">
          {list.map((src, i) => (
            <button
              key={src}
              aria-label={`View image ${i + 1}`}
              aria-current={i === active}
              onClick={() => setActive(i)}
              className={`relative h-16 w-16 overflow-hidden rounded-lg bg-[var(--surface-warm)] transition sm:h-20 sm:w-[68px] ${
                i === active ? "ring-2 ring-[var(--ink)]" : "opacity-70 hover:opacity-100"
              }`}
            >
              {/* the first thumb shares its src with the main image, so it is
                  eager too — otherwise Next flags it as an unprioritised LCP */}
              <Image
                src={src}
                alt=""
                fill
                sizes="68px"
                priority={i === 0}
                unoptimized
                className="object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}

      {/* main */}
      <div className="relative aspect-[4/5] flex-1 overflow-hidden rounded-[var(--radius-lg)] bg-[var(--surface-warm)]">
        <Image
          src={list[active]}
          alt={name}
          fill
          priority
          sizes="(max-width:640px) 100vw, 55vw"
          unoptimized
          className="object-cover"
          style={{ objectPosition: focusFor(list[active]) }}
        />
      </div>
    </div>
  );
}
