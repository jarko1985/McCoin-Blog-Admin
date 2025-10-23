import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Post from '../../../../../models/Post';
import { publicCors } from '@/lib/cors';

export async function OPTIONS() {
  return new NextResponse(null, { headers: publicCors as any });
}

export async function GET() {
  await dbConnect();
  const posts = await Post.find().sort({ createdAt: -1 }).lean();
  return new NextResponse(JSON.stringify({ posts }), {
    headers: { 'Content-Type': 'application/json', ...publicCors },
  });
}
