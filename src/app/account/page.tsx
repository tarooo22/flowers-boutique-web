import { redirect } from "next/navigation";
import { AccountView } from "@/components/account/AccountView";
import { getProductionSessionUser } from "@/lib/production/auth";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const user = await getProductionSessionUser();
  if (!user) redirect("/account/login?next=/account");
  return <AccountView name={user.name} email={user.email} />;
}
