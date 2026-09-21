"use server";

import { redirect } from "next/navigation";
import { destroyClientSession } from "@/lib/auth";

export async function clientLogoutAction() {
  await destroyClientSession();
  redirect("/client/login");
}
