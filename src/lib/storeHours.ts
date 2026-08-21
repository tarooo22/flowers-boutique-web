export const TBILISI_TIME_ZONE = "Asia/Tbilisi";
export const STORE_OPEN_MINUTE = 9 * 60;
export const STORE_CLOSE_MINUTE = 21 * 60;

function getTbilisiClockParts(now: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: TBILISI_TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);

  return {
    hour: Number(parts.find((part) => part.type === "hour")?.value ?? 0),
    minute: Number(parts.find((part) => part.type === "minute")?.value ?? 0),
  };
}

/** Returns the operating state using the studio's canonical Asia/Tbilisi clock. */
export function getTbilisiStoreStatus(now = new Date()) {
  const { hour, minute } = getTbilisiClockParts(now);
  const currentMinute = hour * 60 + minute;
  return {
    isOpen: currentMinute >= STORE_OPEN_MINUTE && currentMinute < STORE_CLOSE_MINUTE,
    hour,
    minute,
  };
}

export function formatTbilisiTime(now: Date, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    timeZone: TBILISI_TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(now);
}
