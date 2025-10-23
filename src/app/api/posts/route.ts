import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import Post from '../../../../models/Post';
import slugify from 'slugify';
import { postSchema } from '@/lib/schemas';

export async function GET() {
  await dbConnect();
  const posts = await Post.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json({ posts });
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const body = await req.json();
  // compute id (max + 1); switch to counter collection for high scale
  const max = await Post.findOne().sort({ id: -1 }).select('id').lean<{ id: number }>();
  const id = (max?.id ?? 0) + 1;

  const payload = postSchema.parse({
    ...body,
    slug: body.slug || slugify(body.title, { lower: true, strict: true }),
  });

  const doc = await Post.create({ ...payload, id });
  return NextResponse.json({ post: doc }, { status: 201 });
}
