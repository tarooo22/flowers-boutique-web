import { ArrowRight, ShoppingBag, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCartDrawer } from "@/contexts/CartDrawerContext";
import { addToCart } from "@/lib/cartUtils";
import { toast } from "sonner";
import FlowerImage from "@/components/FlowerImage";
import CartDrawer from "@/components/CartDrawer";
import ScrollExpansionHero from "@/components/ScrollExpansionHero";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getProductName } from "@/lib/productPresentation";

const choices = [
  ["For her", "\u10db\u10d8\u10e1\u10d7\u10d5\u10d8\u10e1", "/flower-assets/editorial/pink-roses.webp"],
  ["A joyful gesture", "\u10e1\u10d8\u10ee\u10d0\u10e0\u10e3\u10da\u10d8\u10e1\u10d7\u10d5\u10d8\u10e1", "/flower-assets/products/8319.webp"],
  ["Made to order", "\u10d7\u10e5\u10d5\u10d4\u10dc\u10d8 \u10d8\u10d3\u10d4\u10d8\u10d7", "/flower-assets/editorial/mixed-bouquet.webp"],
] as const;

export default function RedesignPreview() {
  const { language } = useLanguage();
  const { openDrawer } = useCartDrawer();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const reduceMotion = useReducedMotion();
  const { data: products = [] } = trpc.products.list.useQuery();
  const ka = language === "ka";
  const featured = products.filter((p: any) => p.published && p.isAvailable).slice(0, 4);
  const copy = ka ? {
    announce: "\u10d7\u10d1\u10d8\u10da\u10d8\u10e1\u10d8 \u00b7 \u10d8\u10dc\u10d3\u10d8\u10d5\u10d8\u10d3\u10e3\u10d0\u10da\u10e3\u10e0\u10d8 \u10d7\u10d0\u10d8\u10d2\u10e3\u10da\u10d4\u10d1\u10d8 \u10d3\u10d0 \u10db\u10d8\u10ec\u10dd\u10d3\u10d4\u10d1\u10d0",
    collection: "\u10d9\u10dd\u10da\u10d4\u10e5\u10ea\u10d8\u10d0", builder: "\u10e8\u10d4\u10e5\u10db\u10d4\u10dc\u10d8 \u10d7\u10d0\u10d8\u10d2\u10e3\u10da\u10d8", story: "\u10e9\u10d5\u10d4\u10dc \u10e8\u10d4\u10e1\u10d0\u10ee\u10d4\u10d1",
    title: "\u10e7\u10d5\u10d0\u10d5\u10d8\u10da\u10d4\u10d1\u10d8, \u10e0\u10dd\u10db\u10da\u10d4\u10d1\u10d8\u10ea \u10d7\u10e5\u10d5\u10d4\u10dc\u10e1 \u10dc\u10d0\u10ea\u10d5\u10da\u10d0\u10d3 \u10d0\u10db\u10d1\u10dd\u10d1\u10d4\u10dc.",
    body: "\u10d2\u10d0\u10dc\u10e1\u10d0\u10d9\u10e3\u10d7\u10e0\u10d4\u10d1\u10e3\u10da\u10d8 \u10db\u10dd\u10db\u10d4\u10dc\u10e2\u10d4\u10d1\u10d8\u10e1\u10d7\u10d5\u10d8\u10e1 \u10e8\u10d4\u10e5\u10db\u10dc\u10d8\u10da\u10d8 \u10ea\u10dd\u10ea\u10ee\u10d0\u10da\u10d8 \u10d9\u10dd\u10db\u10de\u10dd\u10d6\u10d8\u10ea\u10d8\u10d4\u10d1\u10d8.",
    explore: "\u10d9\u10dd\u10da\u10d4\u10e5\u10ea\u10d8\u10d8\u10e1 \u10dc\u10d0\u10ee\u10d5\u10d0", choose: "\u10d0\u10d8\u10e0\u10e9\u10d8\u10d4\u10d7 \u10d2\u10d0\u10dc\u10ec\u10e7\u10dd\u10d1\u10d0", signatures: "\u10d7\u10d0\u10d8\u10d2\u10e3\u10da\u10d4\u10d1\u10d8, \u10e0\u10dd\u10db\u10da\u10d4\u10d1\u10d8\u10ea \u10e0\u10e9\u10d4\u10d1\u10d0", add: "\u10d9\u10d0\u10da\u10d0\u10d7\u10d0\u10e8\u10d8 \u10d3\u10d0\u10db\u10d0\u10e2\u10d4\u10d1\u10d0"
  } : { announce: "TBILISI · CONSIDERED FLOWERS & DELIVERY", collection: "Collection", builder: "Create a bouquet", story: "Our story", title: "Flowers that speak for you.", body: "Living compositions for meaningful moments — made with care, considered for you.", explore: "Explore collection", choose: "Choose the feeling", signatures: "Bouquets that stay with you", add: "Add to cart" };
  const add = (p: any) => { addToCart({ productId: p.id, name: getProductName(p, language), price: Number(p.priceMin || 0), quantity: 1, unitType: p.unitType || "", imageUrl: p.imageUrl }); toast.success(ka ? "\u10d9\u10d0\u10da\u10d0\u10d7\u10d0\u10e8\u10d8 \u10d3\u10d0\u10d4\u10db\u10d0\u10e2\u10d0" : "Added to cart"); openDrawer(); };
  return <div className="min-h-screen overflow-x-clip bg-[#f7f2e9] text-[#161412]">
    <Navbar />
    <main>
      <section className="grid min-h-[min(760px,calc(100dvh-106px))] bg-[#161412] text-[#f7f2e9] lg:grid-cols-[.45fr_.55fr]"><div className="flex items-center px-5 py-16 sm:px-10 lg:px-[clamp(48px,8vw,132px)]"><div className="max-w-xl"><p className="mb-6 text-[11px] font-semibold tracking-[.2em] text-[#e6d0a2]">FLOWER’S BOUTIQUE · 01</p><h1 className="font-serif text-[clamp(48px,6.2vw,92px)] leading-[.94] tracking-[-.055em]">{copy.title}</h1><p className="mt-7 max-w-md text-base leading-7 text-white/70">{copy.body}</p><div className="mt-9 flex flex-wrap gap-3"><Link href="/catalog" className="inline-flex min-h-12 items-center gap-2 bg-[#d8bd86] px-5 text-sm font-semibold text-[#17130e]">{copy.explore}<ArrowRight size={17}/></Link><Link href="/bouquet-builder" className="inline-flex min-h-12 items-center gap-2 border border-white/40 px-5 text-sm">{copy.builder}</Link></div></div></div><div className="relative min-h-[430px] overflow-hidden"><img src="/flower-assets/hero/dark-botanical.webp" alt="Botanical floral composition" width="1920" height="1280" fetchPriority="high" className="h-full w-full object-cover"/><div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#161412]/35"/></div></section>
      <motion.section initial={reduceMotion ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }} transition={{ duration: .55 }} className="mx-auto max-w-[1320px] px-4 py-20 sm:px-6"><p className="text-[11px] font-semibold tracking-[.2em] text-[#9a783f]">DISCOVER · 02</p><h2 className="mt-3 font-serif text-4xl tracking-[-.04em] sm:text-5xl">{copy.choose}</h2><div className="mt-9 grid gap-4 md:grid-cols-3">{choices.map(([en, geo, src], i) => <Link href={i === 2 ? "/bouquet-builder" : "/catalog"} key={src} className="group relative aspect-[4/5] overflow-hidden bg-[#29251f]"><img src={src} alt={ka ? geo : en} loading="lazy" className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.025]"/><div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"/><div className="absolute inset-x-5 bottom-5 flex items-end justify-between text-white"><h3 className="font-serif text-3xl">{ka ? geo : en}</h3><ArrowRight/></div></Link>)}</div></motion.section>
      <ScrollExpansionHero mediaSrc="/flower-assets/editorial/mixed-bouquet.webp" bgImageSrc="/flower-assets/hero/dark-botanical.webp" eyebrow={ka ? "ყვავილების სტუდია · 02.5" : "THE FLORAL STUDIO · 02.5"} title={ka ? "ყვავილები, რომლებიც სივრცეს ცვლიან." : "Flowers that change the room."} prompt={ka ? "ჩამოსქროლეთ გასაფართოებლად" : "Scroll to reveal the atelier"} description={ka ? "ხელით აწყობილი კომპოზიციები ყოველდღიურობისთვის." : "Hand-arranged compositions for the moments that matter."} />
      <section className="cinematic-story"><div className="cinematic-story__copy"><p>THE FLORAL STUDIO · 02.5</p><h2>{ka ? "ყვავილები ყოველდღიურობას ხელოვნებად აქცევს." : "Flowers turn the everyday into art."}</h2><span>{ka ? "ყოველი კომპოზიცია ხელით იკვრება, იმავე დღის მიწოდებისთვის თბილისში." : "Every composition is arranged by hand for considered same-day delivery in Tbilisi."}</span></div><motion.div className="cinematic-story__collage" style={reduceMotion ? undefined : { rotateX: tilt.y, rotateY: tilt.x }} onPointerMove={(event) => { if (!reduceMotion) { const rect = event.currentTarget.getBoundingClientRect(); setTilt({ x: ((event.clientX - rect.left) / rect.width - .5) * 7, y: -((event.clientY - rect.top) / rect.height - .5) * 7 }); } }} onPointerLeave={() => setTilt({ x: 0, y: 0 })}><img src="/flower-assets/products/8346.webp" alt={ka ? "ყვავილების თაიგული" : "Hand-arranged bouquet"} loading="lazy"/><img src="/flower-assets/editorial/pink-roses.webp" alt="" aria-hidden="true" loading="lazy"/></motion.div></section>
      <section className="border-y border-[#d9cfbf] bg-[#fffdf8] py-20"><div className="mx-auto max-w-[1320px] px-4 sm:px-6"><p className="text-[11px] font-semibold tracking-[.2em] text-[#9a783f]">SIGNATURES · 03</p><h2 className="mt-3 font-serif text-4xl tracking-[-.04em] sm:text-5xl">{copy.signatures}</h2><div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{featured.map((p: any) => <article key={p.id} className="group"><Link href={`/product/${p.id}`} className="block aspect-[4/5] overflow-hidden bg-[#ebe0d0]"><FlowerImage src={p.imageUrl} alt={getProductName(p, language)} className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.025]"/></Link><div className="flex gap-3 pt-4"><div className="min-w-0 flex-1"><Link href={`/product/${p.id}`} className="line-clamp-2 font-serif text-lg leading-6">{getProductName(p, language)}</Link><p className="mt-2 text-base font-semibold tabular-nums">₾{Number(p.priceMin || 0).toLocaleString("ka-GE")}</p></div><button onClick={() => add(p)} className="grid h-11 w-11 shrink-0 place-items-center border border-[#b89458]" aria-label={copy.add}><ShoppingBag size={18}/></button></div></article>)}</div></div></section>
      <section className="grid bg-[#24211e] text-[#f7f2e9] lg:grid-cols-2"><img src="/flower-assets/editorial/mixed-bouquet.webp" alt="Seasonal flowers collection" loading="lazy" className="min-h-[420px] h-full w-full object-cover"/><div className="flex items-center px-5 py-16 sm:px-12 lg:px-20"><div className="max-w-lg"><Sparkles className="mb-7 text-[#d8bd86]"/><p className="text-[11px] font-semibold tracking-[.2em] text-[#e6d0a2]">THE ATELIER · 04</p><h2 className="mt-4 font-serif text-4xl leading-tight tracking-[-.04em] sm:text-5xl">{ka ? "\u10e8\u10d4\u10e5\u10db\u10d4\u10dc\u10d8\u10d7 \u10d7\u10d0\u10d8\u10d2\u10e3\u10da\u10d8, \u10e0\u10dd\u10db\u10d4\u10da\u10d8\u10ea \u10db\u10ee\u10dd\u10da\u10dd\u10d3 \u10d7\u10e5\u10d5\u10d4\u10dc\u10d8\u10d0." : "Create a bouquet that is only yours."}</h2><Link href="/bouquet-builder" className="mt-8 inline-flex min-h-12 items-center gap-2 border-b border-[#d8bd86] text-sm text-[#e6d0a2]">{copy.builder}<ArrowRight size={17}/></Link></div></div></section>
    </main>
    <Footer /><CartDrawer />
  </div>;
}
