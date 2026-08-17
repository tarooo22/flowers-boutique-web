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
    <div className="p2-builder-page builder-editorial-page min-h-screen bg-[#faf7f2]">
      <Navbar />

      <main id="main-content" className="p2-builder-main builder-editorial-main mx-auto max-w-[1460px] px-4 py-6 sm:px-6 sm:py-8">
        <section className="p2-builder-intro p2-builder-journey builder-editorial-hero" aria-labelledby="builder-page-title">
          <div>
            <p className="builder-editorial-eyebrow">{language === "ka" ? "თაიგულის ატელიე" : "Bouquet atelier"}</p>
            <h1 id="builder-page-title">{language === "ka" ? "შექმენი შენი თაიგული" : "Create your bouquet"}</h1>
            <p>{language === "ka" ? "აირჩიეთ მზა ვიზუალური კომპოზიცია ან შექმენით AI თაიგული თქვენთვის სასურველი ყვავილებით." : "Choose a visual composition or create an AI bouquet from your preferred flowers."}</p>
          </div>
        </section>
        <Tabs
          value={mode}
          onValueChange={value => setMode(value as "visual" | "ai")}
          className="p2-builder-mode-switcher builder-zip-mode-switcher w-full"
          aria-labelledby="builder-page-title"
        >
          <TabsList className="p2-builder-tabs builder-editorial-tabs mb-2 flex h-auto w-full justify-start gap-2 bg-transparent p-0 shadow-none sm:mb-2">
            <TabsTrigger
              value="visual"
              className="min-h-11 gap-2 rounded-full border px-5 text-sm font-semibold"
            >
              <WandSparkles className="h-4 w-4" />
              {language === "ka" ? "ვიზუალური თაიგული" : "Visual bouquet"}
            </TabsTrigger>
            <TabsTrigger
              value="ai"
              className="min-h-11 gap-2 rounded-full border px-5 text-sm font-semibold"
            >
              <Sparkles className="h-4 w-4" />
              {language === "ka" ? "AI თაიგული" : "AI bouquet"}
            </TabsTrigger>
          </TabsList>
          <p className="builder-zip-mode-hint" aria-live="polite">
            {mode === "visual"
              ? language === "ka"
                ? "აირჩიეთ ყვავილები, შეფუთვა და ლენტი — კომპოზიცია მყისიერად განახლდება."
                : "Choose flowers, wrapping and ribbon — your composition updates instantly."
              : language === "ka"
                ? "აირჩიეთ ცალკეული ყვავილები და დააკვირდით თქვენს ცოცხალ AI კომპოზიციას."
                : "Choose individual flowers and follow your live AI composition."}
          </p>

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
