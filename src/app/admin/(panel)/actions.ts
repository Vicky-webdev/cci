"use server";

import { redirect } from "next/navigation";
import { audit } from "@/lib/audit";
import { destroyCurrentSession, getSessionUser } from "@/lib/auth/session";
import { requestMeta } from "@/lib/request";

export async function logoutAction() {
  const user = await getSessionUser();
  await destroyCurrentSession();
  if (user) await audit({ actorId: user.id, action: "auth.logout", summary: "Signed out", ip: (await requestMeta()).ip });
  redirect("/admin/login");
}
