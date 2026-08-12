import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NotificationsList } from "@/components/dashboard/NotificationsList";

export const metadata = { title: "Notifications", robots: { index: false, follow: false } };

export default async function NotificationsPage() {
  const session = await getSession();
  if (!session) notFound();

  const notifications = await prisma.notification.findMany({
    where: { userId: session.sub },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <NotificationsList
      notifications={notifications.map((n) => ({
        id: n.id,
        type: n.type,
        title: n.title,
        message: n.message,
        href: n.href,
        read: n.read,
        createdAt: n.createdAt.toISOString(),
      }))}
    />
  );
}
