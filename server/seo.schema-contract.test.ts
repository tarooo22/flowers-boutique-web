import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = process.cwd();
const schemaPath = path.join(projectRoot, "drizzle/schema.ts");
const migrationPath = path.join(
  projectRoot,
  "drizzle/migrations/create_seo_tracking_tables.sql",
);

describe("SEO tracking schema contract", () => {
  it("keeps the canonical ranking fields aligned between Drizzle and the additive migration", async () => {
    const [schema, migration] = await Promise.all([
      readFile(schemaPath, "utf8"),
      readFile(migrationPath, "utf8"),
    ]);

    expect(schema).toContain('mysqlTable("seoKeywords"');
    expect(schema).toContain('mysqlTable("keywordRankings"');
    expect(schema).toContain('mysqlTable("seoMonitoringTasks"');
    expect(schema).toContain('rank: int("rank")');
    expect(schema).toContain('searchVolume: int("searchVolume")');
    expect(schema).toContain('difficulty: int("difficulty")');

    expect(migration).toContain("CREATE TABLE IF NOT EXISTS `seoKeywords`");
    expect(migration).toContain("CREATE TABLE IF NOT EXISTS `keywordRankings`");
    expect(migration).toContain("CREATE TABLE IF NOT EXISTS `seoMonitoringTasks`");
    expect(migration).toContain("`rank` int NULL");
    expect(migration).toContain("`searchVolume` int NULL");
    expect(migration).toContain("`difficulty` int NULL");
    expect(migration).not.toMatch(/DROP\s+TABLE|DELETE\s+FROM|TRUNCATE\s+TABLE/i);
  });
});
