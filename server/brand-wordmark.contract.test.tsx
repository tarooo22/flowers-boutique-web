import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { BrandWordmark } from "../client/src/components/BrandWordmark";

describe("BrandWordmark", () => {
  it("renders the approved English Flower’s Boutique & Events lockup", () => {
    const markup = renderToStaticMarkup(
      <BrandWordmark language="en" className="p1-brand__wordmark" />,
    );

    expect(markup).toContain('lang="en"');
    expect(markup).toContain("Flower’s");
    expect(markup).toContain("Boutique");
    expect(markup).toContain("&amp; Events");
  });

  it("renders the approved Georgian ყვავილების ბუტიკი & ივენთები lockup", () => {
    const markup = renderToStaticMarkup(
      <BrandWordmark language="ka" className="p1-footer__wordmark" />,
    );

    expect(markup).toContain('lang="ka"');
    expect(markup).toContain("ყვავილების ბუტიკი");
    expect(markup).toContain("&amp; ივენთები");
  });
});
