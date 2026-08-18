import Link from "next/link";

interface Props {
  className?: string;
  onClick?: () => void;
}

/** Flower's Boutique wordmark lockup. */
export function Logo({ className = "", onClick }: Props) {
  return (
    <Link
      href="/"
      onClick={onClick}
      aria-label="Flower's Boutique — home"
      className={`group inline-flex flex-col leading-none ${className}`}
    >
      <span className="font-display text-[21px] italic tracking-tight text-[var(--action-deep)] transition-colors group-hover:text-[var(--action)] sm:text-[23px]">
        Flower&rsquo;s
      </span>
      <span className="mono text-[9px] font-medium uppercase tracking-[0.42em] text-[var(--muted)]">
        Boutique
      </span>
    </Link>
  );
}
