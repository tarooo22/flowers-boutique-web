import type { DeliveryPolicy } from "@/lib/production/storefrontSettings";
import { TBILISI_TIME_ZONE } from "@/lib/storeHours";

function dateInTbilisi(now: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: TBILISI_TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(now);
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((item) => item.type === type)?.value ?? "";
  return `${part("year")}-${part("month")}-${part("day")}`;
}

function minuteOfDay(value: string) {
  const match = /^(\d{2}):(\d{2})$/.exec(value);
  if (!match) return null;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  return hour <= 23 && minute <= 59 ? hour * 60 + minute : null;
}

function minuteNowInTbilisi(now: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: TBILISI_TIME_ZONE, hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(now);
  const part = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find((item) => item.type === type)?.value ?? 0);
  return part("hour") * 60 + part("minute");
}

/** Keeps delivery date eligibility in the same manager-controlled policy domain as Checkout copy. */
export function isDeliveryScheduleAllowed(date: string, time: string, policy: DeliveryPolicy, now = new Date()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !time.trim()) return false;
  const today = dateInTbilisi(now);
  if (date < today) return false;
  if (date > today) return true;
  const cutoff = minuteOfDay(policy.sameDayCutoff);
  return cutoff !== null && minuteNowInTbilisi(now) < cutoff;
}
