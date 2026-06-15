import Link from "next/link";
import TutorialCard from "@/components/TutorialCard";
import { tutorials } from "@/data/tutorials";

export default function Home() {
  const featured = tutorials.slice(0, 6);

  return (
    <main className="flex-1">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_-20%,rgba(59,130,246,0.25),transparent_60%)]" />
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-28 text-center">
          <span className="rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-medium text-white/70">
            SwiftUI · iOS 17+
          </span>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Beautiful SwiftUI Tutorials
          </h1>
          <p className="max-w-xl text-lg text-white/60">
            Watch the video, grab the source code, and build stunning iOS apps
            with clean, modern SwiftUI.
          </p>
          <Link
            href="/tutorials"
            className="rounded-full bg-blue-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-400"
          >
            Browse Tutorials
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Featured Tutorials</h2>
          <Link href="/tutorials" className="text-sm font-medium text-blue-400 hover:text-blue-300">
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((tutorial) => (
            <TutorialCard key={tutorial.id} tutorial={tutorial} />
          ))}
        </div>
      </section>
    </main>
  );
}
