import type { Product } from "@/types";
import { ProductCard } from "./ProductCard";

interface Props {
  products: Product[];
  priorityCount?: number;
  className?: string;
}

/** Responsive product grid: 2 cols mobile → 3 tablet → 4 desktop, 20px gap. */
export function ProductGrid({ products, priorityCount = 0, className = "" }: Props) {
  return (
    <div
      className={`grid grid-cols-2 gap-x-3 gap-y-7 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4 ${className}`}
    >
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} priority={i < priorityCount} />
      ))}
    </div>
  );
}
