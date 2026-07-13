"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { WaytaBottomNav } from "@/components/wayta-bottom-nav";
import { BottomSheet } from "@/components/bottom-sheet";
import type { Venue } from "@/lib/venues";

type SortOption = "name" | "area";

type VenuesClientProps = {
  venues: Venue[];
  featured: Venue;
};

export function VenuesClient({ venues, featured }: VenuesClientProps) {
  const [query, setQuery] = useState("");
  const [liveOnly, setLiveOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("name");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filteredVenues = useMemo(() => {
    const term = query.trim().toLowerCase();
    return venues
      .filter((venue) => !liveOnly || venue.isLive)
      .filter(
        (venue) =>
          term === "" ||
          venue.name.toLowerCase().includes(term) ||
          venue.area.toLowerCase().includes(term)
      )
      .sort((a, b) => (sortBy === "name" ? a.name.localeCompare(b.name) : a.area.localeCompare(b.area)));
  }, [venues, query, liveOnly, sortBy]);

  const activeFilterCount = (liveOnly ? 1 : 0) + (sortBy !== "name" ? 1 : 0);

  return (
    <div className="bg-background text-on-background overflow-x-hidden min-h-screen">
      <main className="pt-20 pb-32 px-3 min-h-screen">
        {/* Search & filter controls */}
        <div
          role="search"
          className="flex items-center gap-3 bg-surface-container/80 backdrop-blur-lg border border-border rounded-full px-5 py-3 mb-3"
        >
          <span className="material-symbols-outlined text-primary" aria-hidden="true">search</span>
          <label htmlFor="venue-search" className="sr-only">
            Search clubs, bars, festivals
          </label>
          <input
            id="venue-search"
            className="bg-transparent border-none outline-none text-fg-1 placeholder:text-fg-2 w-full text-sm"
            placeholder="Search clubs, bars, festivals..."
            type="search"
            inputMode="search"
            autoComplete="off"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-4">
          <button
            onClick={() => setLiveOnly((prev) => !prev)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex items-center gap-2 flex-shrink-0 transition-all active:scale-95 ${
              liveOnly ? "bg-primary text-black" : "bg-surface-container border border-border text-fg-1"
            }`}
          >
            <span className="material-symbols-outlined text-sm">schedule</span>
            Open now
          </button>
          <button
            onClick={() => setFiltersOpen(true)}
            className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex items-center gap-2 flex-shrink-0 bg-surface-container border border-border text-fg-1 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-sm">tune</span>
            Sort &amp; filter
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-primary text-black text-[11px] font-semibold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Stylized map panel */}
        <div className="relative rounded-xl border border-border bg-gradient-to-br from-surface-container to-background h-56 mb-4 overflow-hidden">
          <div className="absolute top-[35%] left-[30%]">
            <div
              className="w-8 h-8 bg-primary rounded-full flex items-center justify-center border-2 border-background"
              style={{ boxShadow: "var(--glow-amber)" }}
            >
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
              <h2 className="text-[17px] font-semibold text-fg-0">{featured.name}</h2>
              <p className="text-fg-2 text-sm">{featured.area}</p>
              {featured.isLive && (
                <span className="inline-flex items-center gap-1 text-go text-[12px] font-medium mt-2">
                  <span className="material-symbols-outlined text-xs">circle</span>
                  Live now
                </span>
              )}
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
            <Link
              href={`/venues/${featured.slug}`}
              className="bg-surface-container-low text-fg-1 border border-border py-3 rounded-full font-semibold flex items-center justify-center gap-2 hover:border-primary active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined">near_me</span>
              View venue
            </Link>
          </div>
        </div>

        {/* Full venue list */}
        <div>
          <p className="text-fg-2 text-[13px] font-medium mb-3">
            {filteredVenues.length} {filteredVenues.length === 1 ? "venue" : "venues"}
          </p>
          <div className="flex flex-col gap-3">
            {filteredVenues.map((venue) => (
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
                {venue.isLive && <span className="text-[11px] font-medium text-primary">Live</span>}
              </Link>
            ))}
            {filteredVenues.length === 0 && (
              <p className="text-fg-2 text-sm text-center py-8">No venues match your search.</p>
            )}
          </div>
        </div>
      </main>

      <BottomSheet isOpen={filtersOpen} onClose={() => setFiltersOpen(false)} title="Sort & filter">
        <div className="flex flex-col gap-6 pb-2">
          <div>
            <h3 className="text-[13px] font-medium text-fg-2 mb-3">Sort by</h3>
            <div className="flex gap-3">
              {(["name", "area"] as SortOption[]).map((option) => (
                <button
                  key={option}
                  onClick={() => setSortBy(option)}
                  className={`flex-1 h-11 rounded-full border font-medium text-sm capitalize transition-all active:scale-95 ${
                    sortBy === option
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-fg-1 hover:border-border-strong"
                  }`}
                >
                  {option === "name" ? "Name" : "Area"}
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-center justify-between rounded-lg border border-border p-4">
            <div>
              <p className="font-medium text-fg-0 text-sm">Live now only</p>
              <p className="text-fg-2 text-xs">Only show venues that are open right now</p>
            </div>
            <input
              type="checkbox"
              checked={liveOnly}
              onChange={(e) => setLiveOnly(e.target.checked)}
              className="w-5 h-5 accent-[var(--wayta-amber-600)]"
            />
          </label>

          <button
            onClick={() => setFiltersOpen(false)}
            className="w-full h-14 rounded-full bg-primary text-black font-semibold hover:bg-accent-hover active:scale-95 transition-all"
          >
            Show {filteredVenues.length} {filteredVenues.length === 1 ? "venue" : "venues"}
          </button>
        </div>
      </BottomSheet>

      <WaytaBottomNav active="explore" />
    </div>
  );
}
