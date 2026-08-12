export const BLOG_CATEGORIES = [
  "Nutrition",
  "Wellness",
  "Healthy Living",
  "Men's Wellness",
  "Women's Wellness",
  "Energy & Immunity",
  "Weight Management",
  "Brain & Focus",
  "Digestion",
  "Product Education",
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

/** Slugify a heading into a stable anchor id. */
export function headingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80) || "section";
}

/** Extract a table of contents from raw markdown content. */
export function extractToc(content: string): TocItem[] {
  const items: TocItem[] = [];
  for (const line of content.split("\n")) {
    if (line.startsWith("## ")) items.push({ id: headingId(line.slice(3)), text: line.slice(3), level: 2 });
    else if (line.startsWith("### ")) items.push({ id: headingId(line.slice(4)), text: line.slice(4), level: 3 });
  }
  return items;
}

/** Estimate reading time from content (words + list lines). */
export function estimateReadingTime(content: string): number {
  const words = content.split(/\s+/).filter(Boolean).length;
  return Math.max(3, Math.round(words / 200));
}

/** Map a blog category to a related product category slug, if any. */
export function blogCategoryToProductCategory(blogCategory: string): string | null {
  const map: Record<string, string> = {
    "Energy & Immunity": "energy-immunity",
    Immunity: "energy-immunity",
    "Men's Wellness": "mens-health",
    "Men's Health": "mens-health",
    "Women's Wellness": "womens-wellness",
    "Weight Management": "weight-management",
    Weight: "weight-management",
    "Brain & Focus": "brain-focus",
    Brain: "brain-focus",
    Digestion: "detox-digestion",
    Detox: "detox-digestion",
    "Healthy Living": "energy-immunity",
    Nutrition: "energy-immunity",
    Wellness: "energy-immunity",
    "Product Education": "mens-health",
  };
  return map[blogCategory] || null;
}

/** Normalise legacy category labels into the canonical set when they match. */
export function normaliseCategory(category: string): string {
  const map: Record<string, string> = {
    Immunity: "Energy & Immunity",
    "Men's Health": "Men's Wellness",
    Weight: "Weight Management",
    Detox: "Digestion",
    Brain: "Brain & Focus",
  };
  return map[category] || category;
}

/** Prisma where filter for posts that are live to visitors right now. */
export function publishedWhere() {
  return {
    isPublished: true,
    OR: [{ scheduledFor: null }, { scheduledFor: { lte: new Date() } }],
  };
}
