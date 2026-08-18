import { formatPrice } from "@/lib/format";

interface Props {
  value: number;
  compareAt?: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "text-[13px]",
  md: "text-[15px]",
  lg: "text-[22px]",
};

/**
 * Product price. Uses the body font (matching the reference), with an
 * optional struck-through compare-at value.
 */
export function Price({ value, compareAt, className = "", size = "sm" }: Props) {
  return (
    <span className={`inline-flex items-baseline gap-2 tabular-nums ${className}`}>
      <span className={`${sizeMap[size]} font-semibold text-[var(--ink)]`}>
        {formatPrice(value)}
      </span>
      {compareAt && compareAt > value ? (
        <span className="text-[11.5px] font-medium text-[var(--muted-2)] line-through">
          {formatPrice(compareAt)}
        </span>
      ) : null}
    </span>
  );
}
