import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AccountView } from "@/components/account/AccountView";
import { isAdminRole } from "@/lib/accountAccess";
import { getProductionSessionUser } from "@/lib/production/auth";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "My account", robots: { index: false, follow: false } };

export default async function AccountPage() {
  const user = await getProductionSessionUser();
  if (!user) redirect("/account/login?next=/account");
  return <AccountView name={user.name} email={user.email} isAdmin={isAdminRole(user.role)} />;
}
