import { Hero } from "@/components/home/Hero";
import { Marquee } from "@/components/home/Marquee";
import { CategoryChips } from "@/components/home/CategoryChips";
import { ProductSection } from "@/components/home/ProductSection";
import { CashbackBanner } from "@/components/home/CashbackBanner";
import { BuilderPromo } from "@/components/home/BuilderPromo";
import { EditorialSection } from "@/components/home/EditorialSection";
import { JournalSection } from "@/components/home/JournalSection";
import { ManagedBanners } from "@/components/home/ManagedBanners";
import { listProductionHomepageBanners } from "@/lib/production/admin";
import { listLiveProducts } from "@/lib/production/catalog";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [products, managedBanners] = await Promise.all([listLiveProducts(12), listProductionHomepageBanners()]);
  const bestsellers = products.filter((product) => product.bestseller).slice(0, 4);
  const leadProducts = (bestsellers.length ? bestsellers : products).slice(0, 4);
  const nextProducts = products.filter((product) => !leadProducts.some((lead) => lead.id === product.id)).slice(0, 4);

  return (
    <div className="pb-20 sm:pb-28">
      <Hero />
      <Marquee />
      <CategoryChips />
      <ManagedBanners banners={managedBanners} />
      {/* Bestsellers lead, then the rewards banner breaks up the product rows */}
      <ProductSection
        titleKey="sec.best.title"
        eyebrowKey="sec.best.eyebrow"
        products={leadProducts}
        viewAllHref="/catalog"
        priorityCount={2}
      />
      <BuilderPromo />
      <CashbackBanner />
      <ProductSection
        titleKey="sec.romance.title"
        eyebrowKey="sec.romance.eyebrow"
        products={nextProducts}
        viewAllHref="/catalog?occasion=romance"
      />
      <ProductSection
        titleKey="sec.joy.title"
        eyebrowKey="sec.joy.eyebrow"
        products={products.slice(8, 12)}
        viewAllHref="/catalog?occasion=joy"
      />
      <EditorialSection />
      <JournalSection />
    </div>
  );
}
