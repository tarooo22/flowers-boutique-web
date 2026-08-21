import { describe, expect, it } from "vitest";
import { getTbilisiStoreStatus } from "@/lib/storeHours";

describe("getTbilisiStoreStatus", () => {
  it("uses Asia/Tbilisi rather than the browser or server timezone", () => {
    expect(getTbilisiStoreStatus(new Date("2026-08-21T04:59:00.000Z")).isOpen).toBe(false); // 08:59 in Tbilisi
    expect(getTbilisiStoreStatus(new Date("2026-08-21T05:00:00.000Z")).isOpen).toBe(true); // 09:00 in Tbilisi
  });

  it("keeps the studio open through 20:59 and closes at 21:00", () => {
    expect(getTbilisiStoreStatus(new Date("2026-08-21T16:59:00.000Z")).isOpen).toBe(true); // 20:59 in Tbilisi
    expect(getTbilisiStoreStatus(new Date("2026-08-21T17:00:00.000Z")).isOpen).toBe(false); // 21:00 in Tbilisi
  });
});
