import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold tracking-tight text-white">
          Pix<span className="text-blue-500">oft</span>
        </Link>

        <nav className="flex items-center gap-6 text-sm font-medium text-white/70">
          <Link href="/tutorials" className="transition-colors hover:text-white">
            Tutorials
          </Link>
          <Link href="/about" className="transition-colors hover:text-white">
            About
          </Link>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-white/15 px-4 py-1.5 text-white transition-colors hover:border-blue-500 hover:text-blue-400"
          >
            YouTube
          </a>
        </nav>
      </div>
    </header>
  );
}
