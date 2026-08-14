import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = path.resolve(import.meta.dirname, "..");
const read = (relativePath: string) => readFileSync(path.join(projectRoot, relativePath), "utf8");

describe("Wave 4 legal public-page accessibility contract", () => {
  const privacy = read("client/src/pages/Privacy.tsx");
  const terms = read("client/src/pages/Terms.tsx");
  const delivery = read("client/src/pages/Delivery.tsx");
  const returnsPage = read("client/src/pages/Returns.tsx");
  const styles = read("client/src/index.css");

  it("provides shared metadata and removes the retired placeholder domain", () => {
    expect(privacy).toContain('canonical: "/privacy"');
    expect(terms).toContain('canonical: "/terms"');
    expect(privacy).not.toContain("flowers-boutique.example");
    expect(terms).not.toContain("flowers-boutique.example");
  });

  it("keeps long-form legal content keyboard-navigable by section", () => {
    expect(privacy).toContain('href={`#privacy-section-${index + 1}`}');
    expect(terms).toContain('href={`#terms-section-${index + 1}`}');
    expect(privacy).toContain('id={`privacy-section-${index + 1}`}');
    expect(terms).toContain('id={`terms-section-${index + 1}`}');
    expect(privacy).toContain('id="main-content"');
    expect(terms).toContain('id="main-content"');
  });

  it("retains visible focus treatment and 44px local navigation targets", () => {
    expect(styles).toContain(".fb-legal-page__nav-links a:focus-visible");
    expect(styles).toContain(".fb-legal-page__nav-links a {");
    expect(styles).toContain("min-height: 44px;");
    expect(styles).toContain("scroll-margin-top: 7.5rem;");
  });

  it("keeps delivery and returns pages metadata-rich and section-navigable", () => {
    expect(delivery).toContain('canonical: "/delivery"');
    expect(returnsPage).toContain('canonical: "/returns"');
    expect(delivery).toContain('href="#delivery-cost"');
    expect(delivery).toContain('id="delivery-how-to-order"');
    expect(returnsPage).toContain('href="#returns-process"');
    expect(returnsPage).toContain('id="returns-exceptions"');
  });

  it("does not reintroduce unsupported delivery or response-time promises", () => {
    expect(delivery).toContain("თვითგატანა უფასოა");
    expect(delivery).toContain("Pickup is free");
    expect(returnsPage).toContain('hours: "სამუშაო საათები"');
    expect(returnsPage).toContain('hours: "Working Hours"');
    expect(returnsPage).not.toContain("within 2 hours");
    expect(returnsPage).not.toContain("2 საათის განმავლობაში გიპასუხებთ");
  });
});
