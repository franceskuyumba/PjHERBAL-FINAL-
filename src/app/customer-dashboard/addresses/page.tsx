import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AddressesManager } from "@/components/dashboard/AddressesManager";

export default async function AddressesPage() {
  const session = await getSession();
  if (!session) notFound();

  const addresses = await prisma.address.findMany({
    where: { userId: session.sub },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });

  return (
    <AddressesManager
      addresses={addresses.map((a) => ({
        id: a.id,
        label: a.label,
        recipientName: a.recipientName,
        phone: a.phone,
        region: a.region,
        district: a.district,
        street: a.street,
        isDefault: a.isDefault,
      }))}
    />
  );
}
