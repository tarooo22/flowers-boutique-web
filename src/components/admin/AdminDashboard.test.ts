import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("./AdminDashboard.tsx", import.meta.url), "utf8");

describe("Operational Admin panel contract", () => {
  it("keeps the reference-inspired manager hierarchy and live management capability surfaces", () => {
    expect(source).toContain("Flower&rsquo;s Boutique · Operations");
    expect(source).toContain("ადმინისტრირების პანელი");
    expect(source).toContain("პროდუქტები");
    expect(source).toContain("კატეგორიები");
    expect(source).toContain("შეკვეთები");
    expect(source).toContain("ბანერები");
    expect(source).toContain("პარამეტრები");
    expect(source).toContain("სტატუსის შეცვლა");
    expect(source).toContain("Fulfilment desk");
    expect(source).toContain("ID, სახელი, ტელეფონი ან მისამართი…");
  });

  it("retains real legacy product create, edit and confirmation-gated delete workflows", () => {
    expect(source).toContain("+ ახალი პროდუქტი");
    expect(source).toContain("პროდუქტის რედაქტირება");
    expect(source).toContain("პროდუქტის წაშლა გსურთ?");
    expect(source).toContain("/api/admin/products");
  });

  it("does not expose the unsupported order deletion action", () => {
    expect(source).not.toContain("Delete order");
    expect(source).not.toContain("removeOrder");
    expect(source).not.toContain("/api/admin/orders?id=");
  });

  it("provides the manager-facing media, category and customer-delivery controls", () => {
    expect(source).toContain("ფოტოს გადაათრიეთ აქ");
    expect(source).toContain("მედია ბიბლიოთეკა");
    expect(source).toContain("/api/admin/media");
    expect(source).toContain("/api/admin/categories");
    expect(source).toContain("კატეგორიების მართვა");
    expect(source).toContain("რუკაზე ნახვა");
    expect(source).toContain("tel:${order.customer.phone}");
  });

  it("explains why a referenced category cannot be deleted and directs the manager to its products", () => {
    expect(source).toContain("პროდუქტების ნახვა");
    expect(source).toContain("უსაფრთხოებისთვის ეს კატეგორია ვერ წაიშლება");
    expect(source).toContain("კატეგორია ცარიელია და მისი წაშლა შესაძლებელია.");
    expect(source).toContain("reviewCategoryProducts");
    expect(source).toContain("payload.productCount");
  });

  it("provides live banner management and image selection through the existing protected media workflow", () => {
    expect(source).toContain("/api/admin/banners");
    expect(source).toContain("ბანერების მართვა");
    expect(source).toContain("ბანერის რედაქტირება");
    expect(source).toContain("ბანერი გამოჩნდეს მთავარ გვერდზე");
    expect(source).toContain("მედია ბიბლიოთეკა");
    expect(source).toContain('asset.url.startsWith("/manus-storage/") && asset.key.startsWith("admin-media/")');
    expect(source).not.toContain("Storefront editorial blocks დაცულია project content-ში");
  });

  it("calculates order insights only from the live orders collection", () => {
    expect(source).toContain("function OrdersAnalytics");
    expect(source).toContain("orders.reduce");
    expect(source).toContain("order.createdAt");
    expect(source).toContain("სტატუსების განაწილება");
    expect(source).toContain("შეკვეთების დინამიკა");
    expect(source).toContain("ბოლო შეკვეთები");
  });

  it("mounts the protected priority queue workspace from the Orders tab", () => {
    expect(source).toContain('import { OrdersOperations }');
    expect(source).toContain('{tab === "orders" ? <OrdersOperations /> : null}');
  });

  it("keeps the expanded manager workspace usable from a phone through desktop breakpoints", () => {
    expect(source).toContain('type="file"');
    expect(source).toContain("multiple");
    expect(source).toContain("sm:grid-cols-2");
    expect(source).toContain("md:grid-cols-[1.25fr_0.9fr_0.9fr]");
    expect(source).toContain("lg:grid-cols-[1.1fr_0.9fr]");
    expect(source).toContain("flex-wrap");
  });
});
