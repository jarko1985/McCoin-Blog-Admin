"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle2, ImageIcon, LinkIcon, FileText, Settings } from "lucide-react";

export default function Home() {
  const [open, setOpen] = useState(false);
  return (
    <main className="min-h-screen bg-brand-blue/95 text-brand-mercury">
      <section className="relative flex flex-col md:flex-row items-center justify-center isolate overflow-hidden px-6 py-28 sm:py-32 mx-auto xl:max-w-[70%]">
        <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{duration:.4}}
          className="mx-auto max-w-5xl">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl text-center md:text-left">McCoin Admin</h1>
            <p className="mt-4 text-lg text-brand-mercury/80 max-w-xl text-center md:text-left">
              Publish elegant crypto articles with a delightful, fast authoring experience.
            </p>
            <div className="mt-8 flex flex-col md:flex-row gap-3 items-center md:items-start justify-center md:justify-start">
              <a href="/dashboard" className="inline-flex min-w-40 items-center rounded-md bg-brand-red px-5 py-2.5 text-white shadow-elev transition hover:bg-brand-red/90">
                Go to Dashboard
              </a>
              <button onClick={() => setOpen(true)} className="inline-flex justify-center items-center min-w-40 rounded-md border border-brand-mercury/25 px-5 py-2.5 text-brand-mercury hover:bg-white/5 transition">
                Learn more
              </button>
            </div>
          </div>
        </motion.div>
        <div>
          <Image src="/images/blog_bg.png" alt="Hero Image" width={600} height={600} className="object-contain" />
        </div>
      </section>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">How to publish a post</DialogTitle>
            <DialogDescription className="text-center">Follow these steps to create a great blog post.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <motion.div initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} transition={{duration:.2}} className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-brand-mercury/80"/>
              <div>
                <p className="font-medium">Write your content</p>
                <p className="text-sm text-brand-mercury/80">Use the Markdown editor for rich formatting or switch to Plain Text.</p>
              </div>
            </motion.div>
            <motion.div initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} transition={{duration:.2, delay:.05}} className="flex items-start gap-3">
              <ImageIcon className="h-5 w-5 text-brand-mercury/80"/>
              <div>
                <p className="font-medium">Upload a cover image</p>
                <p className="text-sm text-brand-mercury/80">Click the Upload Image button on the dashboard and pick a local image. A preview will appear when uploaded.</p>
              </div>
            </motion.div>
            <motion.div initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} transition={{duration:.2, delay:.1}} className="flex items-start gap-3">
              <Settings className="h-5 w-5 text-brand-mercury/80"/>
              <div>
                <p className="font-medium">Fill in details</p>
                <p className="text-sm text-brand-mercury/80">Add title, short description, author, date and category. Mark as Featured if needed.</p>
              </div>
            </motion.div>
            <motion.div initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} transition={{duration:.2, delay:.15}} className="flex items-start gap-3">
              <LinkIcon className="h-5 w-5 text-brand-mercury/80"/>
              <div>
                <p className="font-medium">Slug and URL</p>
                <p className="text-sm text-brand-mercury/80">Your post URL slug is auto-generated from the title (lowercase, hyphen-separated). You can override it before publishing.</p>
              </div>
            </motion.div>
            <motion.div initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} transition={{duration:.2, delay:.2}} className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-400"/>
              <div>
                <p className="font-medium">Publish</p>
                <p className="text-sm text-brand-mercury/80">Click Publish. You’ll get a success dialog when the post is live. Errors will show with details and retry options.</p>
              </div>
            </motion.div>
          </div>
          <DialogFooter>
            <button onClick={() => setOpen(false)} className="inline-flex items-center justify-center rounded-md bg-brand-red px-4 py-2 text-white shadow-elev transition hover:bg-brand-red/90">
              I Understand
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
