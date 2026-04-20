import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { base64Image } = await request.json();
    if (!base64Image) return NextResponse.json({ error: "No image" }, { status: 400 });

    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, 'base64');
    const fileName = `sway-studio/fitting-${Date.now()}.jpg`;

    const blob = await put(fileName, buffer, {
      access: 'public', // Critical for the AI engine to read the file
      contentType: 'image/jpeg',
    });

    return NextResponse.json(blob);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
