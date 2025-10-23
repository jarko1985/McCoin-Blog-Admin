import { NextResponse } from 'next/server';
import crypto from 'crypto';

function makeSignature(timestamp: number, folder: string) {
  // Cloudinary requires parameters sorted alphabetically in the string to sign
  const toSign = `folder=${folder}&timestamp=${timestamp}`;
  return crypto
    .createHash('sha1')
    .update(toSign + process.env.CLOUDINARY_API_SECRET)
    .digest('hex');
}

async function respond() {
  const ts = Math.floor(Date.now() / 1000);
  const folder = process.env.CLOUDINARY_UPLOAD_FOLDER!;
  const signature = makeSignature(ts, folder);
  return NextResponse.json({
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    timestamp: ts,
    folder,
    signature,
  });
}

export async function GET() { return respond(); }
export async function POST() { return respond(); }
