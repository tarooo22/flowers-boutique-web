import {
  ArrowRight,
  ChevronDown,
  Heart,
  LogIn,
  LogOut,
  Menu,
  MessageCircle,
  Search,
  ShieldCheck,
  ShoppingBag,
  UserPlus,
  UserRound,
} from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { useCartDrawer } from "@/contexts/CartDrawerContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { getCart } from "@/lib/cartUtils";
import { phoneHref, siteContact } from "@/lib/siteConfig";
import { BrandWordmark } from "@/components/BrandWordmark";
import { DELIVERY_FEE_GEL, FREE_DELIVERY_THRESHOLD_GEL } from "@shared/checkoutPolicy";
import ContactSheet from "@/components/mobile/ContactSheet";
import MobileBottomNav from "@/components/mobile/MobileBottomNav";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [count, setCount] = useState(0);
  const ka = language === "ka";
  const links = [
    ["/catalog", ka ? "კატალოგი" : "Catalog"],
    ["/bouquet-builder", ka ? "შექმენი თაიგული" : "Create a bouquet"],
    ["/about", ka ? "ჩვენ შესახებ" : "About"],
    ["/contact", ka ? "კონტაქტი" : "Contact"],
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
    setMenuOpen(false);
    setSearchOpen(false);
  }, [location]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => location.startsWith(href);
  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = searchTerm.trim();
    setSearchOpen(false);
    navigate(
      query ? `/catalog?search=${encodeURIComponent(query)}` : "/catalog"
    );
  };

  return (
    <>
      <a className="p1-skip-link" href="#main-content">
        {ka ? "მთავარ შინაარსზე გადასვლა" : "Skip to main content"}
      </a>
      <header className={`p1-header ${scrolled ? "is-scrolled" : ""}`}>
        <div
          className="p1-utility-strip"
          aria-label={ka ? "მიწოდებისა და კონტაქტის ინფორმაცია" : "Delivery and contact information"}
        >
          <p className="p1-utility-strip__delivery">
            {ka
              ? `მიწოდება ₾${DELIVERY_FEE_GEL} · უფასო ₾${FREE_DELIVERY_THRESHOLD_GEL}-დან`
              : `Delivery ₾${DELIVERY_FEE_GEL} · Free from ₾${FREE_DELIVERY_THRESHOLD_GEL}`}
          </p>
          <a href={phoneHref}>{siteContact.phone}</a>
        </div>
        <div className="p1-header__inner">
          <button
            type="button"
            className="p1-icon-button p1-mobile-menu-trigger"
            onClick={() => setMenuOpen(true)}
            aria-label={ka ? "მენიუს გახსნა" : "Open menu"}
          >
            <Menu />
          </button>
          <nav
            className="p1-header__nav"
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

          <Link
            href="/"
            className="p1-brand"
            aria-label={ka ? "ყვავილების ბუტიკი და ივენთები — მთავარი" : "Flower’s Boutique & Events home"}
          >
            <BrandWordmark language={language} className="p1-brand__wordmark" />
          </Link>

          <div className="p1-header__actions">
            <button
              type="button"
              className="p1-icon-button"
              onClick={() => setSearchOpen(true)}
              aria-label={ka ? "ძიება" : "Search"}
            >
              <Search />
            </button>
            <div
              className="p1-language"
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
                className="p1-icon-button p1-admin-button"
                aria-label={ka ? "ადმინისტრატორის პანელი" : "Admin panel"}
              >
                <ShieldCheck />
              </Link>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="p1-account-button"
                  disabled={loading}
                  aria-label={
                    user
                      ? ka
                        ? "ჩემი ანგარიში"
                        : "My account"
                      : ka
                        ? "შესვლა ან რეგისტრაცია"
                        : "Log in or register"
                  }
                >
                  <UserRound />
                  <ChevronDown />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                sideOffset={10}
                className="p1-account-menu"
              >
                {user ? (
                  <>
                    <DropdownMenuLabel className="p1-account-menu__identity">
                      <strong>
                        {user.name || (ka ? "ჩემი ანგარიში" : "My account")}
                      </strong>
                      <span>{user.email}</span>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile">
                        <UserRound />
                        {ka ? "პროფილი და შეკვეთები" : "Profile and orders"}
                      </Link>
                    </DropdownMenuItem>
                    {user.role === "admin" && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin">
                          <ShieldCheck />
                          {ka ? "ადმინისტრატორის პანელი" : "Admin panel"}
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onSelect={() => void logout()}
                      className="is-danger"
                    >
                      <LogOut />
                      {ka ? "გასვლა" : "Log out"}
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuLabel>
                      {ka
                        ? "შეკვეთების მარტივად სამართავად"
                        : "Manage your orders with an account"}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/login">
                        <LogIn />
                        {ka ? "შესვლა" : "Log in"}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/register">
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
              className="p1-icon-button p1-desktop-wish"
              aria-label={ka ? "რჩეულები" : "Wishlist"}
            >
              <Heart />
            </Link>
            <button
              type="button"
              className="p1-icon-button p1-cart-button"
              onClick={openDrawer}
              aria-label={ka ? "კალათა" : "Cart"}
            >
              <ShoppingBag />
              {count > 0 && <b>{count > 99 ? "99+" : count}</b>}
            </button>
          </div>
        </div>
      </header>

      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="p1-search-dialog">
          <DialogHeader>
            <p className="p1-kicker">FLOWER’S BOUTIQUE · SEARCH</p>
            <DialogTitle>
              {ka ? "რას ეძებთ?" : "What are you looking for?"}
            </DialogTitle>
            <DialogDescription>
              {ka
                ? "მოძებნეთ თაიგული სახელით ან შემთხვევით."
                : "Search the collection by bouquet or occasion."}
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={submitSearch}
            role="search"
            className="p1-search-dialog__form"
          >
            <Search aria-hidden="true" />
            <input
              autoFocus
              value={searchTerm}
              onChange={event => setSearchTerm(event.target.value)}
              placeholder={
                ka ? "მაგ. ვარდები, დაბადების დღე…" : "e.g. roses, birthday…"
              }
            />
            <button type="submit">
              {ka ? "ძიება" : "Search"}
              <ArrowRight />
            </button>
          </form>
        </DialogContent>
      </Dialog>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="left" className="p1-mobile-menu">
          <SheetHeader className="p1-mobile-menu__head">
            <p className="p1-kicker">FLOWER’S BOUTIQUE</p>
            <SheetTitle>{ka ? "მენიუ" : "Menu"}</SheetTitle>
            <SheetDescription>
              {ka
                ? "კოლექცია, სერვისები და თქვენი ანგარიში."
                : "Collection, services and your account."}
            </SheetDescription>
          </SheetHeader>
          <nav
            className="p1-mobile-menu__links"
            aria-label={ka ? "მობილური ნავიგაცია" : "Mobile navigation"}
          >
            <Link
              href="/"
              className={location === "/" ? "is-active" : ""}
              aria-current={location === "/" ? "page" : undefined}
            >
              {ka ? "მთავარი" : "Home"}
              <ArrowRight />
            </Link>
            {links.map(([href, label]) => (
              <Link
                key={href}
                href={href}
                className={isActive(href) ? "is-active" : ""}
                aria-current={isActive(href) ? "page" : undefined}
              >
                {label}
                <ArrowRight />
              </Link>
            ))}
          </nav>
          <div className="p1-mobile-menu__utilities">
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                setSearchOpen(true);
              }}
            >
              <Search />
              {ka ? "ძიება" : "Search"}
            </button>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                setContactOpen(true);
              }}
            >
              <MessageCircle />
              {ka ? "სწრაფი კონტაქტი" : "Quick contact"}
            </button>
          </div>
          <div className="p1-mobile-menu__language">
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
          <div className="p1-mobile-menu__account">
            {user ? (
              <>
                <Link href="/profile">
                  <UserRound />
                  {ka ? "პროფილი და შეკვეთები" : "Profile and orders"}
                </Link>
                {user.role === "admin" && (
                  <Link href="/admin">
                    <ShieldCheck />
                    {ka ? "ადმინისტრატორის პანელი" : "Admin panel"}
                  </Link>
                )}
                <button type="button" onClick={() => void logout()}>
                  <LogOut />
                  {ka ? "გასვლა" : "Log out"}
                </button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <LogIn />
                  {ka ? "შესვლა" : "Log in"}
                </Link>
                <Link href="/register">
                  <UserPlus />
                  {ka ? "რეგისტრაცია" : "Register"}
                </Link>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
      <ContactSheet open={contactOpen} onOpenChange={setContactOpen} />
      <MobileBottomNav />
    </>
  );
}
