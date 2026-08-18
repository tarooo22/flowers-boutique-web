import Link from "next/link";
import { Fragment } from "react";

interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-[12.5px] text-[var(--muted)]">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, i) => (
          <Fragment key={`${item.label}-${i}`}>
            {i > 0 ? <li aria-hidden className="text-[var(--muted-2)]">/</li> : null}
            <li>
              {item.href ? (
                <Link href={item.href} className="transition hover:text-[var(--ink)]">
                  {item.label}
                </Link>
              ) : (
                <span className="text-[var(--ink)]">{item.label}</span>
              )}
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}
