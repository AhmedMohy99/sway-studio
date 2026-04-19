import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { base64Image } = await req.json();

    // 1. Clean up the image string so Vercel can read it
    const base64Data = base64Image.split(',')[1];
    
    // 2. Convert it into a raw file buffer
    const buffer = Buffer.from(base64Data, 'base64');

    // 3. Upload to Vercel Blob Cloud Storage (Must be 'public' so the AI can see it later)
    const blob = await put(`sway-fitting-${Date.now()}.jpg`, buffer, {
      access: 'public',
      contentType: 'image/jpeg',
    });

    // 4. Return the new Cloud URL back to your website
    return NextResponse.json({ url: blob.url });

  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({ error: "Failed to upload image to cloud" }, { status: 500 });
  }
}
