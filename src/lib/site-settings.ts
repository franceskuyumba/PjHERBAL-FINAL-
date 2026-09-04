import { prisma } from "@/lib/prisma";
import { SOCIAL_LINKS } from "@/lib/constants";

const socialKeys = ["facebook", "instagram", "tiktok", "x"] as const;
export const homepageKeys = ["heroImage", "heroTitle", "heroSubtitle", "promoText"] as const;
export type SocialKey = (typeof socialKeys)[number];

export async function getSocialLinks() {
  try {
    const records = await prisma.siteSetting.findMany({ where: { key: { in: socialKeys.map((key) => `social.${key}`) } } });
    const values = new Map(records.map((record) => [record.key, record.value]));
    return {
      facebook: values.get("social.facebook") || SOCIAL_LINKS.facebook,
      instagram: values.get("social.instagram") || SOCIAL_LINKS.instagram,
      tiktok: values.get("social.tiktok") || SOCIAL_LINKS.tiktok,
      x: values.get("social.x") || SOCIAL_LINKS.x,
    };
  } catch {
    return SOCIAL_LINKS;
  }
}

export { socialKeys };

export async function getHomepageSettings() {
  const defaults = { heroImage: "", heroTitle: "", heroSubtitle: "", promoText: "" };
  try {
    const records = await prisma.siteSetting.findMany({ where: { key: { in: homepageKeys.map((key) => `homepage.${key}`) } } });
    return records.reduce((settings, record) => {
      const key = record.key.replace("homepage.", "") as keyof typeof defaults;
      if (key in settings) settings[key] = record.value;
      return settings;
    }, defaults);
  } catch {
    return defaults;
  }
}
