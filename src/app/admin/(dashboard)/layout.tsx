import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { getSessionEmail } from "@/lib/auth";
import AdminNavBar from "@/components/admin/AdminNavBar";

export default async function AdminDashboardLayout({ children }: { children: ReactNode }) {
  const email = await getSessionEmail();
  if (!email) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-bg">
      <AdminNavBar email={email} />
      <main>{children}</main>
    </div>
  );
}
