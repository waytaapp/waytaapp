import Link from "next/link";
import { notFound } from "next/navigation";
import { WaytaHeader } from "@/components/wayta-header";
import { WaytaBottomNav } from "@/components/wayta-bottom-nav";
import { getVenue } from "@/lib/venues";

type VenueDetailsPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function VenueDetailsPage({ params }: VenueDetailsPageProps) {
  const { slug } = await params;
  const venue = getVenue(slug);

  if (!venue) {
    notFound();
  }

  return (
    <div className="bg-background text-on-background overflow-x-hidden min-h-screen">
      <WaytaHeader variant="back" backHref="/venues" />

      <main className="pt-16 pb-32">
        {/* Hero */}
        <section className="relative h-64 w-full bg-gradient-to-br from-zinc-900 via-black to-zinc-950 flex flex-col justify-end p-5">
          {venue.isLive && (
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-bold text-primary uppercase tracking-widest">
                Live Now
              </span>
            </div>
          )}
          <h1 className="text-4xl font-black italic tracking-tight">{venue.name}</h1>
          <p className="text-zinc-400 flex items-center gap-1 mt-1">
            <span className="material-symbols-outlined text-sm">location_on</span>
            {venue.area}
          </p>
          <p className="text-zinc-500 text-sm mt-2">{venue.heroTagline}</p>
        </section>

        {/* Quick actions */}
        <section className="px-3 -mt-6 relative z-10 grid grid-cols-2 gap-3">
          <Link
            href={`/venues/${venue.slug}/menu`}
            className="col-span-2 bg-primary text-fg-on-accent h-14 rounded-xl flex items-center justify-center gap-2 font-semibold shadow-lg active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined">local_bar</span>
            Get A Drink
          </Link>
          <button className="bg-zinc-900 border border-secondary text-secondary h-14 rounded-xl flex flex-col items-center justify-center gap-1 font-semibold active:scale-95 transition-transform">
            <span className="material-symbols-outlined">payments</span>
            <span className="text-xs">Pay for Entrance</span>
          </button>
          <button className="bg-zinc-900 border border-zinc-800 text-on-background h-14 rounded-xl flex flex-col items-center justify-center gap-1 font-semibold active:scale-95 transition-transform">
            <span className="material-symbols-outlined text-primary">map</span>
            <span className="text-xs">View Map</span>
          </button>
        </section>

        {/* Venue info */}
        <section className="mt-8 px-3 space-y-6">
          <div className="bg-surface-container-low rounded-2xl p-5 border border-zinc-800">
            <h2 className="text-xl font-semibold mb-4">Venue Info</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-primary">person</span>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">
                    Contact Name
                  </p>
                  <p className="text-on-background">{venue.contactName}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-primary">call</span>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Phone</p>
                  <p className="text-on-background">{venue.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-primary">pin_drop</span>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">
                    Address
                  </p>
                  <p className="text-on-background">{venue.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Related orders empty state */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Related Orders</h2>
            <div className="bg-zinc-950 border-2 border-dashed border-zinc-800 rounded-3xl p-10 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-surface-container mb-4 flex items-center justify-center">
                <span className="material-symbols-outlined text-zinc-600 text-4xl">
                  receipt_long
                </span>
              </div>
              <p className="text-lg font-semibold text-zinc-400 mb-1">No items</p>
              <p className="text-zinc-600 text-sm max-w-[220px] mb-4">
                You haven&apos;t made any purchases at {venue.name} yet.
              </p>
              <Link
                href={`/venues/${venue.slug}/menu`}
                className="text-primary font-semibold flex items-center gap-1"
              >
                Browse Menu
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <WaytaBottomNav active="explore" />
    </div>
  );
}
