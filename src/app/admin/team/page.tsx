import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { AdminTeamManager } from "@/components/admin/AdminTeamManager";

export default async function AdminTeamPage() {
  const session = await getSession();
  if (session?.role !== "ADMIN") redirect("/admin");
  return <AdminTeamManager />;
}
