import { NextResponse } from 'next/server';
import { sendSMS } from '@/lib/sms';

export async function POST(request: Request) {
  const body = await request.json();
  const { phone } = body;

  const welcomeMessage = "Karibu PJHERBAL Clinic kwa huduma mbalimbali za kiafya (vipimo, ushauri, pamoja na dawa mbalimbali zilizokatika mfumo wa virutubisho).";
  await sendSMS(phone, welcomeMessage);

  return NextResponse.json({ success: true, message: 'Welcome SMS dispatched.' });
}
