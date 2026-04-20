import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { base64Image } = await request.json();
    
    if (!base64Image) {
      return NextResponse.json({ error: "No image data provided" }, { status: 400 });
    }

    // Clean the base64 string
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, 'base64');

    // Generate a unique filename for the Sway Studio fitting
    const fileName = `sway-fitting-${Date.now()}.jpg`;

    // UPLOAD TO VERCEL BLOB
    // We use 'public' so the AI and WhatsApp can access the image URL
    const blob = await put(fileName, buffer, {
      access: 'public',
      contentType: 'image/jpeg',
    });

    return NextResponse.json(blob);
  } catch (error: any) {
    console.error("Vercel Blob Error:", error.message);
    
    // If the store is still private, this will catch the specific error
    if (error.message.includes("private store")) {
      return NextResponse.json({ 
        error: "Your Vercel Blob store is set to PRIVATE. Please recreate it as a PUBLIC store in the Vercel Dashboard." 
      }, { status: 403 });
    }

    return NextResponse.json({ error: "Upload failed. Check Vercel Environment Variables." }, { status: 500 });
  }
}
