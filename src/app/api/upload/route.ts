import { put, del } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const rawFiles = formData.getAll('files').length > 0 ? formData.getAll('files') : formData.getAll('file');
    const files = rawFiles.filter((f): f is File => f instanceof File);
    if (files.length === 0) {
      const singleFile = (formData.get('image') || formData.get('upload')) as File;
      if (singleFile) files.push(singleFile);
    }
    if (files.length === 0) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });

    const uploadedUrls: string[] = [];
    for (const file of files) {
      const blob = await put(file.name, file, { access: 'public' });
      uploadedUrls.push(blob.url);
    }
    return NextResponse.json({ urls: uploadedUrls, url: uploadedUrls[0] });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { url } = await request.json();
    if (url && url.startsWith('http')) await del(url);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: true });
  }
}
