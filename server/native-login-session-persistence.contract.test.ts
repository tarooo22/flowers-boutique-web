import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = path.resolve(import.meta.dirname, "..");
const read = (relativePath: string) =>
  readFileSync(path.join(projectRoot, relativePath), "utf8");

describe("native login session-persistence contract", () => {
  it("uses partitioned Secure cookies in an HTTPS embedded preview", () => {
    const cookies = read("server/_core/cookies.ts");

    expect(cookies).toContain('sameSite: secure ? "none" : "lax"');
    expect(cookies).toContain("partitioned: true");
    expect(cookies).toContain("httpOnly: true");
  });

  it("verifies auth.me before redirecting a successful native login to Home", () => {
    const login = read("client/src/pages/Login.tsx");

    expect(login).toContain("const authenticatedUser = await utils.auth.me.fetch()");
    expect(login).toContain("Your session could not be established. Please try again.");
    expect(login).toContain("utils.auth.me.setData(undefined, authenticatedUser)");
    expect(login).toContain('navigate("/")');
  });
});
