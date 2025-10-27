'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import 'easymde/dist/easymde.min.css';

import { motion } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { postSchema, PostInput } from '@/lib/schemas';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import slugify from 'slugify';
import { Loader2, ChevronDown, CheckCircle2, UploadCloud } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

// Markdown editor (client-only)
const SimpleMDE = dynamic(() => import('react-simplemde-editor'), { ssr: false });

const categories = [
  'crypto-security','cryptomarket','bitcoin','ethereum','market-trends',
  'risk-management','technical-indicators','crypto-regulations','portfolio-diversification'
];

export default function Dashboard() {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [useMarkdown, setUseMarkdown] = useState<boolean>(true);
  const [slugTouched, setSlugTouched] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'success' | 'error'>('success');
  const [dialogMessage, setDialogMessage] = useState<string>('');

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<PostInput>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      author: 'McCoin Editorial Team',
      featured: false,
      likes: 0,
      dislikes: 0,
      publishDate: new Date().toLocaleDateString('en-GB'),
      content: '',
    },
  });

  const title = watch('title');
  const currentSlug = watch('slug');

  // Ensure RHF knows about content changes when toggling editor types
  useEffect(() => {
    // no-op, but keeps RHF synced when switching modes
  }, [useMarkdown]);

  // Auto-populate slug from title until user edits slug manually
  useEffect(() => {
    const auto = slugify(title || '', { lower: true, strict: true });
    if (!slugTouched || !currentSlug) {
      setValue('slug', auto, { shouldValidate: true, shouldDirty: true });
    }
  }, [title, slugTouched, currentSlug, setValue]);

  const onSubmit = async (data: PostInput) => {
    const payload: PostInput = {
      ...data,
      image: imageUrl || data.image,
      slug: data.slug || slugify(data.title, { lower: true, strict: true }),
    };

    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      let msg = 'Please check inputs';
      try {
        const j = await res.json();
        if (j?.error) msg = j.error;
      } catch {}
      setDialogMode('error');
      setDialogMessage(msg);
      setDialogOpen(true);
      return;
    }
    setDialogMode('success');
    setDialogMessage('Your post is live.');
    setDialogOpen(true);
  };

  return (
    <>
    <main className="min-h-screen bg-brand-blue/95 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: .3 }}
        className="max-w-5xl mx-auto space-y-8"
      >
        <div className="flex items-center justify-between">
          <h1 className="text-3xl md:text-4xl font-semibold text-brand-mercury tracking-tight">
            <span className="text-brand-red">McCoin</span> Blog Publisher
          </h1>

          {/* Editor mode switch */}
          <div className="inline-flex items-center gap-2">
            <span className="text-sm text-brand-mercury/80">Editor:</span>
            <div className="inline-flex rounded-lg overflow-hidden border border-brand-mercury/20">
              <button
                type="button"
                onClick={() => setUseMarkdown(true)}
                className={`px-3 py-1 text-sm transition ${
                  useMarkdown
                    ? 'bg-brand-red text-white'
                    : 'bg-transparent text-brand-mercury hover:bg-white/5'
                }`}
              >
                Markdown
              </button>
              <button
                type="button"
                onClick={() => setUseMarkdown(false)}
                className={`px-3 py-1 text-sm transition ${
                  !useMarkdown
                    ? 'bg-brand-red text-white'
                    : 'bg-transparent text-brand-mercury hover:bg-white/5'
                }`}
              >
                Plain Text
              </button>
            </div>
          </div>
        </div>

        <Card className="bg-brand-blue/95 border border-brand-mercury/15 shadow-elev backdrop-blur">
          <CardContent className="p-6 md:p-8 grid md:grid-cols-2 gap-6">
            {/* Left column */}
            <div className="space-y-4">
              <motion.div initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} transition={{duration:.25}}>
                <Label className="text-brand-mercury mb-2 block">Title</Label>
                <Input
                  {...register('title')}
                  placeholder="Post title"
                  className="bg-transparent border-brand-mercury/30 text-brand-mercury focus:ring-2 focus:ring-brand-red/40 transition-shadow"
                />
                {errors.title && <p className="text-brand-red text-sm mt-1">{errors.title.message}</p>}
              </motion.div>

              <motion.div initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} transition={{duration:.25, delay:.05}}>
                <Label className="text-brand-mercury mb-2 block">Short Description</Label>
                <Textarea
                  {...register('description')}
                  rows={3}
                  placeholder="One-liner teaser"
                  className="bg-transparent border-brand-mercury/30 text-brand-mercury focus:ring-2 focus:ring-brand-red/40 transition-shadow"
                />
                {errors.description && (
                  <motion.p initial={{opacity:0,y:-4}} animate={{opacity:1,y:0}} className="text-brand-red text-sm mt-1">
                    {errors.description.message}
                  </motion.p>
                )}
              </motion.div>

              {/* Content editor */}
              <motion.div initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} transition={{duration:.25, delay:.1}}>
                <Label className="text-brand-mercury mb-2 block">
                  Content {useMarkdown ? '(Markdown)' : '(Plain Text)'}
                </Label>

                {useMarkdown ? (
                  // Markdown editor
                  <Controller
                    name="content"
                    control={control}
                    render={({ field }) => (
                      <SimpleMDE
                        {...field}
                        placeholder="Write your content in Markdown…"
                        options={{
                          spellChecker: false,
                          status: false,
                          autofocus: false,
                          minHeight: '220px',
                          maxHeight: '480px',
                          renderingConfig: { singleLineBreaks: false, codeSyntaxHighlighting: true },
                          toolbar: [
                            'bold','italic','heading','|',
                            'quote','unordered-list','ordered-list','|',
                            'link','image','table','code','|',
                            'guide','preview','side-by-side','fullscreen'
                          ],
                        }}
                        className="rounded-md overflow-hidden border border-brand-mercury/30 bg-white"
                      />
                    )}
                  />
                ) : (
                  // Plain textarea fallback (keeps RHF schema the same)
                  <Textarea
                    {...register('content')}
                    rows={10}
                    placeholder="Write your content..."
                    className="bg-transparent h-[575px] border-brand-mercury/30 text-brand-mercury focus:ring-2 focus:ring-brand-red/40 transition-shadow"
                  />
                )}

                {errors.content && (
                  <motion.p initial={{opacity:0,y:-4}} animate={{opacity:1,y:0}} className="text-brand-red text-sm mt-1">
                    {errors.content.message}
                  </motion.p>
                )}
              </motion.div>
            </div>

            {/* Right column */}
            <div className="space-y-4">
              <motion.div
                initial={{opacity:0, y:8}}
                animate={{opacity:1, y:0}}
                transition={{duration:.25}}
                className="grid grid-cols-2 gap-4"
              >
                <div>
                  <Label className="text-brand-mercury mb-2 block">Author</Label>
                  <Input
                    {...register('author')}
                    className="bg-transparent border-brand-mercury/30 text-brand-mercury focus:ring-2 focus:ring-brand-red/40 transition-shadow"
                  />
                </div>
                <div>
                  <Label className="text-brand-mercury mb-2 block">Publish Date</Label>
                  <Input
                    {...register('publishDate')}
                    placeholder="DD/MM/YYYY"
                    className="bg-transparent border-brand-mercury/30 text-brand-mercury focus:ring-2 focus:ring-brand-red/40 transition-shadow"
                  />
                </div>
              </motion.div>

              <motion.div initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} transition={{duration:.25, delay:.05}}>
                <Label className="text-brand-mercury mb-2 block">Category</Label>
                <div className="relative">
                  <select
                    {...register('category')}
                    className="w-full appearance-none rounded-md bg-transparent border border-brand-mercury/30 text-brand-mercury px-3 pr-10 py-2 focus:ring-2 focus:ring-brand-red/40 transition-shadow"
                  >
                    <option value="" className="bg-brand-blue">Select…</option>
                    {categories.map((c) => (
                      <option key={c} value={c} className="bg-brand-blue">
                        {c}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-mercury/60" />
                </div>
              </motion.div>

              {/* Image upload */}
              <motion.div
                initial={{opacity:0, y:8}}
                animate={{opacity:1, y:0}}
                transition={{duration:.25, delay:.1}}
                className="space-y-2"
              >
                <Label className="text-brand-mercury mb-2 block">Image</Label>
                <ImageUploadButton onUploaded={(url) => { setImageUrl(url); setValue('image', url, { shouldValidate: true, shouldDirty: true }); }} />
                {imageUrl && <Badge className="bg-brand-red/20 text-brand-mercury shadow-sm">Selected</Badge>}
                {imageUrl && (
                  <div className="mt-3 rounded-lg border border-brand-mercury/20 p-2 bg-white/5">
                    <img src={imageUrl} alt="Preview" className="h-96 w-full object-cover rounded-md" />
                  </div>
                )}
                <Input
                  {...register('image')}
                  placeholder="or paste image URL"
                  className="bg-transparent border-brand-mercury/30 text-brand-mercury focus:ring-2 focus:ring-brand-red/40 transition-shadow"
                />
                {errors.image && (
                  <motion.p initial={{opacity:0,y:-4}} animate={{opacity:1,y:0}} className="text-brand-red text-sm mt-1">
                    {errors.image.message as string}
                  </motion.p>
                )}
              </motion.div>

              <motion.div
                initial={{opacity:0, y:8}}
                animate={{opacity:1, y:0}}
                transition={{duration:.25, delay:.15}}
                className="grid grid-cols-2 gap-4"
              >
                <div>
                  <Label className="text-brand-mercury mb-2 block">Slug</Label>
                  <Input
                    {...register('slug', { onChange: () => setSlugTouched(true) })}
                    placeholder={title ? `${slugify(title, { lower: true, strict: true })}` : 'auto'}
                    className="bg-transparent border-brand-mercury/30 text-brand-mercury focus:ring-2 focus:ring-brand-red/40 transition-shadow"
                  />
                </div>
                <div className="flex items-end gap-2">
                  <input
                    type="checkbox"
                    {...(register('featured') as any)}
                    id="featured"
                    className="w-5 h-5 accent-brand-red"
                  />
                  <Label htmlFor="featured" className="text-brand-mercury">
                    Featured
                  </Label>
                </div>
              </motion.div>

              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: .99 }}>
                <Button
                  disabled={isSubmitting}
                  onClick={handleSubmit(onSubmit)}
                  className="w-full bg-brand-red hover:bg-brand-red/90 text-white shadow-elev transition-transform will-change-transform"
                >
                  {isSubmitting ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" /> Publishing…
                    </span>
                  ) : (
                    'Publish'
                  )}
                </Button>
              </motion.div>
            </div>
          </CardContent>
        </Card>

        {/* Tip: small helper card */}
        <div className="text-xs text-brand-mercury/60">
          <p>
            Markdown supported: **bold**, _italic_, `code`, lists, tables, links, images. Use the toolbar for preview & fullscreen.
          </p>
        </div>
      </motion.div>
    </main>
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent>
        <DialogHeader>
          {dialogMode === 'success' && (
            <div className="mx-auto mb-2 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="h-10 w-10" />
            </div>
          )}
          <DialogTitle className={dialogMode === 'success' ? 'text-emerald-400 text-center' : 'text-brand-red text-center'}>
            {dialogMode === 'success' ? 'Post Published Successfully' : 'Failed to Publish'}
          </DialogTitle>
          <DialogDescription className="text-center">
            {dialogMessage}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          {dialogMode === 'success' ? (
            <Button onClick={() => setDialogOpen(false)} className="bg-emerald-500 hover:bg-emerald-500/90 text-white cursor-pointer">
              OK
            </Button>
          ) : (
            <div className="w-full flex items-center justify-end gap-2">
              <Button variant="outline" onClick={() => { setDialogOpen(false); }} className="border-brand-mercury/30 text-brand-mercury">
                Never mind
              </Button>
              <Button onClick={() => { setDialogOpen(false); reset(); setSlugTouched(false); setImageUrl(''); }} className="bg-brand-red hover:bg-brand-red/90 text-white">
                Try again
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}

function ImageUploadButton({ onUploaded }: { onUploaded: (url: string) => void }) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);

  const handlePick = () => inputRef.current?.click();

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: form });
      const json = await res.json();
      if (json?.imageUrl) {
        onUploaded(json.imageUrl);
        toast.success('Image uploaded', { description: 'Cloudinary upload complete.' });
      } else {
        toast.error('Upload failed');
      }
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <input ref={inputRef} type="file" accept="image/*" onChange={handleChange} className="hidden" />
      <Button type="button" onClick={handlePick}
        className="inline-flex items-center gap-2 bg-brand-red hover:bg-brand-red/90 text-white shadow-elev">
        {uploading ? (
          <><Loader2 className="h-4 w-4 animate-spin" /> Uploading…</>
        ) : (
          <><UploadCloud className="h-4 w-4" /> Upload Image</>
        )}
      </Button>
      <span className="text-xs text-brand-mercury/70">PNG, JPG up to ~5MB</span>
    </div>
  );
}
