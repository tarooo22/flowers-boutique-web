import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

type ScrollExpansionHeroProps = {
  mediaSrc: string;
  bgImageSrc: string;
  title: string;
  eyebrow: string;
  prompt: string;
  description: string;
};

/**
 * A scroll-linked editorial moment adapted for the Vite storefront.
 * Unlike the reference implementation, this component never hijacks the
 * wheel/touch events: the page remains native-scrollable and keyboard friendly.
 */
export default function ScrollExpansionHero({
  mediaSrc,
  bgImageSrc,
  title,
  eyebrow,
  prompt,
  description,
}: ScrollExpansionHeroProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const mediaWidth = useTransform(scrollYProgress, [0, 1], ["min(22rem, 72vw)", "min(72rem, 92vw)"]);
  const mediaHeight = useTransform(scrollYProgress, [0, 1], ["min(27rem, 62vh)", "min(46rem, 82vh)"]);
  const backgroundOpacity = useTransform(scrollYProgress, [0, 0.72, 1], [0.92, 0.3, 0]);
  const promptOpacity = useTransform(scrollYProgress, [0, 0.2, 0.78], [1, 0.75, 0]);
  const copyOpacity = useTransform(scrollYProgress, [0.15, 0.55, 0.92], [0, 0.65, 1]);

  return (
    <section ref={sectionRef} className="scroll-expansion-hero" aria-label={title}>
      <div className="scroll-expansion-hero__sticky">
        <motion.img
          src={bgImageSrc}
          alt=""
          aria-hidden="true"
          className="scroll-expansion-hero__background"
          style={reduceMotion ? { opacity: 0.42 } : { opacity: backgroundOpacity }}
        />
        <div className="scroll-expansion-hero__veil" aria-hidden="true" />

        <div className="scroll-expansion-hero__frame">
          <motion.div
            className="scroll-expansion-hero__media"
            style={reduceMotion ? undefined : { width: mediaWidth, height: mediaHeight }}
          >
            <img src={mediaSrc} alt={title} loading="lazy" />
            <div className="scroll-expansion-hero__media-shade" aria-hidden="true" />
          </motion.div>

          <motion.div
            className="scroll-expansion-hero__heading"
            style={reduceMotion ? undefined : { opacity: promptOpacity }}
          >
            <p>{eyebrow}</p>
            <h2>{title}</h2>
            <span>{prompt}</span>
          </motion.div>

          <motion.div
            className="scroll-expansion-hero__copy"
            style={reduceMotion ? undefined : { opacity: copyOpacity }}
          >
            <p>{eyebrow}</p>
            <h3>{description}</h3>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
