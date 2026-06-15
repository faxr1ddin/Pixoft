import Link from "next/link";
import Image from "next/image";
import type { Tutorial } from "@/data/tutorials";

const PLACEHOLDER_THUMBNAILS = new Set(["/thumbnails/onboarding.png"]);

export default function TutorialCard({ tutorial }: { tutorial: Tutorial }) {
  const hasRealThumbnail = !PLACEHOLDER_THUMBNAILS.has(tutorial.thumbnail);

  return (
    <Link
      href={`/tutorials/${tutorial.id}`}
      className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10"
    >
      <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden bg-gradient-to-br from-blue-500/25 via-purple-500/15 to-transparent">
        {hasRealThumbnail ? (
          <Image
            src={tutorial.thumbnail}
            alt={tutorial.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <svg
            className="h-12 w-12 text-white/30 transition-transform duration-300 group-hover:scale-110"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
        <span className="absolute right-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
          {tutorial.iosVersion}
        </span>
      </div>

      <div className="flex flex-col gap-3 p-5">
        <h3 className="text-lg font-semibold text-white">{tutorial.title}</h3>
        <p className="line-clamp-2 text-sm text-white/60">{tutorial.description}</p>

        <div className="mt-1 flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {tutorial.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-white/70">
                {tag}
              </span>
            ))}
          </div>
          <span className="text-sm font-medium text-blue-400 transition-colors group-hover:text-blue-300">
            View Tutorial →
          </span>
        </div>
      </div>
    </Link>
  );
}
