import { z } from 'zod';

export const postSchema = z.object({
  title: z.string().min(4).max(160),
  description: z.string().min(10).max(280),
  content: z.string().optional().default(''),
  author: z.string().optional().default('McCoin Editorial Team'),
  publishDate: z.string(), // keep as string to match your current usage
  category: z.string().min(2),
  image: z.string().url(),
  slug: z.string().min(3),
  likes: z.number().optional().default(0),
  dislikes: z.number().optional().default(0),
  featured: z.boolean().optional().default(false),
});
export type PostInput = z.input<typeof postSchema>;
