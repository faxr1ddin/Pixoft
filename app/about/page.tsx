export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl flex-1 px-6 py-16">
      <h1 className="text-3xl font-bold text-white">About Pixoft</h1>
      <p className="mt-4 text-white/70">
        Pixoft is a SwiftUI tutorial channel focused on building beautiful,
        modern iOS interfaces. Every video comes with a full Xcode project so
        you can follow along, learn, and ship faster.
      </p>
      <p className="mt-4 text-white/70">
        New tutorials cover animations, UI components, and full app builds —
        all designed with clean, Apple-inspired aesthetics.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <a
          href="https://www.youtube.com/@pixoft_channel"
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-blue-500 px-6 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-blue-400"
        >
          Subscribe on YouTube
        </a>
        <a
          href="mailto:hello@textilepro.app"
          className="rounded-full border border-white/15 px-6 py-3 text-center text-sm font-semibold text-white transition-colors hover:border-blue-500 hover:text-blue-400"
        >
          hello@textilepro.app
        </a>
      </div>
    </main>
  );
}
