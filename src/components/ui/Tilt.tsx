"use client";

import { useRef, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  /** max rotation in degrees */
  max?: number;
  /** lift toward viewer on hover, px */
  glare?: boolean;
}

/**
 * Pointer-driven 3D tilt. Wrap in a `.tilt-scene` (perspective) parent;
 * this renders the tilting element. Disabled for reduced-motion / touch.
 */
export function Tilt({ children, className = "", max = 10, glare = false }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || reduced) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `rotateY(${px * max * 2}deg) rotateX(${-py * max * 2}deg) translateZ(0)`;
    if (glare) {
      el.style.setProperty("--gx", `${(px + 0.5) * 100}%`);
      el.style.setProperty("--gy", `${(py + 0.5) * 100}%`);
    }
  };

  const reset = () => {
    const el = ref.current;
    if (el) el.style.transform = "";
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      className={`tilt-el ${className}`}
    >
      {children}
    </div>
  );
}
