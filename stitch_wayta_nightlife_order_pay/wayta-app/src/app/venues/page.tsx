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
        <div className="flex items-center gap-3 bg-surface-container/80 backdrop-blur-lg border border-border rounded-full px-5 py-3 mb-3">
          <span className="material-symbols-outlined text-primary">search</span>
          <input
            className="bg-transparent border-none outline-none text-fg-1 placeholder:text-fg-2 w-full text-sm"
            placeholder="Search clubs, bars, festivals..."
            type="text"
            readOnly
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-4">
          <span className="bg-primary text-black px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex items-center gap-2 flex-shrink-0">
            <span className="material-symbols-outlined text-sm">schedule</span>
            Open now
          </span>
          <span className="bg-surface-container border border-border text-fg-1 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex items-center gap-2 flex-shrink-0">
            <span className="material-symbols-outlined text-sm">payments</span>
            No cover
          </span>
          <span className="bg-surface-container border border-border text-fg-1 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex items-center gap-2 flex-shrink-0">
            <span className="material-symbols-outlined text-sm">distance</span>
            &lt; 5km
          </span>
        </div>

        {/* Stylized map panel */}
        <div className="relative rounded-xl border border-border bg-gradient-to-br from-surface-container to-background h-56 mb-4 overflow-hidden">
          <div className="absolute top-[35%] left-[30%]">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center border-2 border-background" style={{ boxShadow: "var(--glow-amber)" }}>
              <span className="material-symbols-outlined text-black text-lg">nightlife</span>
            </div>
          </div>
          <div className="absolute top-[55%] left-[55%]">
            <div className="w-6 h-6 bg-go rounded-full flex items-center justify-center border-2 border-background">
              <span className="material-symbols-outlined text-black text-sm">music_note</span>
            </div>
          </div>
          <div className="absolute top-[25%] left-[75%]">
            <div className="w-6 h-6 bg-fg-2 rounded-full flex items-center justify-center border-2 border-background">
              <span className="material-symbols-outlined text-fg-0 text-sm">local_bar</span>
            </div>
          </div>
          <p className="absolute bottom-3 left-3 text-[12px] text-fg-2 font-medium">
            Johannesburg &amp; Pretoria
          </p>
        </div>

        {/* Featured venue card */}
        <div className="rounded-xl border border-border bg-surface-container p-5 mb-6">
          <div className="flex gap-4">
            <div className="w-16 h-16 rounded-lg bg-surface-container-low border border-border flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-primary">nightlife</span>
            </div>
            <div className="flex-grow">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-[17px] font-semibold text-fg-0">{featured.name}</h2>
                  <p className="text-fg-2 text-sm">{featured.area}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-2">
                <span className="flex items-center gap-1 text-stop text-[12px] font-medium">
                  <span className="material-symbols-outlined text-xs">bolt</span>
                  High energy
                </span>
                <span className="flex items-center gap-1 text-primary text-[12px] font-medium">
                  <span className="material-symbols-outlined text-xs">directions_walk</span>
                  1.2 km away
                </span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <Link
              href={`/venues/${featured.slug}`}
              className="bg-primary text-black py-3 rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-accent-hover active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined">confirmation_number</span>
              Buy tickets
            </Link>
            <button className="bg-surface-container-low text-fg-1 border border-border py-3 rounded-full font-semibold flex items-center justify-center gap-2 hover:border-primary active:scale-95 transition-all">
              <span className="material-symbols-outlined">near_me</span>
              Directions
            </button>
          </div>
        </div>

        {/* Full venue list */}
        <div>
          <p className="text-fg-2 text-[13px] font-medium mb-3">
            All venues
          </p>
          <div className="flex flex-col gap-3">
            {venues.map((venue) => (
              <Link
                key={venue.slug}
                href={`/venues/${venue.slug}`}
                className="flex items-center gap-4 rounded-lg border border-border bg-surface-container p-4 hover:border-primary transition-colors active:scale-95"
              >
                <div className="w-12 h-12 rounded-lg bg-surface-container-low border border-border flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-primary">local_bar</span>
                </div>
                <div className="flex-grow">
                  <h3 className="font-medium text-fg-0">{venue.name}</h3>
                  <p className="text-fg-2 text-sm">{venue.area}</p>
                </div>
                {venue.isLive && (
                  <span className="text-[11px] font-medium text-primary">
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
