import { describe, expect, it } from "vitest";
import { isDeliveryScheduleAllowed } from "@/lib/production/deliverySchedule";

const policy = { serviceArea: "თბილისი", sameDayCutoff: "20:00", deliveryWindow: "90 წუთი", noticeKa: "x", noticeEn: "x", noticeRu: "x" };

describe("delivery schedule policy", () => {
  it("uses Asia/Tbilisi date and the manager cutoff for same-day availability", () => {
    const beforeCutoff = new Date("2026-08-24T15:30:00.000Z"); // 19:30 Tbilisi
    const afterCutoff = new Date("2026-08-24T16:30:00.000Z"); // 20:30 Tbilisi
    expect(isDeliveryScheduleAllowed("2026-08-24", "18:00 – 21:00", policy, beforeCutoff)).toBe(true);
    expect(isDeliveryScheduleAllowed("2026-08-24", "18:00 – 21:00", policy, afterCutoff)).toBe(false);
    expect(isDeliveryScheduleAllowed("2026-08-25", "09:00 – 12:00", policy, afterCutoff)).toBe(true);
    expect(isDeliveryScheduleAllowed("2026-08-23", "09:00 – 12:00", policy, beforeCutoff)).toBe(false);
  });
});
