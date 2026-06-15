export default function DownloadButton({ url }: { url: string }) {
  return (
    <div className="rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-6 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <h3 className="text-lg font-semibold text-white">📦 Download Source Code</h3>
          <p className="mt-1 text-sm text-white/60">
            Full Xcode project ready to open and run.
          </p>
        </div>
        <a
          href={url}
          className="shrink-0 rounded-full bg-blue-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-400"
        >
          Download ZIP
        </a>
      </div>
    </div>
  );
}
