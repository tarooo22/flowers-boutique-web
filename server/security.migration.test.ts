import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const repositoryRoot = resolve(import.meta.dirname, "..");
const drizzleDir = resolve(repositoryRoot, "drizzle");
const journal = JSON.parse(
  readFileSync(resolve(drizzleDir, "meta", "_journal.json"), "utf8"),
) as { entries: Array<{ idx: number; tag: string }> };

describe("auth session migration metadata", () => {
  it("contains one generated auth-session migration and matching snapshot", () => {
    const entries = journal.entries.filter(entry => entry.tag.includes("auth_sessions"));
    expect(entries).toHaveLength(1);

    const entry = entries[0]!;
    const migrationPath = resolve(drizzleDir, `${entry.tag}.sql`);
    const snapshotPath = resolve(
      drizzleDir,
      "meta",
      `${String(entry.idx).padStart(4, "0")}_snapshot.json`,
    );

    expect(existsSync(migrationPath)).toBe(true);
    expect(existsSync(snapshotPath)).toBe(true);
    expect(readFileSync(migrationPath, "utf8").match(/CREATE TABLE `authSessions`/g)).toHaveLength(1);

    const snapshot = JSON.parse(readFileSync(snapshotPath, "utf8")) as {
      tables?: Record<string, unknown>;
    };
    expect(snapshot.tables).toHaveProperty("authSessions");
  });

  it("does not duplicate authSessions across migration SQL files", () => {
    const occurrences = readdirSync(drizzleDir)
      .filter(file => file.endsWith(".sql"))
      .map(file => readFileSync(resolve(drizzleDir, file), "utf8"))
      .flatMap(source => source.match(/CREATE TABLE `authSessions`/g) ?? []);

    expect(occurrences).toHaveLength(1);
  });

  it("separates migration generation from migration application", () => {
    const packageJson = JSON.parse(
      readFileSync(resolve(repositoryRoot, "package.json"), "utf8"),
    ) as { scripts?: Record<string, string> };

    expect(packageJson.scripts?.["db:generate"]).toBe("drizzle-kit generate");
    expect(packageJson.scripts?.["db:migrate"]).toBe("drizzle-kit migrate");
    expect(packageJson.scripts?.["db:push"]).toBeUndefined();
  });
});
