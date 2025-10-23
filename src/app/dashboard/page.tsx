'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { postSchema, PostInput } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
// Removed widget; using server-side upload API
import { toast } from 'sonner';
import slugify from 'slugify';
import { Loader2, ChevronDown } from 'lucide-react';

const categories = [
  'crypto-security','cryptomarket','bitcoin','ethereum','market-trends',
  'risk-management','technical-indicators','crypto-regulations','portfolio-diversification'
];

export default function Dashboard() {
  const [imageUrl, setImageUrl] = useState<string>('');
  const { register, handleSubmit, formState:{ errors, isSubmitting }, setValue, watch } =
    useForm<PostInput>({
      resolver: zodResolver(postSchema),
      defaultValues: {
        author: 'McCoin Editorial Team',
        featured: false,
        likes: 0,
        dislikes: 0,
        publishDate: new Date().toLocaleDateString('en-GB'),
      }
    });

  const title = watch('title');

  const onSubmit = async (data: PostInput) => {
    const payload: PostInput = {
      ...data,
      image: imageUrl || data.image,
      slug: data.slug || slugify(data.title, { lower: true, strict: true }),
    };
    const res = await fetch('/api/posts', {
      method: 'POST', headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      toast.error('Failed to publish', { description: 'Please check inputs' });
      return;
    }
    toast.success('Published!', { description: 'Your post is live.' });
  };

  return (
    <main className="min-h-screen bg-brand-blue/95 py-12 px-4">
      <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:.3}}
        className="max-w-5xl mx-auto space-y-8">
        <h1 className="text-3xl md:text-4xl font-semibold text-brand-mercury tracking-tight">Blog Publisher</h1>

        <Card className="bg-brand-blue/95 border border-brand-mercury/15 shadow-elev backdrop-blur">
          <CardContent className="p-6 md:p-8 grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <motion.div initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} transition={{duration:.25}}>
                <Label className="text-brand-mercury mb-1 block">Title</Label>
                <Input {...register('title')} placeholder="Post title"
                  className="bg-transparent border-brand-mercury/30 text-brand-mercury focus:ring-2 focus:ring-brand-red/40 transition-shadow" />
                {errors.title && <p className="text-brand-red text-sm mt-1">{errors.title.message}</p>}
              </motion.div>

              <motion.div initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} transition={{duration:.25, delay:.05}}>
                <Label className="text-brand-mercury mb-1 block">Short Description</Label>
                <Textarea {...register('description')} rows={3} placeholder="One-liner teaser"
                  className="bg-transparent border-brand-mercury/30 text-brand-mercury focus:ring-2 focus:ring-brand-red/40 transition-shadow" />
                {errors.description && (
                  <motion.p initial={{opacity:0,y:-4}} animate={{opacity:1,y:0}} className="text-brand-red text-sm mt-1">
                    {errors.description.message}
                  </motion.p>
                )}
              </motion.div>

              <motion.div initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} transition={{duration:.25, delay:.1}}>
                <Label className="text-brand-mercury mb-1 block">Content (Markdown or plain)</Label>
                <Textarea {...register('content')} rows={10} placeholder="Write your content..."
                  className="bg-transparent border-brand-mercury/30 text-brand-mercury focus:ring-2 focus:ring-brand-red/40 transition-shadow" />
                {errors.content && (
                  <motion.p initial={{opacity:0,y:-4}} animate={{opacity:1,y:0}} className="text-brand-red text-sm mt-1">
                    {errors.content.message}
                  </motion.p>
                )}
              </motion.div>
            </div>

            <div className="space-y-4">
              <motion.div initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} transition={{duration:.25}} className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-brand-mercury mb-1 block">Author</Label>
                  <Input {...register('author')} className="bg-transparent border-brand-mercury/30 text-brand-mercury focus:ring-2 focus:ring-brand-red/40 transition-shadow"/>
                </div>
                <div>
                  <Label className="text-brand-mercury mb-1 block">Publish Date</Label>
                  <Input {...register('publishDate')} placeholder="DD/MM/YYYY"
                    className="bg-transparent border-brand-mercury/30 text-brand-mercury focus:ring-2 focus:ring-brand-red/40 transition-shadow"/>
                </div>
              </motion.div>

              <motion.div initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} transition={{duration:.25, delay:.05}}>
                <Label className="text-brand-mercury mb-1 block">Category</Label>
                <div className="relative">
                  <select {...register('category')}
                    className="w-full appearance-none rounded-md bg-transparent border border-brand-mercury/30 text-brand-mercury px-3 pr-10 py-2 focus:ring-2 focus:ring-brand-red/40 transition-shadow">
                    <option value="" className="bg-brand-blue">Select…</option>
                    {categories.map(c => <option key={c} value={c} className="bg-brand-blue">{c}</option>)}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-mercury/60" />
                </div>
              </motion.div>

              <motion.div initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} transition={{duration:.25, delay:.1}} className="space-y-2">
                <Label className="text-brand-mercury mb-1 block">Image</Label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const form = new FormData();
                      form.append('file', file);
                      const res = await fetch('/api/upload', { method: 'POST', body: form });
                      const json = await res.json();
                      if (json?.imageUrl) {
                        setImageUrl(json.imageUrl);
                        setValue('image', json.imageUrl);
                        toast.success('Image uploaded', { description: 'Cloudinary upload complete.' });
                      } else {
                        toast.error('Upload failed');
                      }
                    }}
                    className="text-brand-mercury"
                  />
                  {imageUrl && <Badge className="bg-brand-red/20 text-brand-mercury shadow-sm">Selected</Badge>}
                </div>
                {imageUrl && (
                  <div className="mt-3 rounded-lg border border-brand-mercury/20 p-2 bg-white/5">
                    <img src={imageUrl} alt="Preview" className="h-32 w-full object-cover rounded-md" />
                  </div>
                )}
                <Input {...register('image')} placeholder="or paste image URL"
                  className="bg-transparent border-brand-mercury/30 text-brand-mercury focus:ring-2 focus:ring-brand-red/40 transition-shadow"/>
              </motion.div>

              <motion.div initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} transition={{duration:.25, delay:.15}} className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-brand-mercury mb-1 block">Slug</Label>
                  <Input {...register('slug')} placeholder={title ? `${slugify(title,{lower:true,strict:true})}` : 'auto'}
                    className="bg-transparent border-brand-mercury/30 text-brand-mercury focus:ring-2 focus:ring-brand-red/40 transition-shadow"/>
                </div>
                <div className="flex items-end gap-2">
                  <input type="checkbox" {...(register('featured') as any)} id="featured"
                    className="w-5 h-5 accent-brand-red"/>
                  <Label htmlFor="featured" className="text-brand-mercury">Featured</Label>
                </div>
              </motion.div>

              <motion.div whileHover={{scale:1.01}} whileTap={{scale:.99}}>
                <Button disabled={isSubmitting} onClick={handleSubmit(onSubmit)}
                  className="w-full bg-brand-red hover:bg-brand-red/90 text-white shadow-elev transition-transform will-change-transform">
                  {isSubmitting ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" /> Publishing…
                    </span>
                  ) : 'Publish'}
                </Button>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </main>
  );
}
