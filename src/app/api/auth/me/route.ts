import { json } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  return json({ user });
}
