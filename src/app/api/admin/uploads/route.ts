import { put, del } from '@vercel/blob';
import { NextResponse } from 'next/server';

async function makeDataUrl(file: File) {
  const bytes = await file.arrayBuffer();
  const mimeType = file.type || 'image/jpeg';
  return `data:${mimeType};base64,${Buffer.from(bytes).toString('base64')}`;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const rawFiles = formData.getAll('files').length > 0 ? formData.getAll('files') : formData.getAll('file');
    const files = rawFiles.filter((f): f is File => f instanceof File);

    if (files.length === 0) {
      const singleFile = (formData.get('image') || formData.get('upload')) as File | null;
      if (singleFile) files.push(singleFile);
    }

    if (files.length === 0) {
      return NextResponse.json({ urls: [], url: '/placeholder.jpg' }, { status: 200 });
    }

    const uploadedUrls: string[] = [];

    for (const file of files) {
      if (process.env.BLOB_READ_WRITE_TOKEN) {
        const blob = await put(file.name || `product-${Date.now()}.png`, file, { access: 'public' });
        uploadedUrls.push(blob.url);
        continue;
      }

      uploadedUrls.push(await makeDataUrl(file));
    }

    return NextResponse.json({ urls: uploadedUrls, url: uploadedUrls[0] || '/placeholder.jpg' }, { status: 200 });
  } catch (error: any) {
    console.error('UPLOAD_ERROR:', error);
    return NextResponse.json({ urls: [], url: '/placeholder.jpg' }, { status: 200 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { url } = await request.json().catch(() => ({ url: null }));
    if (url && url.startsWith('http') && process.env.BLOB_READ_WRITE_TOKEN) {
      await del(url);
    }
    return NextResponse.json({ success: true }, { status: 200 });
  } catch {
    return NextResponse.json({ success: true }, { status: 200 });
  }
}
