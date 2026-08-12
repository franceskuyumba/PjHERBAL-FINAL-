import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

export type ActivityAction =
  | "LOGIN"
  | "LOGOUT"
  | "ORDER_UPDATE"
  | "ORDER_CREATE"
  | "PAYMENT_UPDATE"
  | "PRODUCT_CREATE"
  | "PRODUCT_UPDATE"
  | "PRODUCT_DELETE"
  | "COUPON_CREATE"
  | "COUPON_UPDATE"
  | "REVIEW_UPDATE"
  | "BLOG_UPDATE"
  | "STAFF_CREATE"
  | "STAFF_UPDATE"
  | "DOCUMENT_CREATE"
  | "DOCUMENT_UPDATE"
  | "DOCUMENT_DELETE"
  | "SYSTEM";

export interface ActivityInput {
  actorId?: string | null;
  actorName?: string | null;
  role?: string | null;
  action: ActivityAction;
  entity?: string | null;
  entityId?: string | null;
  details?: string | null;
  ip?: string | null;
}

/** Records an audit log entry. Never throws. */
export async function logActivity(input: ActivityInput): Promise<void> {
  try {
    await prisma.activityLog.create({
      data: {
        actorId: input.actorId ?? null,
        actorName: input.actorName ?? null,
        role: input.role ?? null,
        action: input.action,
        entity: input.entity ?? null,
        entityId: input.entityId ?? null,
        details: input.details ? String(input.details).slice(0, 2000) : null,
        ip: input.ip ? String(input.ip).slice(0, 64) : null,
      },
    });
  } catch (e) {
    logger.warn("[activity] failed to log", String(e));
  }
}
