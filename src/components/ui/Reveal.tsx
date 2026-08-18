"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  as?: ElementType;
  direction?: "up" | "left" | "right" | "zoom";
  delay?: number;
  className?: string;
  /** stop observing once revealed (default true) */
  once?: boolean;
}

/**
 * Reveals its children when scrolled into view.
 *
 * The hidden start state is applied only on the client, after mount ("arming"),
 * so the server-rendered HTML is always visible. If JavaScript never runs, the
 * observer never fires, or the user prefers reduced motion, the content simply
 * shows — it can never get stuck invisible.
 */
export function Reveal({
  children,
  as: Tag = "div",
  direction = "up",
  delay = 0,
  className = "",
  once = true,
}: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const [armed, setArmed] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return; // never arm — stays visible
    }

    // Arming has to happen after mount: the hidden start state must not exist
    // in the server-rendered HTML, and we need real layout to decide whether
    // this element is already on screen.
    /* eslint-disable react-hooks/set-state-in-effect */
    setArmed(true);

    // Already on screen at mount: animate in on the next frame instead of
    // waiting for a scroll that may never come.
    if (el.getBoundingClientRect().top < window.innerHeight) {
      const raf = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(raf);
    }
    /* eslint-enable react-hooks/set-state-in-effect */

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            if (once) io.unobserve(entry.target);
          } else if (!once) {
            setVisible(false);
          }
        });
      },
      { threshold: 0.05, rootMargin: "200px 0px 100px 0px" },
    );
    io.observe(el);

    // Safety net in case the observer never reports this element.
    const failsafe = window.setTimeout(() => setVisible(true), 4000);

    return () => {
      io.disconnect();
      window.clearTimeout(failsafe);
    };
  }, [once]);

  const reveal = direction === "up" ? "" : direction;

  return (
    <Tag
      ref={ref}
      data-reveal={armed ? reveal || "" : undefined}
      className={`${visible ? "is-visible" : ""} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
