import type { ComponentPropsWithoutRef, ReactNode } from "react";

interface Props extends ComponentPropsWithoutRef<"button"> {
  label: string;
  children: ReactNode;
  badge?: number;
}

/** Round, header-style icon button with an optional count badge. */
export function IconButton({ label, children, badge, className = "", ...rest }: Props) {
  return (
    <button
      type="button"
      aria-label={label}
      className={`relative grid h-9 w-9 place-items-center rounded-full text-[var(--ink)] transition-colors hover:bg-black/5 ${className}`}
      {...rest}
    >
      {children}
      {badge && badge > 0 ? (
        <span className="mono absolute -right-0.5 -top-0.5 grid h-[17px] min-w-[17px] place-items-center rounded-full bg-[var(--action)] px-1 text-[10px] font-bold leading-none text-white">
          {badge > 99 ? "99+" : badge}
        </span>
      ) : null}
    </button>
  );
}
