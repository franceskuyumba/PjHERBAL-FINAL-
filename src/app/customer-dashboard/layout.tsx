import { redirect } from "next/navigation";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export const metadata: Metadata = {
  title: "My Dashboard",
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");

  const unread = await prisma.notification.count({
    where: { userId: session.sub, read: false },
  });

  return (
    <DashboardShell name={session.name} email={session.email} unread={unread}>
      {children}
    </DashboardShell>
  );
}
