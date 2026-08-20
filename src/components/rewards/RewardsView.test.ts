import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { translations } from "@/lib/translations";

const source = readFileSync(new URL("./RewardsView.tsx", import.meta.url), "utf8");

const rewardKeys = [
  "rewards.title",
  "rewards.intro",
  "rewards.balanceLabel",
  "rewards.balanceDescription",
  "rewards.progress",
  "rewards.tiersEyebrow",
  "rewards.exampleEyebrow",
  "rewards.disclaimer",
  "rewards.cta",
] as const;

describe("Rewards locale contract", () => {
  it("reads all customer-facing Rewards content from the shared client locale provider", () => {
    expect(source).toContain('const { lang, t } = useI18n()');
    expect(source).toContain('document.title = `${t("rewards.metaTitle")} · Flower\'s Boutique`');
    expect(source).not.toContain(">Rewards in petals<");
    expect(source).not.toContain(">Start earning — shop bouquets<");
  });

  it("provides full Georgian and English Rewards copy without falling back to English", () => {
    for (const key of rewardKeys) {
      expect(translations.en[key]).toBeTruthy();
      expect(translations.ka[key]).toBeTruthy();
    }

    expect(translations.ka["rewards.title"]).toBe("ქეშბექი ფურცლებით");
    expect(translations.ka["rewards.cta"]).toBe("დაიწყე დაგროვება — აირჩიე თაიგული");
    expect(translations.en["rewards.title"]).toBe("Rewards in petals");
  });
});
