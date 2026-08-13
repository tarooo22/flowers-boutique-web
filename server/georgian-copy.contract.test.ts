import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = path.resolve(import.meta.dirname, "..");
const read = (relativePath: string) =>
  readFileSync(path.join(projectRoot, relativePath), "utf8");

describe("Georgian commercial-copy language contract", () => {
  const checkout = read("client/src/pages/Checkout.tsx");
  const delivery = read("client/src/pages/Delivery.tsx");
  const returnsPage = read("client/src/pages/Returns.tsx");

  it("uses natural Georgian checkout labels without changing the delivery policy", () => {
    expect(checkout).toContain('howWouldYouLike: "როგორ გსურთ შეკვეთის მიღება?"');
    expect(checkout).toContain('pickup: "თვითგატანა"');
    expect(checkout).toContain('willCallIfNeeded: "საჭიროების შემთხვევაში დაგიკავშირდებით"');
    expect(checkout).toContain('acrossTbilisi: "თბილისის მასშტაბით — ₾5 / ₾150-დან უფასო"');
    expect(checkout).not.toContain("დავიკვებით");
  });

  it("uses natural Georgian delivery instructions while keeping the shared fee constants", () => {
    expect(delivery).toContain('section4Title: "როგორ შეუკვეთოთ"');
    expect(delivery).toContain('section5Title: "დაგვიკავშირდით"');
    expect(delivery).toContain("₾${FREE_DELIVERY_THRESHOLD_GEL}-ის ან მეტი ღირებულების შეკვეთებისთვის");
    expect(delivery).toContain("₾${DELIVERY_FEE_GEL} ₾${FREE_DELIVERY_THRESHOLD_GEL}-ზე ნაკლები ღირებულების შეკვეთებისთვის");
  });

  it("uses clear Georgian returns terminology without changing stated policy periods", () => {
    expect(returnsPage).toContain('title: "დაბრუნება და თანხის ანაზღაურება"');
    expect(returnsPage).toContain('section4Title: "დასაბრუნებლად მიუღებელი შემთხვევები"');
    expect(returnsPage).toContain("მიტანიდან არ უნდა იყოს გასული 24 საათზე მეტი");
    expect(returnsPage).toContain("თანხის ანაზღაურება დამუშავდება 3–5 სამუშაო დღის განმავლობაში");
    expect(returnsPage).not.toContain("დაბრუნებული თანხა");
    expect(returnsPage).not.toContain("დაკონტაქტეთ ჩვენ");
  });
});
