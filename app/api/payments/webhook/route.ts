import { NextResponse } from 'next/server';
import { sendSMS } from '@/lib/sms';

export async function POST(request: Request) {
  const body = await request.json();
  const { customerPhone, paymentStatus } = body;

  if (paymentStatus === 'SUCCESS' || paymentStatus === 'PAID') {
    const paymentMessage = "Dear customer, your payment has been confirmed. Your order is prepared for delivery. For details call 0767234340.";
    await sendSMS(customerPhone, paymentMessage);
    return NextResponse.json({ success: true, message: 'Payment confirmation SMS dispatched.' });
  }

  return NextResponse.json({ success: false }, { status: 400 });
}
