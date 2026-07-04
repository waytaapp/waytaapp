import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen px-5 py-10 flex items-center justify-center">
      <div className="w-full max-w-md rounded-2xl border border-outline-variant/40 bg-surface-container-low p-6">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-on-background/60">
          Wayta prototype → app
        </p>
        <h1 className="mt-2 font-display text-3xl font-black tracking-tight italic text-primary">
          Wayta
        </h1>
        <p className="mt-3 text-on-background/70">
          First route wired up: order tracking screen.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <Link
            href="/orders/WT-8842"
            className="h-12 rounded-full bg-primary text-fg-on-accent font-semibold flex items-center justify-center hover:bg-primary/90 transition-colors"
          >
            Open sample order
          </Link>
          <a
            href="https://nextjs.org/docs"
            target="_blank"
            rel="noreferrer"
            className="h-12 rounded-full border border-outline-variant font-semibold flex items-center justify-center hover:bg-surface-variant/50 transition-colors"
          >
            Next.js docs
          </a>
        </div>
      </div>
    </main>
  );
}
