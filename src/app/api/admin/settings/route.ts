import { NextRequest } from "next/server";
import { json, error, requireApiAdmin, handleApiError, requireSameOrigin } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity";
import { socialKeys } from "@/lib/site-settings";

export async function GET() {
  try {
    await requireApiAdmin();
    const settings = await prisma.siteSetting.findMany({ where: { key: { in: socialKeys.map((key) => `social.${key}`) } } });
    return json({ settings: Object.fromEntries(settings.map((setting) => [setting.key, setting.value])) });
  } catch (e) {
    return handleApiError(e);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await requireApiAdmin();
    requireSameOrigin(request);
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") return error("Invalid settings payload.");

    for (const key of socialKeys) {
      const value = String(body[key] || "").trim();
      if (value && !/^https:\/\//i.test(value)) return error(`${key} must be an HTTPS URL.`);
      await prisma.siteSetting.upsert({
        where: { key: `social.${key}` },
        update: { value, updatedBy: session.sub },
        create: { key: `social.${key}`, value, updatedBy: session.sub },
      });
    }

    await logActivity({ actorId: session.sub, actorName: session.name, role: session.role, action: "SITE_SETTINGS_UPDATE", entity: "SiteSetting", details: "Updated social account links" });
    return json({ ok: true });
  } catch (e) {
    return handleApiError(e);
  }
}
