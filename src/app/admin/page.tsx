import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isProductionAdmin } from "@/lib/production/auth";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  if (!(await isProductionAdmin())) redirect("/account/login?next=/admin");
  return <AdminDashboard demoCredentials={false} />;
}
