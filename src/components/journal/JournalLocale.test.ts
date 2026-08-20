import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { journalPosts } from "@/data/journal";

const listSource = readFileSync(new URL("./JournalListView.tsx", import.meta.url), "utf8");
const detailSource = readFileSync(new URL("./JournalArticleView.tsx", import.meta.url), "utf8");
const homeSource = readFileSync(new URL("../home/JournalSection.tsx", import.meta.url), "utf8");

describe("Journal locale contract", () => {
  it("provides complete English, Georgian and Russian editorial content for each public article", () => {
    expect(journalPosts).toHaveLength(3);

    for (const post of journalPosts) {
      for (const language of ["en", "ka", "ru"] as const) {
        const content = post.content[language];
        expect(content.title).toBeTruthy();
        expect(content.excerpt).toBeTruthy();
        expect(content.category).toBeTruthy();
        expect(content.date).toBeTruthy();
        expect(content.body).toHaveLength(4);
      }
    }

    expect(journalPosts[0]?.content.ka.title).toBe("როგორ შევინარჩუნოთ მოჭრილი ყვავილები უფრო დიდხანს");
    expect(journalPosts[1]?.content.ka.title).toBe("პიონების სეზონის მოკლე გზამკვლევი");
    expect(journalPosts[2]?.content.ka.title).toBe("როგორ ავარჩიოთ ყვავილები ფერისა და მნიშვნელობის მიხედვით");
    expect(journalPosts[0]?.content.ka.date).toBe("2 აგვ 2026");
    expect(journalPosts[1]?.content.ka.date).toBe("18 ივლ 2026");
    expect(journalPosts[2]?.content.ka.date).toBe("30 ივნ 2026");
  });

  it("uses the shared hydrated language context for list, detail and home views", () => {
    expect(listSource).toContain("useI18n");
    expect(listSource).toContain("post.content[lang]");
    expect(listSource).toContain("content.date");
    expect(detailSource).toContain("useI18n");
    expect(detailSource).toContain("post.content[lang]");
    expect(detailSource).toContain("journal.shopFreshBouquets");
    expect(detailSource).toContain("content.date");
    expect(homeSource).toContain("post.content[lang]");
    expect(homeSource).toContain("content.date");
  });
});
