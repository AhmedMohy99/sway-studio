import { NextResponse } from 'next/server';
import Replicate from 'replicate';

// This securely loads your API key from Vercel
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req: Request) {
  try {
    const { userImage, garmentImage } = await req.json();

    // We are calling the IDM-VTO model on Replicate
    const output = await replicate.run(
      "cuuupid/idm-vto:c871bb9b046607b680449ecbae55fd8c6d945e0a1948644bf2361b3d021d3ff4",
      {
        input: {
          garm_img: garmentImage, // The Sway hoodie image
          human_img: userImage,   // The customer's webcam photo
          garment_des: "oversized streetwear hoodie",
          category: "upper_body", 
        }
      }
    );

    // Replicate returns an array with the URL of the finished image
    return NextResponse.json({ resultUrl: output });

  } catch (error) {
    console.error("AI Generation Error:", error);
    return NextResponse.json({ error: "Failed to generate fitting" }, { status: 500 });
  }
}
