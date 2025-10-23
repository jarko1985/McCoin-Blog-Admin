import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Post from '../../../../../../models/Post';
import { publicCors } from '@/lib/cors';

export async function OPTIONS() {
  return new NextResponse(null, { headers: publicCors as any });
}

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  await dbConnect();
  const post = await Post.findOne({ slug }).lean();
  if (!post) return new NextResponse(JSON.stringify({ error: 'Not found' }), { status: 404, headers: publicCors as any });
  return new NextResponse(JSON.stringify({ post }), {
    headers: { 'Content-Type': 'application/json', ...publicCors },
  });
}
