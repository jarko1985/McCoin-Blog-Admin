"use client";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="min-h-screen bg-brand-blue/95 text-brand-mercury">
      <section className="relative isolate overflow-hidden px-6 py-28 sm:py-32">
        <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{duration:.4}}
          className="mx-auto max-w-5xl">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">McCoin Admin</h1>
            <p className="mt-4 text-lg text-brand-mercury/80 max-w-xl">
              Publish elegant crypto articles with a delightful, fast authoring experience.
            </p>
            <div className="mt-8 flex gap-3">
              <a href="/dashboard" className="inline-flex items-center rounded-md bg-brand-red px-5 py-2.5 text-white shadow-elev transition hover:bg-brand-red/90">
                Go to Dashboard
              </a>
              <a href="/" className="inline-flex items-center rounded-md border border-brand-mercury/25 px-5 py-2.5 text-brand-mercury hover:bg-white/5 transition">
                Learn more
              </a>
            </div>
          </div>
        </motion.div>
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-40 mask-[radial-gradient(50%_50%_at_50%_50%,black,transparent)]">
          <div className="absolute -top-24 -right-20 h-72 w-72 rounded-full bg-brand-red blur-3xl" />
          <div className="absolute bottom-0 left-10 h-72 w-72 rounded-full bg-brand-mercury blur-3xl" />
        </div>
      </section>
    </main>
  );
}
