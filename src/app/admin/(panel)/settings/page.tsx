import { requireAnyPagePermission } from "@/lib/auth/guards";
import { hasPermission } from "@/lib/auth/permissions";
import { getSettings } from "@/lib/settings";
import { SettingsForm } from "./SettingsForm";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const user = await requireAnyPagePermission(["settings.read", "settings.manage"]);
  const settings = await getSettings();
  return (
    <>
      <h1>Site settings</h1>
      <p className="a-muted" style={{ marginBottom: 16 }}>
        Contact details, social links, analytics and search-engine defaults used across the website.
      </p>
      <SettingsForm initial={settings as unknown as Record<string, unknown>} canEdit={hasPermission(user, "settings.manage")} />
    </>
  );
}

