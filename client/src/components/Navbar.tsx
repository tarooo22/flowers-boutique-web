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
    ["/catalog", ka ? "ყველა თაიგული" : "All bouquets"],
    ["/bouquet-builder", ka ? "შექმენი თაიგული" : "Create bouquet"],
    ["/about", ka ? "ჩვენ შესახებ" : "About us"],
    ["/contact", ka ? "კონტაქტი" : "Contact"],
  ] as const;
  const primaryLinks = links;

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
    navigate(query ? `/catalog?search=${encodeURIComponent(query)}` : "/catalog");
  };

  return (
    <>
      <a className="am-skip-link" href="#main-content">
        {ka ? "მთავარ შინაარსზე გადასვლა" : "Skip to main content"}
      </a>
      <header className={`am-header ${scrolled ? "is-scrolled" : ""}`}>
        <div className="am-announcement" aria-label={ka ? "მიწოდებისა და კონტაქტის ინფორმაცია" : "Delivery and contact information"}>
          <p>
            {ka
              ? `თბილისში მიწოდება ₾${DELIVERY_FEE_GEL} · უფასო ₾${FREE_DELIVERY_THRESHOLD_GEL}-დან`
              : `Tbilisi delivery ₾${DELIVERY_FEE_GEL} · Free from ₾${FREE_DELIVERY_THRESHOLD_GEL}`}
          </p>
          {siteContact.phone && <a href={phoneHref}>{siteContact.phone}</a>}
        </div>
        <div className="am-header__main">
          <button
            type="button"
            className="am-icon-button am-mobile-trigger"
            onClick={() => setMenuOpen(true)}
            aria-label={ka ? "მენიუს გახსნა" : "Open menu"}
          >
            <Menu />
          </button>

          <Link href="/" className="am-brand" aria-label={ka ? "ყვავილების ბუტიკი და ივენთები — მთავარი" : "Flower’s Boutique & Events home"}>
            <BrandWordmark language={language} className="am-brand__wordmark" />
          </Link>

          <nav className="am-primary-nav" aria-label={ka ? "მთავარი ნავიგაცია" : "Primary navigation"}>
            {primaryLinks.map(([href, label]) => (
              <Link key={href} href={href} className={isActive(href) ? "is-active" : ""} aria-current={isActive(href) ? "page" : undefined}>
                {label}
              </Link>
            ))}
          </nav>

          <div className="am-header__tools">
            <div className="am-language" aria-label={ka ? "ენის არჩევა" : "Language selector"}>
              <button type="button" className={language === "ka" ? "is-active" : ""} onClick={() => setLanguage("ka")} aria-pressed={language === "ka"}>
                ქარ
              </button>
              <button type="button" className={language === "en" ? "is-active" : ""} onClick={() => setLanguage("en")} aria-pressed={language === "en"}>
                ENG
              </button>
            </div>
            <button type="button" className="am-icon-button" onClick={() => setSearchOpen(true)} aria-label={ka ? "ძიება" : "Search"}>
              <Search />
            </button>
            {user?.role === "admin" && (
              <Link href="/admin" className="am-icon-button am-admin-link" aria-label={ka ? "ადმინისტრატორის პანელი" : "Admin panel"}>
                <ShieldCheck />
              </Link>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="am-icon-button am-account-trigger"
                  disabled={loading}
                  aria-label={user ? (ka ? "ჩემი ანგარიში" : "My account") : (ka ? "შესვლა ან რეგისტრაცია" : "Log in or register")}
                >
                  <UserRound />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" sideOffset={10} className="am-account-menu">
                {user ? (
                  <>
                    <DropdownMenuLabel className="am-account-menu__identity">
                      <strong>{user.name || (ka ? "ჩემი ანგარიში" : "My account")}</strong>
                      <span>{user.email}</span>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile"><UserRound />{ka ? "პროფილი და შეკვეთები" : "Profile and orders"}</Link>
                    </DropdownMenuItem>
                    {user.role === "admin" && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin"><ShieldCheck />{ka ? "ადმინისტრატორის პანელი" : "Admin panel"}</Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={() => void logout()} className="is-danger">
                      <LogOut />{ka ? "გასვლა" : "Log out"}
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuLabel>{ka ? "შეკვეთების მარტივად სამართავად" : "Manage your orders with an account"}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/login"><LogIn />{ka ? "შესვლა" : "Log in"}</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/register"><UserPlus />{ka ? "რეგისტრაცია" : "Register"}</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            <Link href="/wishlist" className="am-icon-button am-wishlist-link" aria-label={ka ? "რჩეულები" : "Wishlist"}>
              <Heart />
            </Link>
            <button type="button" className="am-icon-button am-cart-button" onClick={openDrawer} aria-label={ka ? "კალათა" : "Cart"}>
              <ShoppingBag />
              {count > 0 && <b>{count > 99 ? "99+" : count}</b>}
            </button>
          </div>
        </div>
      </header>

      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="am-search-dialog">
          <DialogHeader>
            <p className="am-kicker">FLOWER’S BOUTIQUE · SEARCH</p>
            <DialogTitle>{ka ? "რას ეძებთ?" : "What are you looking for?"}</DialogTitle>
            <DialogDescription>{ka ? "მოძებნეთ თაიგული სახელით ან შემთხვევით." : "Search the collection by bouquet or occasion."}</DialogDescription>
          </DialogHeader>
          <form onSubmit={submitSearch} role="search" className="am-search-dialog__form">
            <Search aria-hidden="true" />
            <input autoFocus value={searchTerm} onChange={event => setSearchTerm(event.target.value)} placeholder={ka ? "მაგ. ვარდები, დაბადების დღე…" : "e.g. roses, birthday…"} />
            <button type="submit">{ka ? "ძიება" : "Search"}<ArrowRight /></button>
          </form>
        </DialogContent>
      </Dialog>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="left" className="am-mobile-menu">
          <SheetHeader className="am-mobile-menu__head">
            <p className="am-kicker">FLOWER’S BOUTIQUE</p>
            <SheetTitle>{ka ? "მენიუ" : "Menu"}</SheetTitle>
            <SheetDescription>{ka ? "კოლექცია, სერვისები და თქვენი ანგარიში." : "Collection, services and your account."}</SheetDescription>
          </SheetHeader>
          <nav className="am-mobile-menu__links" aria-label={ka ? "მობილური ნავიგაცია" : "Mobile navigation"}>
            <Link href="/" className={location === "/" ? "is-active" : ""} aria-current={location === "/" ? "page" : undefined}>{ka ? "მთავარი" : "Home"}<ArrowRight /></Link>
            {links.map(([href, label]) => (
              <Link key={href} href={href} className={isActive(href) ? "is-active" : ""} aria-current={isActive(href) ? "page" : undefined}>{label}<ArrowRight /></Link>
            ))}
          </nav>
          <div className="am-mobile-menu__utilities">
            <button type="button" onClick={() => { setMenuOpen(false); setSearchOpen(true); }}><Search />{ka ? "ძიება" : "Search"}</button>
            <button type="button" onClick={() => { setMenuOpen(false); setContactOpen(true); }}><MessageCircle />{ka ? "სწრაფი კონტაქტი" : "Quick contact"}</button>
          </div>
          <Link href="/wishlist" className="am-mobile-menu__delivery-link"><span>{ka ? "რჩეულები" : "Wishlist"}</span><Heart aria-hidden="true" /></Link>
          <Link href="/delivery" className="am-mobile-menu__delivery-link"><span>{ka ? "მიწოდების პირობები" : "Delivery information"}</span><ArrowRight aria-hidden="true" /></Link>
          <div className="am-mobile-menu__language">
            <button type="button" className={language === "ka" ? "is-active" : ""} onClick={() => setLanguage("ka")}>ქართული</button>
            <button type="button" className={language === "en" ? "is-active" : ""} onClick={() => setLanguage("en")}>English</button>
          </div>
          <div className="am-mobile-menu__account">
            {user ? (
              <>
                <Link href="/profile"><UserRound />{ka ? "პროფილი და შეკვეთები" : "Profile and orders"}</Link>
                {user.role === "admin" && <Link href="/admin"><ShieldCheck />{ka ? "ადმინისტრატორის პანელი" : "Admin panel"}</Link>}
                <button type="button" onClick={() => void logout()}><LogOut />{ka ? "გასვლა" : "Log out"}</button>
              </>
            ) : (
              <>
                <Link href="/login"><LogIn />{ka ? "შესვლა" : "Log in"}</Link>
                <Link href="/register"><UserPlus />{ka ? "რეგისტრაცია" : "Register"}</Link>
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
