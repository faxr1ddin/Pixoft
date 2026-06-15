export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/40">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-10 text-sm text-white/60 sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} Pixoft. All rights reserved.</p>

        <div className="flex items-center gap-6">
          <a href="https://youtube.com" target="_blank" rel="noreferrer" className="transition-colors hover:text-white">
            YouTube
          </a>
          <a href="https://github.com/pixoft" target="_blank" rel="noreferrer" className="transition-colors hover:text-white">
            GitHub
          </a>
          <a href="https://patreon.com" target="_blank" rel="noreferrer" className="transition-colors hover:text-white">
            Patreon
          </a>
        </div>
      </div>
    </footer>
  );
}
