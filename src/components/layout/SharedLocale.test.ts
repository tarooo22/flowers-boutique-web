import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { translations } from "@/lib/translations";

const search = readFileSync(new URL("./Search.tsx", import.meta.url), "utf8");
const auth = readFileSync(new URL("../account/AuthForm.tsx", import.meta.url), "utf8");
const account = readFileSync(new URL("../account/AccountView.tsx", import.meta.url), "utf8");
const keys = ["search.close", "search.placeholder", "search.seeAll", "search.empty", "search.hint", "auth.loginTitle", "auth.registerTitle", "auth.signIn", "auth.create", "orderStatus.new", "orderStatus.delivered", "orderStatus.cancelled"];

describe("shared localization contract", () => {
  it("provides Search, Auth and order-status copy in all supported locales", () => {
    for (const locale of ["en", "ka", "ru"] as const) for (const key of keys) expect(translations[locale][key]).toBeTruthy();
  });

  it("routes customer-facing Search, Auth and order status UI through the shared I18n hook", () => {
    expect(search).toContain("useI18n");
    expect(search).toContain('t("search.placeholder")');
    expect(auth).toContain("useI18n");
    expect(auth).toContain('t("auth.loginTitle")');
    expect(account).toContain('t(`orderStatus.${order.status}`)');
  });
});
