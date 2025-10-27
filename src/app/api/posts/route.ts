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

  // ensure unique slug by appending -n if needed
  const baseSlug = (body.slug || slugify(body.title, { lower: true, strict: true })) as string;
  const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const slugRegex = new RegExp(`^${escapeRegExp(baseSlug)}(?:-(\\d+))?$`, 'i');
  const existing = await Post.find({ slug: slugRegex }).select('slug').lean<Array<{ slug: string }>>();
  let slug = baseSlug;
  if (existing.length > 0) {
    let maxSuffix = 1;
    for (const doc of existing) {
      const m = doc.slug.match(/-(\d+)$/);
      if (m) {
        const n = parseInt(m[1], 10);
        if (n >= maxSuffix) maxSuffix = n + 1;
      } else {
        // base taken without suffix
        if (maxSuffix <= 1) maxSuffix = 2;
      }
    }
    slug = `${baseSlug}-${maxSuffix}`;
  }

  const payload = postSchema.parse({
    ...body,
    slug,
  });

  try {
    const doc = await Post.create({ ...payload, id });
    return NextResponse.json({ post: doc }, { status: 201 });
  } catch (err: any) {
    if (err?.code === 11000 && err?.keyPattern?.slug) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
