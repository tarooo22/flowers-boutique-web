import { useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Flower2,
  MapPin,
  MessageCircle,
  Phone,
  Send,
} from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { addToCart } from "@/lib/cartUtils";
import { useCartDrawer } from "@/contexts/CartDrawerContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSEO } from "@/hooks/useSEO";
import {
  generateLocalBusinessSchema,
  generateOrganizationSchema,
} from "@/lib/jsonLd";
import { cleanProductName } from "@/lib/productPresentation";
import EditorialImage from "@/components/EditorialImage";
import { phoneHref, siteContact } from "@/lib/siteConfig";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import ProductCard from "@/components/product/ProductCard";

export default function Home() {
  const { language, t } = useLanguage();
  const { openDrawer } = useCartDrawer();
  const [heroImageReady, setHeroImageReady] = useState(false);
  const productsQuery = trpc.products.list.useQuery();
  const categoriesQuery = trpc.categories.list.useQuery();
  const ka = language === "ka";
  const products = productsQuery.data ?? [];
  const categories = (categoriesQuery.data ?? []).slice(0, 5);
  const featured = products
    .filter(
      (product: any) =>
        product.published && (product.featured || product.isAvailable)
    )
    .slice(0, 8);
  const persistentEditorialImages = useMemo(
    () =>
      products
        .map((product: any) => product.imageUrl)
        .filter((imageUrl: unknown): imageUrl is string => Boolean(imageUrl)),
    [products]
  );
  useSEO({
    titleKa: "Flower’s Boutique | ყვავილები განსაკუთრებული მომენტებისთვის",
    titleEn: "Flower’s Boutique | Flowers for meaningful moments",
    descriptionKa:
      "მზა თაიგულები, ინდივიდუალური კომპოზიციები და შეკვეთის მარტივი პროცესი თბილისში.",
    descriptionEn:
      "Ready-made bouquets, custom floral compositions and a simple ordering experience in Tbilisi.",
    canonical: "/",
    structuredData: [
      generateOrganizationSchema(),
      generateLocalBusinessSchema(),
    ],
    lang: language as "ka" | "en",
  });

  const quickAdd = (product: any) => {
    addToCart({
      productId: product.id,
      name: ka ? product.nameKa : product.nameEn,
      price: Number(product.salePrice ?? product.priceMin ?? 0),
      quantity: 1,
      unitType: product.unitType || "",
      imageUrl: product.imageUrl,
    });
    toast.success(t("home.cartAdded"));
    openDrawer();
  };

  return (
    <div className="p1-site">
      <Navbar />
      <main id="main-content">
        <section
          className="p1-hero p1-hero--editorial"
          aria-labelledby="p1-hero-title"
        >
          <div className="p1-hero__copy">
            <p className="p1-kicker">FLOWER’S BOUTIQUE</p>
            <h1 id="p1-hero-title">{t("home.simpleHero.title")}</h1>
            <p>{t("home.simpleHero.copy")}</p>
            <div className="p1-hero__actions">
              <Link href="/catalog" className="p1-button p1-button--primary">
                {t("home.simpleHero.primary")}
                <ArrowRight aria-hidden="true" />
              </Link>
              <Link
                href="/bouquet-builder"
                className="p1-button p1-button--text"
              >
                {t("home.simpleHero.secondary")}
                <ArrowRight aria-hidden="true" />
              </Link>
            </div>
          </div>
          <picture
            className={`p1-hero__media ${heroImageReady ? "is-loaded" : ""}`}
          >
            <source
              type="image/avif"
              media="(max-width: 767px)"
              srcSet="/flower-assets/hero/light-studio-mobile.avif"
            />
            <source
              type="image/webp"
              media="(max-width: 767px)"
              srcSet="/flower-assets/hero/light-studio-mobile.webp"
            />
            <source
              type="image/avif"
              srcSet="/flower-assets/hero/light-studio-desktop.avif"
            />
            <img
              className="p1-hero__image"
              src="/flower-assets/hero/light-studio-desktop.webp"
              alt={t("home.simpleHero.imageAlt")}
              width="1280"
              height="960"
              fetchPriority="high"
              onLoad={() => setHeroImageReady(true)}
            />
          </picture>
        </section>

        <section
          className="p1-category-section"
          aria-labelledby="p1-categories-title"
        >
          <div className="p1-section-heading p1-section-heading--compact">
            <div>
              <p className="p1-kicker">{t("home.categories.eyebrow")}</p>
              <h2 id="p1-categories-title">{t("home.categories.title")}</h2>
            </div>
          </div>
          <nav
            className="p1-category-links"
            aria-label={t("home.categories.label")}
          >
            <Link href="/catalog" className="is-primary">
              {t("home.categories.all")}
              <ArrowRight aria-hidden="true" />
            </Link>
            {categories.map((category: any) => (
              <Link key={category.id} href={`/catalog?category=${category.id}`}>
                {cleanProductName(
                  ka ? category.nameKa : category.nameEn,
                  ka ? "კატეგორია" : "Category"
                )}
              </Link>
            ))}
          </nav>
        </section>

        <section
          className="p1-section p1-signatures"
          aria-labelledby="p1-signatures-title"
        >
          <div className="p1-section-heading">
            <div>
              <p className="p1-kicker">{t("home.products.eyebrow")}</p>
              <h2 id="p1-signatures-title">{t("home.products.title")}</h2>
            </div>
            <Link href="/catalog">
              {t("home.products.all")}
              <ArrowRight aria-hidden="true" />
            </Link>
          </div>
          {productsQuery.isLoading ? (
            <div className="p1-product-grid" aria-label={t("common.loading")}>
              {Array.from({ length: 8 }).map((_, index) => (
                <div className="p1-product-skeleton" key={index} />
              ))}
            </div>
          ) : productsQuery.isError ? (
            <div className="p1-collection-state" role="status">
              <Flower2 aria-hidden="true" />
              <h3>{t("home.products.errorTitle")}</h3>
              <p>{t("home.products.errorCopy")}</p>
              <button type="button" onClick={() => productsQuery.refetch()}>
                {t("home.products.retry")}
              </button>
            </div>
          ) : featured.length ? (
            <div className="p1-product-grid">
              {featured.map((product: any) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  language={language}
                  onAdd={quickAdd}
                />
              ))}
            </div>
          ) : (
            <div className="p1-collection-state">
              <Flower2 aria-hidden="true" />
              <h3>{t("home.products.emptyTitle")}</h3>
              <p>{t("home.products.emptyCopy")}</p>
              <Link href="/contact">{t("nav.contact")}</Link>
            </div>
          )}
        </section>

        <section
          className="p1-builder-promo"
          aria-labelledby="p1-builder-title"
        >
          <div className="p1-builder-promo__media">
            <EditorialImage
              slot="builder"
              fallbackImages={persistentEditorialImages}
              alt={t("home.builder.imageAlt")}
              width={1000}
              height={1000}
              loading="lazy"
            />
          </div>
          <div className="p1-builder-promo__copy">
            <p className="p1-kicker">{t("home.builder.eyebrow")}</p>
            <h2 id="p1-builder-title">{t("home.builder.title")}</h2>
            <p>{t("home.builder.copy")}</p>
            <Link
              href="/bouquet-builder"
              className="p1-button p1-button--primary"
            >
              {t("home.builder.cta")}
              <ArrowRight aria-hidden="true" />
            </Link>
          </div>
        </section>

        <section className="p1-delivery" aria-labelledby="p1-delivery-title">
          <div className="p1-delivery__heading">
            <p className="p1-kicker">{t("home.delivery.eyebrow")}</p>
            <h2 id="p1-delivery-title">{t("home.delivery.title")}</h2>
          </div>
          <ol>
            {[
              [Flower2, "home.delivery.step1Title", "home.delivery.step1Copy"],
              [MapPin, "home.delivery.step2Title", "home.delivery.step2Copy"],
              [
                CheckCircle2,
                "home.delivery.step3Title",
                "home.delivery.step3Copy",
              ],
            ].map(([Icon, titleKey, copyKey]: any, index) => (
              <li key={titleKey}>
                <span>0{index + 1}</span>
                <Icon aria-hidden="true" />
                <h3>{t(titleKey)}</h3>
                <p>{t(copyKey)}</p>
              </li>
            ))}
          </ol>
          <Link href="/delivery">
            {t("home.delivery.link")}
            <ArrowRight aria-hidden="true" />
          </Link>
        </section>

        <section className="p1-brand-moment" aria-labelledby="p1-brand-title">
          <div className="p1-brand-moment__copy">
            <p className="p1-kicker">FLOWER’S BOUTIQUE · TBILISI</p>
            <h2 id="p1-brand-title">{t("home.brand.title")}</h2>
            <p>{t("home.brand.copy")}</p>
            <Link href="/about">
              {t("home.brand.link")}
              <ArrowRight aria-hidden="true" />
            </Link>
          </div>
          <EditorialImage
            slot="brand"
            fallbackImages={persistentEditorialImages}
            alt={t("home.brand.imageAlt")}
            width={1200}
            height={1346}
            loading="lazy"
          />
        </section>

        <section className="p1-contact-cta" aria-labelledby="p1-contact-title">
          <div>
            <p className="p1-kicker">{t("home.contact.eyebrow")}</p>
            <h2 id="p1-contact-title">{t("home.contact.title")}</h2>
            <p>{t("home.contact.copy")}</p>
          </div>
          <div className="p1-contact-cta__actions">
            {siteContact.whatsapp && (
              <a href={siteContact.whatsapp} target="_blank" rel="noreferrer">
                <Send aria-hidden="true" />
                WhatsApp
              </a>
            )}
            {siteContact.messenger && (
              <a href={siteContact.messenger} target="_blank" rel="noreferrer">
                <MessageCircle aria-hidden="true" />
                Messenger
              </a>
            )}
            {siteContact.phone && (
              <a href={phoneHref}>
                <Phone aria-hidden="true" />
                {siteContact.phone}
              </a>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
