import Link from "next/link";

interface Props {
  className?: string;
  onClick?: () => void;
  tone?: "coral" | "light";
}

/** Shared Georgian Flower's Boutique wordmark lockup. */
export function Logo({ className = "", onClick, tone = "coral" }: Props) {
  const primaryColor = tone === "light" ? "text-white group-hover:text-[var(--action)]" : "text-[var(--action-deep)] group-hover:text-[var(--action)]";
  const secondaryColor = tone === "light" ? "text-[var(--footer-muted)]" : "text-[var(--muted)]";
  return (
    <Link
      href="/"
      onClick={onClick}
      aria-label="ყვავილების ბუტიკი — მთავარი"
      className={`group inline-flex flex-col leading-none ${className}`}
    >
      <span className={`font-display text-[18px] italic tracking-[-0.05em] transition-colors sm:text-[21px] ${primaryColor}`}>
        ყვავილების
      </span>
      <span className={`mono mt-1 text-[9px] font-semibold tracking-[0.16em] sm:text-[10px] ${secondaryColor}`}>
        ბუტიკი
      </span>
    </Link>
  );
}
