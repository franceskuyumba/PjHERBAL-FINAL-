import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { AdminActivityLog } from "@/components/admin/AdminActivityLog";

export default async function AdminActivityPage() {
  const session = await getSession();
  if (session?.role !== "ADMIN") redirect("/admin");
  return <AdminActivityLog />;
}
