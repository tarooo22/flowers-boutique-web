import { Heart, Home, ShoppingBag, Store } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { useCartDrawer } from "@/contexts/CartDrawerContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { getCart } from "@/lib/cartUtils";

const hiddenPrefixes = [
  "/admin",
  "/checkout",
  "/payment",
  "/login",
  "/register",
  "/bouquet-builder",
];

export default function MobileBottomNav() {
  const [location] = useLocation();
  const { language } = useLanguage();
  const { openDrawer } = useCartDrawer();
  const [count, setCount] = useState(0);
  const hidden = hiddenPrefixes.some(prefix => location.startsWith(prefix));
  const ka = language === "ka";

  useEffect(() => {
    const sync = () =>
      setCount(getCart().reduce((total, item) => total + item.quantity, 0));
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("fb-cart-updated", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("fb-cart-updated", sync);
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("has-p1-bottom-nav", !hidden);
    return () => document.body.classList.remove("has-p1-bottom-nav");
  }, [hidden]);

  if (hidden) return null;

  const links = [
    ["/", Home, ka ? "მთავარი" : "Home"],
    ["/catalog", Store, ka ? "კატალოგი" : "Catalog"],
    ["/wishlist", Heart, ka ? "რჩეული" : "Wishlist"],
  ] as const;

  return (
    <nav className="p1-bottom-nav" aria-label={ka ? "სწრაფი ნავიგაცია" : "Quick navigation"}>
      {links.map(([href, Icon, label]) => {
        const active = href === "/" ? location === "/" : location.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={active ? "is-active" : ""}
            aria-current={active ? "page" : undefined}
          >
            <Icon aria-hidden="true" />
            <span>{label}</span>
          </Link>
        );
      })}
      <button type="button" onClick={openDrawer} aria-label={ka ? "კალათის გახსნა" : "Open cart"}>
        <span className="p1-bottom-nav__icon">
          <ShoppingBag aria-hidden="true" />
          {count > 0 && <b>{count > 99 ? "99+" : count}</b>}
        </span>
        <span>{ka ? "კალათა" : "Cart"}</span>
      </button>
    </nav>
  );
}
