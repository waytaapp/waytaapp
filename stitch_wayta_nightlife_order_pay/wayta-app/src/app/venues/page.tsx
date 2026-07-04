import Link from "next/link";
import { WaytaHeader } from "@/components/wayta-header";
import { WaytaBottomNav } from "@/components/wayta-bottom-nav";
import { getAllVenues, getVenue } from "@/lib/venues";

export default function VenueDiscoveryPage() {
  const venues = getAllVenues();
  const featured = getVenue("black-door")!;

  return (
    <div className="bg-background text-on-background overflow-x-hidden min-h-screen">
      <WaytaHeader variant="menu" />

      <main className="pt-20 pb-32 px-3 min-h-screen">
        {/* Search & filter controls */}
        <div className="flex items-center gap-3 bg-zinc-900/80 backdrop-blur-lg border border-zinc-800 rounded-full px-5 py-3 mb-3">
          <span className="material-symbols-outlined text-primary">search</span>
          <input
            className="bg-transparent border-none outline-none text-on-background placeholder:text-zinc-500 w-full text-sm"
            placeholder="Search clubs, bars, festivals..."
            type="text"
            readOnly
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-4">
          <span className="bg-primary text-fg-on-accent px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap flex items-center gap-2 flex-shrink-0">
            <span className="material-symbols-outlined text-sm">schedule</span>
            Open Now
          </span>
          <span className="bg-zinc-900 border border-zinc-800 text-on-background px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap flex items-center gap-2 flex-shrink-0">
            <span className="material-symbols-outlined text-sm">payments</span>
            No Cover
          </span>
          <span className="bg-zinc-900 border border-zinc-800 text-on-background px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap flex items-center gap-2 flex-shrink-0">
            <span className="material-symbols-outlined text-sm">distance</span>
            &lt; 5km
          </span>
        </div>

        {/* Stylized map panel */}
        <div className="relative rounded-xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-black h-56 mb-4 overflow-hidden">
          <div className="absolute top-[35%] left-[30%]">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(var(--glow-accent-rgb),0.4)] border-2 border-black">
              <span className="material-symbols-outlined text-black text-lg">nightlife</span>
            </div>
          </div>
          <div className="absolute top-[55%] left-[55%]">
            <div className="w-6 h-6 bg-secondary-container rounded-full flex items-center justify-center border-2 border-black">
              <span className="material-symbols-outlined text-black text-sm">music_note</span>
            </div>
          </div>
          <div className="absolute top-[25%] left-[75%]">
            <div className="w-6 h-6 bg-zinc-700 rounded-full flex items-center justify-center border-2 border-black">
              <span className="material-symbols-outlined text-white text-sm">local_bar</span>
            </div>
          </div>
          <p className="absolute bottom-3 left-3 text-xs text-zinc-500 uppercase tracking-[0.2em] font-semibold">
            Johannesburg &amp; Pretoria
          </p>
        </div>

        {/* Featured venue card */}
        <div className="rounded-xl border border-zinc-800 bg-surface-container-low p-5 mb-6">
          <div className="flex gap-4">
            <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-primary">nightlife</span>
            </div>
            <div className="flex-grow">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold text-primary">{featured.name}</h2>
                  <p className="text-zinc-500 text-sm">{featured.area}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-2">
                <span className="flex items-center gap-1 text-secondary text-xs font-bold uppercase tracking-tight">
                  <span className="material-symbols-outlined text-xs">bolt</span>
                  High Energy
                </span>
                <span className="flex items-center gap-1 text-primary text-xs font-bold uppercase tracking-tight">
                  <span className="material-symbols-outlined text-xs">directions_walk</span>
                  1.2 km away
                </span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <Link
              href={`/venues/${featured.slug}`}
              className="bg-primary text-fg-on-accent py-3 rounded-xl font-semibold flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined">confirmation_number</span>
              Buy Tickets
            </Link>
            <button className="bg-zinc-900 text-on-background border border-zinc-700 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-zinc-800 active:scale-95 transition-all">
              <span className="material-symbols-outlined">near_me</span>
              Directions
            </button>
          </div>
        </div>

        {/* Full venue list */}
        <div>
          <p className="text-zinc-500 text-xs font-semibold uppercase tracking-[0.2em] mb-3">
            All Venues
          </p>
          <div className="flex flex-col gap-3">
            {venues.map((venue) => (
              <Link
                key={venue.slug}
                href={`/venues/${venue.slug}`}
                className="flex items-center gap-4 rounded-xl border border-zinc-800 bg-surface-container-low p-4 hover:border-primary/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-primary">local_bar</span>
                </div>
                <div className="flex-grow">
                  <h3 className="font-semibold">{venue.name}</h3>
                  <p className="text-zinc-500 text-sm">{venue.area}</p>
                </div>
                {venue.isLive && (
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                    Live
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </main>

      <WaytaBottomNav active="explore" />
    </div>
  );
}
