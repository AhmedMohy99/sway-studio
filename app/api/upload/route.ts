import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { base64Image } = await request.json();
    
    if (!base64Image) {
      return NextResponse.json({ error: "No image data" }, { status: 400 });
    }

    // Convert base64 string to a buffer the cloud can understand
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, 'base64');

    // Upload to Vercel Blob
    const blob = await put(`sway-studio/fitting-${Date.now()}.jpg`, buffer, {
      access: 'public', // Must be public for AI to see it
    });

    return NextResponse.json(blob);
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
