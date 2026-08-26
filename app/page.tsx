import Hero from "@/components/hero";
import { Glasses, Sparkles, TrendingUp } from "lucide-react";

export default function Home() {
  return (
    <main className="bg-zinc-950 min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Collections Section */}
      <section
        id="collections"
        className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 border-t border-zinc-900 scroll-mt-16"
      >
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/50 px-3 py-1 text-xs text-green-500 mb-4">
            <Sparkles className="h-3 w-3" />
            <span>Curated Collections</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
            Explore Our Signature Styles
          </h2>
          <p className="text-zinc-400">
            Handcrafted designer frames designed to combine optimal visual clarity with modern elegance.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Card 1 */}
          <div className="group relative overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-900/25 p-8 transition-all duration-300 hover:border-zinc-800 hover:bg-zinc-900/40">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-green-500 transition-colors group-hover:bg-green-500 group-hover:text-zinc-950">
              <Glasses className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Classic Optical</h3>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
              Timeless frames engineered for daily comfort and visual precision. Elegant profiles for the modern professional.
            </p>
            <span className="text-xs font-semibold uppercase tracking-wider text-green-500 group-hover:underline">
              View Frames &rarr;
            </span>
          </div>

          {/* Card 2 */}
          <div className="group relative overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-900/25 p-8 transition-all duration-300 hover:border-zinc-800 hover:bg-zinc-900/40">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-green-500 transition-colors group-hover:bg-green-500 group-hover:text-zinc-950">
              <TrendingUp className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Sun & Protection</h3>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
              Advanced polarized lenses with full UV blocking. Crafted for open-air adventures and bright city days.
            </p>
            <span className="text-xs font-semibold uppercase tracking-wider text-green-500 group-hover:underline">
              View Sunwear &rarr;
            </span>
          </div>

          {/* Card 3 */}
          <div className="group relative overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-900/25 p-8 transition-all duration-300 hover:border-zinc-800 hover:bg-zinc-900/40">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-green-500 transition-colors group-hover:bg-green-500 group-hover:text-zinc-950">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Modern Minimalist</h3>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
              Ultra-lightweight titanium and rimless frames. Subtle designs that maximize view and emphasize your features.
            </p>
            <span className="text-xs font-semibold uppercase tracking-wider text-green-500 group-hover:underline">
              View Minimalist &rarr;
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}