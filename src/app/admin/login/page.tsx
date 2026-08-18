import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isProductionAdmin } from "@/lib/production/auth";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  if (await isProductionAdmin()) redirect("/admin");
  redirect("/account/login?next=/admin");
}
