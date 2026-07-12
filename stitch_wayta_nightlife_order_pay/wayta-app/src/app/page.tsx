import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen px-5 py-10 flex items-center justify-center bg-background">
      <div className="w-full max-w-md rounded-xl border border-border bg-surface-container p-6">
        <p className="text-[13px] font-medium text-fg-2">Wayta prototype → app</p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight italic text-primary">
          Wayta
        </h1>
        <p className="mt-3 text-fg-1">
          Core patron journey: discover venues, browse menu, track orders, manage budget.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <Link
            href="/venues"
            className="h-12 rounded-full bg-primary text-black font-semibold flex items-center justify-center hover:bg-accent-hover active:scale-95 transition-all"
          >
            Discover venues
          </Link>
          <Link
            href="/venues/black-door/menu"
            className="h-12 rounded-full border border-border font-semibold flex items-center justify-center hover:bg-surface-container-low active:scale-95 transition-all text-fg-1"
          >
            Browse Black Door menu
          </Link>
          <Link
            href="/orders/WT-8842"
            className="h-12 rounded-full border border-border font-semibold flex items-center justify-center hover:bg-surface-container-low active:scale-95 transition-all text-fg-1"
          >
            Open sample order
          </Link>
          <Link
            href="/budget"
            className="h-12 rounded-full border border-border font-semibold flex items-center justify-center hover:bg-surface-container-low active:scale-95 transition-all text-fg-1"
          >
            View budget dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
