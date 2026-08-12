import { useState } from "react";
import {
  editorialImageSources,
  resolveEditorialImageSource,
  type EditorialImageSlot,
} from "@/lib/editorialMedia";

type EditorialImageProps = {
  slot: EditorialImageSlot;
  fallbackImages: string[];
  alt: string;
  width: number;
  height: number;
  loading?: "eager" | "lazy";
  className?: string;
};

export default function EditorialImage({
  slot,
  fallbackImages,
  alt,
  width,
  height,
  loading = "lazy",
  className,
}: EditorialImageProps) {
  const [failed, setFailed] = useState(false);
  const source = resolveEditorialImageSource(slot, fallbackImages, failed);

  return (
    <img
      src={source ?? editorialImageSources[slot]}
      onError={(event) => {
        if (failed) {
          event.currentTarget.style.visibility = "hidden";
          return;
        }
        setFailed(true);
        if (!fallbackImages.length) {
          event.currentTarget.style.visibility = "hidden";
        }
      }}
      style={{ visibility: source ? "visible" : "hidden" }}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      className={className}
    />
  );
}
