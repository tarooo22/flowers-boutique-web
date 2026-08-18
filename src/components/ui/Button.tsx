import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type Variant = "primary" | "dark" | "outline" | "ghost" | "light";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-[var(--action)] text-[var(--action-ink)] hover:bg-[var(--action-deep)] hover:text-white",
  dark: "bg-[var(--ink)] text-white hover:bg-black",
  outline:
    "border border-[var(--line-strong)] text-[var(--ink)] hover:border-[var(--ink)] bg-transparent",
  ghost: "text-[var(--ink)] hover:bg-black/5",
  light: "bg-white text-[var(--ink)] border border-[var(--line)] hover:border-[var(--ink)]",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-[12.5px]",
  md: "h-11 px-6 text-[13.5px]",
  lg: "h-12 px-7 text-[14px]",
};

const baseClass =
  "inline-flex items-center justify-center gap-2 rounded-[var(--radius-sm)] font-semibold tracking-[0.01em] transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none select-none";

interface CommonProps {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  children: ReactNode;
  className?: string;
}

type ButtonAsButton = CommonProps &
  ComponentPropsWithoutRef<"button"> & { href?: undefined };
type ButtonAsLink = CommonProps & { href: string } & Omit<
    ComponentPropsWithoutRef<typeof Link>,
    "href" | "className"
  >;

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const {
    variant = "primary",
    size = "md",
    fullWidth,
    className = "",
    children,
  } = props;
  const cls = `${baseClass} ${variants[variant]} ${sizes[size]} ${
    fullWidth ? "w-full" : ""
  } ${className}`;

  if ("href" in props && props.href) {
    const { href, variant: _v, size: _s, fullWidth: _f, className: _c, children: _ch, ...rest } =
      props as ButtonAsLink;
    void _v; void _s; void _f; void _c; void _ch;
    return (
      <Link href={href} className={cls} {...rest}>
        {children}
      </Link>
    );
  }

  const { variant: _v, size: _s, fullWidth: _f, className: _c, children: _ch, href: _h, ...rest } =
    props as ButtonAsButton;
  void _v; void _s; void _f; void _c; void _ch; void _h;
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}
