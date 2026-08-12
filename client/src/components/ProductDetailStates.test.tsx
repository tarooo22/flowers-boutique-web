// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import {
  ProductDetailLoadingState,
  ProductDetailNotFoundState,
  RelatedProductsErrorState,
  RelatedProductsLoadingState,
} from "./ProductDetailStates";

afterEach(() => cleanup());

describe("ProductDetail state surfaces", () => {
  it("renders the initial loading skeleton with status semantics", () => {
    render(<ProductDetailLoadingState ka />);

    expect(screen.getByRole("status").getAttribute("aria-busy")).toBe("true");
    expect(screen.getByText("პროდუქტის გვერდი იტვირთება")).toBeTruthy();
    expect(document.querySelectorAll(".fb-product-loading__image, .fb-product-loading__copy")).toHaveLength(2);
  });

  it("renders a product-not-found alert with a catalog escape route", () => {
    render(<ProductDetailNotFoundState ka />);

    expect(screen.getByRole("alert")).toBeTruthy();
    expect(screen.getByRole("heading", { name: "პროდუქტი ვერ მოიძებნა" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "კატალოგში დაბრუნება" }).getAttribute("href")).toBe("/catalog");
  });

  it("renders related-products loading skeletons while the primary product remains visible", () => {
    render(<RelatedProductsLoadingState ka={false} />);

    expect(screen.getByRole("status").getAttribute("aria-busy")).toBe("true");
    expect(screen.getByRole("heading", { name: "More from the collection" })).toBeTruthy();
    expect(screen.getByText("Loading…")).toBeTruthy();
    expect(document.querySelectorAll(".fb-related-skeleton")).toHaveLength(4);
  });

  it("renders a non-blocking related error state for partial product data", () => {
    render(<RelatedProductsErrorState ka />);

    expect(screen.getByRole("status")).toBeTruthy();
    expect(screen.getByText("მსგავსი თაიგულები ამჟამად ვერ ჩაიტვირთა.")).toBeTruthy();
    expect(screen.queryByRole("alert")).toBeNull();
  });
});
