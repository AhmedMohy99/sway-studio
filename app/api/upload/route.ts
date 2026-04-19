import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { base64Image } = await req.json();

    // 1. Extract the raw data
    const base64Data = base64Image.split(',')[1];
    const buffer = Buffer.from(base64Data, 'base64');

    // 2. Upload with a unique timestamp to your NEW PUBLIC BLOB
    const blob = await put(`sway-request-${Date.now()}.jpg`, buffer, {
      access: 'public', // This MUST be public
      contentType: 'image/jpeg',
    });

    return NextResponse.json({ url: blob.url });

  } catch (error) {
    console.error("Upload Error:", error);
    // This will show exactly why it failed in your Vercel Logs
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
