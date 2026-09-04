import { NextRequest } from "next/server";
import { json, requireApiAdmin, handleApiError } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    await requireApiAdmin();
    const categories = await prisma.category.findMany({ orderBy: { sortOrder: "asc" } });
    return json({ categories });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requireApiAdmin();
    const body = await request.json().catch(() => null);
    if (!body?.id) return json({ error: "Category id is required." }, 400);
    const data: Record<string, unknown> = {};
    for (const key of ["name", "description", "image", "icon"]) {
      if (typeof body[key] === "string") data[key] = body[key].trim();
    }
    if (typeof body.isActive === "boolean") data.isActive = body.isActive;
    const category = await prisma.category.update({ where: { id: String(body.id) }, data });
    revalidatePath("/");
    revalidatePath("/shop");
    if (category.slug) revalidatePath(`/category/${category.slug}`);
    return json({ category });
  } catch (error) {
    return handleApiError(error);
  }
}
