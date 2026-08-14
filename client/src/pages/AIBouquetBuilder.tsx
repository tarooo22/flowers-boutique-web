import { AIBouquetMode } from "@/components/bouquet-builder/AIBouquetMode";
import type { BuilderProduct } from "@/components/bouquet-builder/builderTypes";
import { VisualBouquetBuilder } from "@/components/bouquet-builder/VisualBouquetBuilder";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Sparkles, WandSparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { useCartDrawer } from "@/contexts/CartDrawerContext";
import { useSEO } from "@/hooks/useSEO";

export default function AIBouquetBuilder() {
  const { language } = useLanguage();
  const [mode, setMode] = useState<"visual" | "ai">("visual");
  const { openDrawer } = useCartDrawer();

  useSEO({
    titleKa: "თაიგულის კონსტრუქტორი | ყვავილების ბუტიკი & ივენთები",
    titleEn: "Build Your Bouquet | Flower’s Boutique & Events",
    descriptionKa: "შექმენით თქვენი თაიგული ხელმისაწვდომი ყვავილებიდან, შეფუთვითა და ლენტით.",
    descriptionEn: "Create a considered bouquet from available flowers, wrapping, and ribbon.",
    canonical: "/bouquet-builder",
    lang: language as "ka" | "en",
  });

  const { data: products = [], isLoading: productsLoading } =
    trpc.products.list.useQuery();
  const { data: categories = [], isLoading: categoriesLoading } =
    trpc.categories.list.useQuery();

  const singleStemProducts = useMemo(() => {
    const singleStemCategory = categories.find(category => {
      const normalizedEnglishName = category.nameEn?.trim().toLowerCase();
      return (
        category.slug === "single-stems" ||
        normalizedEnglishName === "single stems"
      );
    });

    if (!singleStemCategory) return [];
    const typedProducts = products as BuilderProduct[];

    return typedProducts.filter(
      (product: BuilderProduct) => product.categoryId === singleStemCategory.id
    );
  }, [categories, products]);

  return (
    <div className="p2-builder-page min-h-screen bg-[#faf7f2]">
      <Navbar />

      <main id="main-content" className="p2-builder-main mx-auto max-w-[1460px] px-4 py-6 sm:px-6 sm:py-8">
        <section className="p2-builder-intro p2-builder-journey mb-6 grid gap-4 rounded-2xl border border-[#eadfce] bg-[#171717] p-5 text-[#f7f2e9] sm:grid-cols-[1fr_auto] sm:items-center sm:p-6" aria-labelledby="builder-page-title">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#e2c58b]">01 · {language === "ka" ? "აირჩიეთ ყვავილები" : "Choose flowers first"}</p>
            <h1 id="builder-page-title" className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[#f7f2e9] sm:text-3xl">{language === "ka" ? "შექმენით თქვენი თაიგული" : "Build your bouquet"}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">{language === "ka" ? "შემდეგ აირჩიეთ შეფუთვა და ლენტი, გადაამოწმეთ ფასი და დაამატეთ თაიგული კალათაში." : "Then choose wrapping and ribbon, review the price, and add your bouquet to cart."}</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-white/55"><span className="rounded-full bg-[#c9a86a] px-3 py-1.5 font-semibold text-[#171717]">1 {language === "ka" ? "ყვავილები" : "Flowers"}</span><span>→</span><span>2 {language === "ka" ? "შეფუთვა" : "Wrap"}</span><span>→</span><span>3 {language === "ka" ? "კალათა" : "Cart"}</span></div>
        </section>
        <Tabs
          value={mode}
          onValueChange={value => setMode(value as "visual" | "ai")}
          className="p2-builder-mode-switcher w-full"
          aria-labelledby="builder-page-title"
        >
          <TabsList className="p2-builder-tabs mb-6 grid h-auto w-full grid-cols-2 rounded-2xl border border-[#eadfce] bg-white p-1.5 shadow-[0_10px_30px_rgba(83,61,40,0.05)] sm:mb-8">
            <TabsTrigger
              value="visual"
              className="min-h-12 gap-2 rounded-xl text-sm font-semibold text-[#74685c] data-[state=active]:bg-[#f2e7d7] data-[state=active]:text-[#8c6030] data-[state=active]:shadow-none"
            >
              <WandSparkles className="h-4 w-4" />
              {language === "ka" ? "ვიზუალური თაიგული" : "Visual bouquet"}
            </TabsTrigger>
            <TabsTrigger
              value="ai"
              className="min-h-12 gap-2 rounded-xl text-sm font-semibold text-[#74685c] data-[state=active]:bg-[#30291f] data-[state=active]:text-white data-[state=active]:shadow-none"
            >
              <Sparkles className="h-4 w-4" />
              {language === "ka" ? "AI თაიგული" : "AI bouquet"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="visual" className="p2-builder-tab-panel mt-0">
            <VisualBouquetBuilder
              products={singleStemProducts}
              isLoading={productsLoading || categoriesLoading}
              language={language}
              onCartOpen={() => openDrawer()}
            />
          </TabsContent>

          <TabsContent value="ai" className="p2-builder-tab-panel mt-0">
            <AIBouquetMode
              language={language}
              products={singleStemProducts}
              isLoading={productsLoading || categoriesLoading}
            />
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
      <CartDrawer />
    </div>
  );
}
