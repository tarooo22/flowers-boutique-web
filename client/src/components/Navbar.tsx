import {
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Heart,
  LogIn,
  LogOut,
  Menu,
  Search,
  ShieldCheck,
  ShoppingBag,
  UserPlus,
  UserRound,
  X,
} from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from '@/_core/hooks/useAuth';
import { useCartDrawer } from "@/contexts/CartDrawerContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { getCart } from "@/lib/cartUtils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const { language, setLanguage } = useLanguage();
  const { user, loading, logout } = useAuth();
  const { openDrawer } = useCartDrawer();
  const [location, navigate] = useLocation();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [count, setCount] = useState(0);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const mobileNavRef = useRef<HTMLElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const ka = language === "ka";

  const links = [
    ["/", ka ? "მთავარი" : "Home"],
    ["/catalog", ka ? "კოლექცია" : "Collection"],
    ["/bouquet-builder", ka ? "შექმენი თაიგული" : "Create a bouquet"],
    ["/delivery", ka ? "მიწოდება" : "Delivery"],
    ["/about", ka ? "ჩვენ შესახებ" : "Our story"],
    ["/contact", ka ? "კონტაქტი" : "Contact"],
  ] as const;

  const categoryLinks = [
    ["/rose-bouquets", ka ? "ვარდების თაიგულები" : "Rose bouquets"],
    ["/lily-bouquets", ka ? "შროშანის თაიგულები" : "Lily bouquets"],
    ["/spray-roses", ka ? "ბუჩქოვანი ვარდები" : "Spray roses"],
    ["/birthday-flowers", ka ? "დაბადების დღის ყვავილები" : "Birthday flowers"],
  ] as const;

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
    setOpen(false);
    setSearchOpen(false);
  }, [location]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const panel = mobileNavRef.current;
    const previousActiveElement = document.activeElement as HTMLElement | null;
    const focusableSelector =
      'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      if (event.key !== "Tab" || !panel) return;
      const focusable = Array.from(
        panel.querySelectorAll<HTMLElement>(focusableSelector)
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.body.classList.add("fb-menu-open");
    document.addEventListener("keydown", onKeyDown);
    window.requestAnimationFrame(() =>
      panel?.querySelector<HTMLElement>(focusableSelector)?.focus()
    );
    return () => {
      document.body.classList.remove("fb-menu-open");
      document.removeEventListener("keydown", onKeyDown);
      (previousActiveElement ?? menuTriggerRef.current)?.focus();
    };
  }, [open]);

  useEffect(() => {
    if (!searchOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSearchOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    window.requestAnimationFrame(() => searchInputRef.current?.focus());
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [searchOpen]);

  const isActive = (href: string) =>
    href === "/" ? location === "/" : location.startsWith(href);

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = searchTerm.trim();
    setSearchOpen(false);
    navigate(
      query ? `/catalog?search=${encodeURIComponent(query)}` : "/catalog"
    );
  };

  const showCart = () => {
    setOpen(false);
    setCount(getCart().reduce((total, item) => total + item.quantity, 0));
    openDrawer();
  };

  return (
    <>
      <a className="fb-skip-link" href="#main-content">
        {ka ? "მთავარ შინაარსზე გადასვლა" : "Skip to main content"}
      </a>

      <div className="fb-announcement">
        <div className="fb-announcement__inner">
          <span>
            {ka
              ? "ყვავილები განსაკუთრებული მომენტებისთვის"
              : "Flowers for unforgettable moments"}
          </span>
          <Link href="/delivery">
            {ka ? "მიწოდების პირობები" : "Delivery details"}
            <ArrowRight aria-hidden="true" />
          </Link>
        </div>
      </div>

      <header className={`fb-nav ${scrolled ? "is-scrolled" : ""}`}>
        <div className="fb-nav__inner">
          <Link
            href="/"
            className="fb-brand"
            aria-label="Flower’s Boutique home"
          >
            <span className="fb-brand__mark" aria-hidden="true">
              <img
                src="/brand/flowers-boutique-logo.png"
                alt=""
                width="960"
                height="960"
                fetchPriority="high"
              />
            </span>
            <span className="fb-brand__name">
              Flower’s <em>Boutique</em>
            </span>
          </Link>

          <nav
            className="fb-nav__links"
            aria-label={ka ? "მთავარი ნავიგაცია" : "Primary navigation"}
          >
            {links.map(([href, label]) => (
              <Link
                key={href}
                href={href}
                className={isActive(href) ? "is-active" : ""}
                aria-current={isActive(href) ? "page" : undefined}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="fb-nav__actions">
            <button
              type="button"
              className={`fb-icon ${searchOpen ? "is-active" : ""}`}
              onClick={() => setSearchOpen(value => !value)}
              aria-label={ka ? "ძიება" : "Search"}
              aria-expanded={searchOpen}
              aria-controls="site-search"
            >
              <Search />
            </button>

            <div
              className="fb-language"
              aria-label={ka ? "ენის არჩევა" : "Language selector"}
            >
              <button
                type="button"
                className={language === "ka" ? "is-active" : ""}
                onClick={() => setLanguage("ka")}
                aria-pressed={language === "ka"}
              >
                ქა
              </button>
              <button
                type="button"
                className={language === "en" ? "is-active" : ""}
                onClick={() => setLanguage("en")}
                aria-pressed={language === "en"}
              >
                EN
              </button>
            </div>

            {user?.role === "admin" && (
              <Link
                href="/admin"
                className="fb-admin-access"
                aria-label={ka ? "ადმინისტრატორის პანელი" : "Admin panel"}
              >
                <ShieldCheck />
                <span>{ka ? "ადმინი" : "Admin"}</span>
              </Link>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className={`fb-account-trigger ${user ? "is-authenticated" : ""}`}
                  aria-label={
                    user
                      ? ka
                        ? "ჩემი ანგარიში"
                        : "My account"
                      : ka
                        ? "შესვლა ან რეგისტრაცია"
                        : "Log in or register"
                  }
                  disabled={loading}
                >
                  <UserRound />
                  <ChevronDown className="fb-account-trigger__chevron" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                sideOffset={10}
                className="fb-account-menu"
              >
                {user ? (
                  <>
                    <DropdownMenuLabel className="fb-account-menu__identity">
                      <strong>
                        {user.name || (ka ? "ჩემი ანგარიში" : "My account")}
                      </strong>
                      <span>{user.email}</span>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="fb-account-menu__item">
                        <UserRound />
                        {ka ? "პროფილი და შეკვეთები" : "Profile and orders"}
                      </Link>
                    </DropdownMenuItem>
                    {user.role === "admin" && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="fb-account-menu__item">
                          <ShieldCheck />
                          {ka ? "ადმინისტრატორის პანელი" : "Admin panel"}
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="fb-account-menu__item fb-account-menu__item--danger"
                      onSelect={() => void logout()}
                    >
                      <LogOut />
                      {ka ? "გასვლა" : "Log out"}
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuLabel className="fb-account-menu__intro">
                      {ka
                        ? "ანგარიშით უფრო მარტივად აკონტროლებთ შეკვეთებს."
                        : "Use an account to manage your orders."}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/login" className="fb-account-menu__item">
                        <LogIn />
                        {ka ? "შესვლა" : "Log in"}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/register" className="fb-account-menu__item">
                        <UserPlus />
                        {ka ? "რეგისტრაცია" : "Register"}
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              href="/wishlist"
              className="fb-icon fb-wishlist"
              aria-label={ka ? "რჩეულები" : "Wishlist"}
            >
              <Heart />
            </Link>
            <button
              type="button"
              className="fb-icon fb-cart"
              onClick={showCart}
              aria-label={ka ? "კალათა" : "Cart"}
            >
              <ShoppingBag />
              {count > 0 && <b aria-label={`${count}`}>{count}</b>}
            </button>
            <button
              ref={menuTriggerRef}
              type="button"
              className="fb-menu"
              onClick={() => setOpen(value => !value)}
              aria-label={ka ? "მენიუ" : "Menu"}
              aria-expanded={open}
              aria-controls="mobile-navigation"
            >
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {searchOpen && (
          <>
            <button
              type="button"
              className="fb-nav-search__scrim"
              onClick={() => setSearchOpen(false)}
              aria-label={ka ? "ძიების დახურვა" : "Close search"}
            />
            <div id="site-search" className="fb-nav-search">
              <form onSubmit={submitSearch} role="search">
                <div>
                  <span className="fb-eyebrow">
                    {ka ? "კოლექციის ძიება" : "Search the collection"}
                  </span>
                  <label htmlFor="global-product-search">
                    {ka ? "რას ეძებთ?" : "What are you looking for?"}
                  </label>
                </div>
                <div className="fb-nav-search__control">
                  <Search aria-hidden="true" />
                  <input
                    ref={searchInputRef}
                    id="global-product-search"
                    value={searchTerm}
                    onChange={event => setSearchTerm(event.target.value)}
                    placeholder={
                      ka
                        ? "მაგ. ვარდები, დაბადების დღე…"
                        : "e.g. roses, birthday…"
                    }
                    autoComplete="off"
                  />
                  <button type="submit" className="fb-button fb-button--dark">
                    {ka ? "ძიება" : "Search"}
                    <ArrowRight />
                  </button>
                </div>
              </form>
            </div>
          </>
        )}

        {open && (
          <nav
            ref={mobileNavRef}
            id="mobile-navigation"
            className="fb-mobile-nav"
            aria-label={ka ? "მობილური ნავიგაცია" : "Mobile navigation"}
            aria-modal="true"
            role="dialog"
            tabIndex={-1}
          >
            <div className="fb-mobile-nav__meta">
              <span>{ka ? "მენიუ" : "Menu"}</span>
              <div
                className="fb-mobile-language"
                aria-label={ka ? "ენის არჩევა" : "Choose language"}
              >
                <button
                  type="button"
                  className={language === "ka" ? "is-active" : ""}
                  onClick={() => setLanguage("ka")}
                >
                  ქართული
                </button>
                <button
                  type="button"
                  className={language === "en" ? "is-active" : ""}
                  onClick={() => setLanguage("en")}
                >
                  English
                </button>
              </div>
            </div>

            <div className="fb-mobile-nav__layout">
              <div className="fb-mobile-nav__links">
                {links.map(([href, label], index) => (
                  <Link
                    key={href}
                    href={href}
                    className={isActive(href) ? "is-active" : ""}
                  >
                    <span>0{index + 1}</span>
                    <strong>{label}</strong>
                    <ChevronRight aria-hidden="true" />
                  </Link>
                ))}
              </div>

              <div className="fb-mobile-nav__secondary">
                <p>{ka ? "კატეგორიები" : "Categories"}</p>
                {categoryLinks.map(([href, label]) => (
                  <Link key={href} href={href}>
                    {label}
                    <ArrowRight />
                  </Link>
                ))}
              </div>
            </div>

            <div className="fb-mobile-nav__utilities">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setSearchOpen(true);
                }}
              >
                <Search />
                {ka ? "ძიება" : "Search"}
              </button>
              <Link href="/wishlist">
                <Heart />
                {ka ? "რჩეულები" : "Wishlist"}
              </Link>
              <button type="button" onClick={showCart}>
                <ShoppingBag />
                {ka ? `კალათა (${count})` : `Cart (${count})`}
              </button>
            </div>

            <div className="fb-mobile-nav__account">
              {user ? (
                <>
                  <Link href="/profile">
                    <UserRound />
                    {ka ? "ჩემი პროფილი და შეკვეთები" : "My profile and orders"}
                  </Link>
                  {user.role === "admin" && (
                    <Link href="/admin" className="is-admin">
                      <ShieldCheck />
                      {ka ? "ადმინისტრატორის პანელი" : "Admin panel"}
                    </Link>
                  )}
                  <button type="button" onClick={() => void logout()}>
                    <LogOut />
                    {ka ? "ანგარიშიდან გასვლა" : "Log out"}
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="is-primary">
                    <LogIn />
                    {ka ? "ანგარიშზე შესვლა" : "Log in"}
                  </Link>
                  <Link href="/register">
                    <UserPlus />
                    {ka ? "რეგისტრაცია" : "Register"}
                  </Link>
                </>
              )}
            </div>
          </nav>
        )}
      </header>
    </>
  );
}
