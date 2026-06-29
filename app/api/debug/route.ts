import { NextResponse } from 'next/server';

export async function GET() {
  const key = process.env.GEMINI_API_KEY || "";
  return NextResponse.json({
    hasKey: !!key,
    prefix: key ? key.substring(0, 8) + "..." : "none",
    length: key.length,
    nodeEnv: process.env.NODE_ENV
  });
}
