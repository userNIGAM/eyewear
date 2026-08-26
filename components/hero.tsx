"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Eye } from "lucide-react";

export default function Hero() {
  const handleScrollToCollections = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const collectionsSection = document.getElementById("collections");
    if (collectionsSection) {
      collectionsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-zinc-950 px-4 py-16 sm:px-6 lg:px-8">
      {/* Decorative background glows */}
      <div className="absolute top-1/4 left-1/2 -z-10 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-500/10 blur-[120px]" />
      <div className="absolute bottom-10 left-1/3 -z-10 h-[300px] w-[500px] rounded-full bg-zinc-900 blur-[100px]" />

      <motion.div
        className="mx-auto max-w-5xl text-center flex flex-col items-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Sub-badge */}
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/80 px-4 py-1.5 text-xs font-medium text-zinc-300 backdrop-blur-sm mb-6"
        >
          <Eye className="h-3.5 w-3.5 text-green-500" />
          <span className="text-zinc-400">Exclusive 2026 Frames Now Available</span>
        </motion.div>

        {/* Hero Heading */}
        <motion.h1
          variants={itemVariants}
          className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl max-w-3xl leading-[1.1] mb-6"
        >
          See the World.{" "}
          <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
            Define Your Style.
          </span>
        </motion.h1>

        {/* Hero Description */}
        <motion.p
          variants={itemVariants}
          className="text-base text-zinc-400 sm:text-lg md:text-xl max-w-2xl leading-relaxed mb-10"
        >
          Discover eyewear designed to elevate your vision and express your
          personality. Find the perfect frame for every look, every moment, and
          every you.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center gap-4 mb-16"
        >
          <Link
            href="/shop"
            className="group inline-flex items-center gap-2 rounded-full bg-green-500 px-8 py-4 text-sm font-semibold text-zinc-950 shadow-lg shadow-green-500/20 transition-all duration-200 hover:scale-[1.02] hover:bg-green-400 active:scale-[0.98]"
          >
            Shop Eyewear
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>

          <button
            onClick={handleScrollToCollections}
            className="inline-flex items-center justify-center rounded-full border border-zinc-800 bg-zinc-900/50 px-8 py-4 text-sm font-medium text-zinc-300 backdrop-blur-sm transition-all duration-200 hover:scale-[1.02] hover:border-zinc-700 hover:bg-zinc-900 hover:text-white active:scale-[0.98]"
          >
            Explore More
          </button>
        </motion.div>

        {/* Showcase Image Frame */}
        <motion.div
          variants={itemVariants}
          className="relative w-full max-w-4xl aspect-[16/9] overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/30 shadow-2xl"
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-40 z-10" />
          <Image
            src="/hero-eyewear.jpg"
            alt="Premium Eyewear Collection"
            fill
            sizes="(max-w-1024px) 100vw, 1024px"
            className="object-cover object-center transition-transform duration-700 hover:scale-[1.03]"
            priority
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
