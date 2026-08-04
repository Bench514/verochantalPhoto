import { redirect } from "next/navigation";
import { getSessionEmail } from "@/lib/auth";

export default async function AdminIndexPage() {
  const email = await getSessionEmail();
  redirect(email ? "/admin/photos" : "/admin/login");
}
