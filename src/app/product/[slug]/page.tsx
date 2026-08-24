import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductInfo } from "@/components/product/ProductInfo";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { getLiveProductBySlug, getLiveRelatedProducts } from "@/lib/production/catalog";

export const dynamic = "force-dynamic";
const siteUrl = "https://flower-shop-jx9auvvz.manus.space";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getLiveProductBySlug(slug);
  if (!product) return { title: "Not found" };
  return {
    title: product.name,
    description: product.description,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      type: "website",
      url: `/product/${product.slug}`,
      title: product.name,
      description: product.description,
      images: product.images[0] ? [{ url: product.images[0], alt: product.name }] : undefined,
    },
    twitter: { card: "summary_large_image", title: product.name, description: product.description, images: product.images[0] ? [product.images[0]] : undefined },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getLiveProductBySlug(slug);
  if (!product) notFound();

  const related = await getLiveRelatedProducts(product, 4);
  const productUrl = `${siteUrl}/product/${product.slug}`;
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      description: product.description,
      image: product.images,
      category: product.category,
      offers: { "@type": "Offer", url: productUrl, priceCurrency: "GEL", price: product.price, availability: product.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock" },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
        { "@type": "ListItem", position: 2, name: "Catalog", item: `${siteUrl}/catalog` },
        { "@type": "ListItem", position: 3, name: product.name, item: productUrl },
      ],
    },
  ];

  return (
    <div className="pb-20 sm:pb-28">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="container-fb pt-6">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Catalog", href: "/catalog" },
            { label: product.category, href: `/catalog?category=${product.category}` },
            { label: product.name },
          ]}
        />
      </div>

      <div className="container-fb mt-6 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
        <ProductGallery images={product.images} name={product.name} />
        <ProductInfo product={product} />
      </div>

      <RelatedProducts products={related} />
    </div>
  );
}
