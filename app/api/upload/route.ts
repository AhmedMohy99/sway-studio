import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { base64Image } = await request.json();
    
    if (!base64Image) {
      return NextResponse.json({ error: "No image data" }, { status: 400 });
    }

    // Prepare the image for the cloud
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, 'base64');
    const fileName = `sway-studio/fitting-${Date.now()}.jpg`;

    // This puts the image into your new PUBLIC store
    const blob = await put(fileName, buffer, {
      access: 'public',
      contentType: 'image/jpeg',
    });

    return NextResponse.json(blob);
  } catch (error: any) {
    console.error("Vercel Blob Error:", error);
    return NextResponse.json({ error: "Cloud connection failed. Check your Vercel Storage tab." }, { status: 500 });
  }
}
