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
        <section className="relative h-64 w-full bg-gradient-to-br from-surface-container via-background to-background flex flex-col justify-end p-5">
          {venue.isLive && (
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-[12px] font-medium text-primary">
                Live now
              </span>
            </div>
          )}
          <h1 className="text-4xl font-bold italic tracking-tight text-fg-0">{venue.name}</h1>
          <p className="text-fg-2 flex items-center gap-1 mt-1">
            <span className="material-symbols-outlined text-sm">location_on</span>
            {venue.area}
          </p>
          <p className="text-fg-2 text-sm mt-2">{venue.heroTagline}</p>
        </section>

        {/* Quick actions */}
        <section className="px-3 -mt-6 relative z-10 grid grid-cols-2 gap-3">
          <Link
            href={`/venues/${venue.slug}/menu`}
            className="col-span-2 bg-primary text-black h-14 rounded-full flex items-center justify-center gap-2 font-semibold hover:bg-accent-hover active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined">local_bar</span>
            Get a drink
          </Link>
          <button className="bg-surface-container border border-stop text-stop h-14 rounded-full flex flex-col items-center justify-center gap-1 font-semibold hover:bg-surface-container-low active:scale-95 transition-all">
            <span className="material-symbols-outlined">payments</span>
            <span className="text-xs">Pay entry</span>
          </button>
          <button className="bg-surface-container border border-border text-fg-1 h-14 rounded-full flex flex-col items-center justify-center gap-1 font-semibold hover:border-primary active:scale-95 transition-all">
            <span className="material-symbols-outlined text-primary">map</span>
            <span className="text-xs">View map</span>
          </button>
        </section>

        {/* Venue info */}
        <section className="mt-8 px-3 space-y-6">
          <div className="bg-surface-container rounded-lg p-5 border border-border">
            <h2 className="text-[17px] font-semibold mb-4 text-fg-0">Venue info</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-primary">person</span>
                </div>
                <div>
                  <p className="text-[12px] text-fg-2 font-medium">
                    Contact name
                  </p>
                  <p className="text-fg-0">{venue.contactName}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-primary">call</span>
                </div>
                <div>
                  <p className="text-[12px] text-fg-2 font-medium">Phone</p>
                  <p className="text-fg-0">{venue.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-primary">pin_drop</span>
                </div>
                <div>
                  <p className="text-[12px] text-fg-2 font-medium">
                    Address
                  </p>
                  <p className="text-fg-0">{venue.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Related orders empty state */}
          <div>
            <h2 className="text-[17px] font-semibold mb-4 text-fg-0">Related orders</h2>
            <div className="bg-surface-container-low border-2 border-dashed border-border rounded-lg p-10 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-lg bg-surface-container mb-4 flex items-center justify-center">
                <span className="material-symbols-outlined text-fg-2 text-4xl">
                  receipt_long
                </span>
              </div>
              <p className="text-[17px] font-semibold text-fg-1 mb-1">No items</p>
              <p className="text-fg-2 text-sm max-w-[220px] mb-4">
                You haven&apos;t made any purchases at {venue.name} yet.
              </p>
              <Link
                href={`/venues/${venue.slug}/menu`}
                className="text-primary font-semibold flex items-center gap-1 hover:text-accent-hover transition-colors"
              >
                Browse menu
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
