import Link from "next/link";
import { notFound } from "next/navigation";
import DownloadButton from "@/components/DownloadButton";
import { getTutorialBySlug, tutorials } from "@/data/tutorials";

export function generateStaticParams() {
  return tutorials.map((tutorial) => ({ slug: tutorial.id }));
}

export default async function TutorialPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tutorial = getTutorialBySlug(slug);

  if (!tutorial) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl flex-1 px-6 py-12">
      <Link href="/tutorials" className="text-sm font-medium text-blue-400 hover:text-blue-300">
        ← Back to Tutorials
      </Link>

      <h1 className="mt-4 text-3xl font-bold text-white sm:text-4xl">{tutorial.title}</h1>
      <p className="mt-2 text-sm text-white/50">
        SwiftUI · {tutorial.iosVersion} · {tutorial.duration} read
      </p>

      <div className="mt-8 aspect-video w-full overflow-hidden rounded-2xl border border-white/10">
        <iframe
          className="h-full w-full"
          src={`https://www.youtube.com/embed/${tutorial.youtubeId}`}
          title={tutorial.title}
          allowFullScreen
        />
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-white">About this tutorial</h2>
        <p className="mt-3 text-white/70">{tutorial.description}</p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-white">What you&apos;ll learn</h2>
        <ul className="mt-3 space-y-2">
          {tutorial.whatYoullLearn.map((item) => (
            <li key={item} className="flex items-start gap-2 text-white/70">
              <span className="text-blue-400">✓</span>
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-white">Requirements</h2>
        <ul className="mt-3 space-y-1 text-white/70">
          <li>· {tutorial.xcodeVersion}</li>
          <li>· {tutorial.iosVersion}</li>
          <li>· Swift 5.9+</li>
        </ul>
      </section>

      <div className="mt-10">
        <DownloadButton url={tutorial.downloadUrl} />
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-white">File Structure</h2>
        <pre className="mt-3 overflow-x-auto rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
          {tutorial.fileStructure}
        </pre>
      </section>
    </main>
  );
}
