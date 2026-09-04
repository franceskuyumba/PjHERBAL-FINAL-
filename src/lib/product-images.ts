export function parseProductImages(value: string): string[] {
  const raw = value.trim();
  if (!raw) return [];

  if (raw.startsWith("[")) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed.map(String).map((image) => image.trim()).filter(Boolean);
    } catch {
      // Fall back to the legacy format below.
    }
  }

  return raw.split(",").map((image) => image.trim()).filter(Boolean);
}