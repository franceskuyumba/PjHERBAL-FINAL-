import { AdminOrdersTable } from "@/components/admin/AdminOrdersTable";
import { getSession } from "@/lib/auth";

export default async function AdminOrdersPage() {
  const session = await getSession();
  return <AdminOrdersTable canApprove={session?.role === "ADMIN"} />;
}
