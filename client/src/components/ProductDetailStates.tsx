import { AlertCircle } from "lucide-react";
import { Link } from "wouter";

export function ProductDetailLoadingState({ ka }: { ka: boolean }) {
  return (
    <main className="fb-product-loading" aria-busy="true" aria-live="polite" role="status">
      <span className="sr-only">{ka ? "პროდუქტის გვერდი იტვირთება" : "Product page is loading"}</span>
      <div className="fb-product-loading__image" />
      <div className="fb-product-loading__copy" />
    </main>
  );
}

export function ProductDetailNotFoundState({ ka }: { ka: boolean }) {
  return (
    <main className="fb-product-state" role="alert">
      <AlertCircle size={30} />
      <h1>{ka ? "პროდუქტი ვერ მოიძებნა" : "Product not found"}</h1>
      <p>{ka ? "ეს თაიგული ამჟამად ხელმისაწვდომი არ არის." : "This bouquet is no longer available."}</p>
      <Link href="/catalog" className="fb-product-state__link">
        {ka ? "კატალოგში დაბრუნება" : "Back to catalog"}
      </Link>
    </main>
  );
}

export function RelatedProductsLoadingState({ ka }: { ka: boolean }) {
  return (
    <section className="fb-page-shell fb-related fb-related-loading" aria-busy="true" aria-live="polite" role="status">
      <div className="fb-section-heading">
        <div>
          <p className="fb-eyebrow">YOU MAY ALSO LIKE</p>
          <h2 className="fb-display">{ka ? "სხვა რჩეული თაიგულები" : "More from the collection"}</h2>
        </div>
        <span className="fb-related-loading__label">{ka ? "იტვირთება…" : "Loading…"}</span>
      </div>
      <div className="fb-related-grid">
        {Array.from({ length: 4 }, (_, index) => <div key={index} className="fb-related-card fb-related-skeleton" aria-hidden="true" />)}
      </div>
    </section>
  );
}

export function RelatedProductsErrorState({ ka }: { ka: boolean }) {
  return (
    <section className="fb-page-shell fb-related fb-related-error" role="status">
      <p className="fb-eyebrow">{ka ? "სხვა თაიგულები" : "MORE FROM THE COLLECTION"}</p>
      <p>{ka ? "მსგავსი თაიგულები ამჟამად ვერ ჩაიტვირთა." : "Related bouquets are temporarily unavailable."}</p>
    </section>
  );
}
