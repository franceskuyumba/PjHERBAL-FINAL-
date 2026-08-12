import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProfileForm } from "@/components/dashboard/ProfileForm";

export default async function SettingsPage() {
  const session = await getSession();
  if (!session) notFound();

  const user = await prisma.user.findUnique({ where: { id: session.sub } });
  if (!user) notFound();

  return <ProfileForm name={user.name} email={user.email} phone={user.phone} />;
}
