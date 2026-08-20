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
});
