import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { getSessionEmail } from "@/lib/auth";
import { prisma } from "@/lib/db";
import AdminNavBar from "@/components/admin/AdminNavBar";

export default async function AdminDashboardLayout({ children }: { children: ReactNode }) {
  const email = await getSessionEmail();
  if (!email) redirect("/admin/login");

  const unreadCount = await prisma.contactMessage.count({ where: { read: false } });

  return (
    <div className="min-h-screen bg-bg">
      <AdminNavBar email={email} unreadCount={unreadCount} />
      <main>{children}</main>
    </div>
  );
}
