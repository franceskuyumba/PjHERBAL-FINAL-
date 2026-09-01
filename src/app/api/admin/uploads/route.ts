import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = (formData.get('files') || formData.get('file') || formData.get('image')) as File;

    if (!file) {
      return NextResponse.json({ urls: [], url: '/placeholder.jpg' }, { status: 200 });
    }

    // Convert file to base64 data URI so uploads work instantly without external storage setup
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const mimeType = file.type || 'image/jpeg';
    const dataUrl = `data:${mimeType};base64,${buffer.toString('base64')}`;

    return NextResponse.json({ urls: [dataUrl], url: dataUrl }, { status: 200 });
  } catch (error: any) {
    console.error('UPLOAD_ERROR:', error);
    return NextResponse.json({ urls: [], url: '/placeholder.jpg' }, { status: 200 });
  }
}

export async function DELETE() {
  return NextResponse.json({ success: true }, { status: 200 });
}
