import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = process.cwd();

describe("contact workflow contract", () => {
  it("submits validated messages through the server-side owner notification path without mailto", async () => {
    const [router, contactPage] = await Promise.all([
      readFile(path.join(projectRoot, "server/routers.ts"), "utf8"),
      readFile(path.join(projectRoot, "client/src/pages/Contact.tsx"), "utf8"),
    ]);

    expect(router).toContain("const contactSubmissionSchema = z.object");
    expect(router).toContain("contact: router({");
    expect(router).toContain("notifyOwner({");
    expect(router).toContain("Requests are intentionally not persisted");
    expect(contactPage).toContain("trpc.contact.submit.useMutation");
    expect(contactPage).toContain("contactMutation.mutate(form)");
    expect(contactPage).not.toContain("window.location.href = `mailto:");
  });
});
