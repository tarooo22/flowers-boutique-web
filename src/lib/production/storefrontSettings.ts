import "server-only";

import { desc, eq } from "drizzle-orm";
import { getProductionDb, storefrontSettingEvents, storefrontSettings } from "@/lib/production/db";

export const DELIVERY_POLICY_KEY = "delivery-policy";
export type DeliveryPolicy = {
  serviceArea: string;
  sameDayCutoff: string;
  deliveryWindow: string;
  noticeKa: string;
  noticeEn: string;
  noticeRu: string;
};

export const defaultDeliveryPolicy: DeliveryPolicy = {
  serviceArea: "თბილისი",
  sameDayCutoff: "20:00",
  deliveryWindow: "90 წუთი",
  noticeKa: "შეკვეთას ფლორისტი დაგიდასტურებთ ტელეფონით. იმავე დღის მიწოდებისთვის დაგვიკავშირდით 20:00-მდე.",
  noticeEn: "A florist confirms your order by phone. For same-day delivery, please contact us before 20:00.",
  noticeRu: "Флорист подтвердит заказ по телефону. Для доставки в тот же день свяжитесь с нами до 20:00.",
};

const text = (value: unknown, max: number) => typeof value === "string" ? value.trim().slice(0, max) : "";
export function normalizeDeliveryPolicy(value: unknown): DeliveryPolicy | null {
  const source = value as Partial<DeliveryPolicy> | null;
  const policy = {
    serviceArea: text(source?.serviceArea, 80), sameDayCutoff: text(source?.sameDayCutoff, 10), deliveryWindow: text(source?.deliveryWindow, 40),
    noticeKa: text(source?.noticeKa, 400), noticeEn: text(source?.noticeEn, 400), noticeRu: text(source?.noticeRu, 400),
  };
  return policy.serviceArea && /^\d{2}:\d{2}$/.test(policy.sameDayCutoff) && policy.deliveryWindow && policy.noticeKa && policy.noticeEn && policy.noticeRu ? policy : null;
}

export async function getDeliveryPolicy() {
  const record = (await getProductionDb().select().from(storefrontSettings).where(eq(storefrontSettings.key, DELIVERY_POLICY_KEY)).limit(1))[0];
  const policy = normalizeDeliveryPolicy(record?.value) ?? defaultDeliveryPolicy;
  return { policy, revision: record?.revision ?? 0, updatedAt: record?.updatedAt?.toISOString() ?? null };
}

export async function getDeliveryPolicyAudit() {
  const settings = await getDeliveryPolicy();
  const events = await getProductionDb().select({ id: storefrontSettingEvents.id, revision: storefrontSettingEvents.revision, actorUserId: storefrontSettingEvents.actorUserId, createdAt: storefrontSettingEvents.createdAt }).from(storefrontSettingEvents).where(eq(storefrontSettingEvents.settingKey, DELIVERY_POLICY_KEY)).orderBy(desc(storefrontSettingEvents.createdAt)).limit(12);
  return { ...settings, events: events.map((event) => ({ ...event, createdAt: event.createdAt.toISOString() })) };
}

export async function updateDeliveryPolicy(policy: DeliveryPolicy, expectedRevision: number, actorUserId: number) {
  return getProductionDb().transaction(async (tx) => {
    const current = (await tx.select({ revision: storefrontSettings.revision }).from(storefrontSettings).where(eq(storefrontSettings.key, DELIVERY_POLICY_KEY)).limit(1))[0];
    const actualRevision = current?.revision ?? 0;
    if (expectedRevision !== actualRevision) return { conflict: true as const, revision: actualRevision };
    const nextRevision = actualRevision + 1;
    await tx.insert(storefrontSettings).values({ key: DELIVERY_POLICY_KEY, value: policy, revision: nextRevision, updatedByUserId: actorUserId }).onDuplicateKeyUpdate({ set: { value: policy, revision: nextRevision, updatedByUserId: actorUserId } });
    await tx.insert(storefrontSettingEvents).values({ settingKey: DELIVERY_POLICY_KEY, revision: nextRevision, value: policy, actorUserId });
    return { conflict: false as const, revision: nextRevision };
  });
}
