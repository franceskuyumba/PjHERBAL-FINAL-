import { SITE } from "@/lib/constants";
import { logger } from "@/lib/logger";

/**
 * Email / SMS notification abstraction.
 *
 * The store runs with the "console" provider out of the box (no credentials
 * required) — messages are logged to the app log file and the server console.
 *
 * To go live, set provider env vars and implement the provider methods, or
 * point EMAIL_PROVIDER / SMS_PROVIDER at a gateway of your choice (SMTP for
 * email; Infobip/Twilio for SMS). See docs/ADMIN_MANUAL.md.
 */

export interface EmailMessage {
  to: string;
  subject: string;
  html?: string;
  text?: string;
}

export interface SmsMessage {
  to: string;
  text: string;
}

export interface NotifyProvider {
  name: string;
  sendEmail(message: EmailMessage): Promise<boolean>;
  sendSms(message: SmsMessage): Promise<boolean>;
}

class ConsoleProvider implements NotifyProvider {
  name = "console";
  async sendEmail(message: EmailMessage): Promise<boolean> {
    logger.info(
      `[notify] EMAIL to=${message.to} subject="${message.subject}"`,
      message.text || ""
    );
    return true;
  }
  async sendSms(message: SmsMessage): Promise<boolean> {
    logger.info(`[notify] SMS to=${message.to} text="${message.text}"`);
    return true;
  }
}

class InfobipProvider implements NotifyProvider {
  name = "infobip";
  private baseUrl = (process.env.INFOBIP_BASE_URL || "https://api.infobip.com").replace(/\/$/, "");

  async sendEmail(_message: EmailMessage): Promise<boolean> {
    return false;
  }

  async sendSms(message: SmsMessage): Promise<boolean> {
    const apiKey = process.env.INFOBIP_API_KEY;
    const sender = process.env.INFOBIP_SENDER;
    if (!apiKey || !sender) return false;
    const phone = normalizeTanzaniaPhone(message.to);
    if (!phone) {
      logger.error("[notify] invalid SMS recipient", message.to);
      return false;
    }
    const response = await fetch(`${this.baseUrl}/sms/2/text/advanced`, {
      method: "POST",
      headers: { Authorization: `App ${apiKey}`, "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ messages: [{ from: sender, destinations: [{ to: phone }], text: message.text }] }),
    });
    return response.ok;
  }
}

function normalizeTanzaniaPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0") && digits.length === 10) return `255${digits.slice(1)}`;
  if (digits.startsWith("255") && digits.length === 12) return digits;
  return "";
}

const consoleProvider = new ConsoleProvider();
const infobipProvider = new InfobipProvider();

export function getEmailProvider(): NotifyProvider {
  // Future: switch on process.env.EMAIL_PROVIDER === "smtp" -> SMTP provider.
  return consoleProvider;
}

export function getSmsProvider(): NotifyProvider {
  return process.env.SMS_PROVIDER?.toLowerCase() === "infobip" ? infobipProvider : consoleProvider;
}

/** Sends an order email if a provider is configured; never throws. */
export async function sendEmail(message: EmailMessage): Promise<boolean> {
  try {
    return await getEmailProvider().sendEmail(message);
  } catch (e) {
    logger.error("[notify] sendEmail failed", String(e));
    return false;
  }
}

/** Sends an SMS if a provider is configured; never throws. */
export async function sendSms(message: SmsMessage): Promise<boolean> {
  try {
    return await getSmsProvider().sendSms(message);
  } catch (e) {
    logger.error("[notify] sendSms failed", String(e));
    return false;
  }
}

/** Convenience: confirms order to a customer (email + SMS, best effort). */
export async function sendOrderConfirmation(order: {
  orderNumber: string;
  total: number;
  customerEmail: string;
  customerPhone: string;
  customerName: string;
}) {
  const text = `Hello ${order.customerName}, thank you for your order #${order.orderNumber} (TZS ${order.total.toLocaleString()}) with ${SITE.name}. We will confirm once payment is received.`;
  await Promise.all([
    sendEmail({
      to: order.customerEmail,
      subject: `Order ${order.orderNumber} received — ${SITE.name}`,
      text,
    }),
    sendSms({ to: order.customerPhone, text }),
    sendSms({ to: SITE.headOfficePhone, text: `New order ${order.orderNumber} from ${order.customerName}. Total TZS ${order.total.toLocaleString()}.` }),
  ]);
}
