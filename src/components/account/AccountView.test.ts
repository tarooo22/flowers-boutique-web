import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(new URL("./AccountView.tsx", import.meta.url), "utf8");

describe("Account dashboard", () => {
  it("keeps real orders and Flower Circle history in a sidebar-driven account workspace", () => {
    expect(source).toContain('id: "orders", label: "შეკვეთები"');
    expect(source).toContain('id: "profile", label: "პროფილი"');
    expect(source).toContain('id: "security", label: "უსაფრთხოება"');
    expect(source).toContain('id: "addresses", label: "მისამართები"');
    expect(source).toContain('id: "notifications", label: "შეტყობინებები"');
    expect(source).toContain('id: "coupons", label: "კუპონები"');
    expect(source).toContain('fetch("/api/account/orders"');
    expect(source).toContain('history?.ledger');
  });

  it("keeps Admin access role-gated and uses a secure sign-out request", () => {
    expect(source).toContain('isAdmin ? <Link href="/admin"');
    expect(source).toContain('fetch("/api/auth/logout"');
    expect(source).toContain('fetch("/api/admin/login"');
  });

  it("renders owner-editable profile, address-book and notification preference controls", () => {
    expect(source).toContain('fetch("/api/account/profile"');
    expect(source).toContain('fetch("/api/account/addresses"');
    expect(source).toContain('fetch("/api/account/notifications"');
    expect(source).toContain('მიამართის დამატება'.replace('მიამართ', 'მისამართ'));
    expect(source).toContain('პარამეტრების შენახვა');
  });

  it("keeps the mobile account navigation wrapped within the viewport", () => {
    expect(source).toContain('grid min-w-0 grid-cols-2 gap-1 lg:block');
    expect(source).not.toContain('flex gap-1 overflow-x-auto pb-1 lg:block');
    expect(source).toContain('className="min-w-0 break-words font-semibold"');
  });
});
