"use client";

import { createSnackbar } from "@/components/snackbar";

export function VenueComingSoonActions() {
  const notify = (feature: string) =>
    createSnackbar.show(`${feature} is coming soon.`, { type: "neutral", duration: 2500 });

  return (
    <>
      <button
        onClick={() => notify("Entry payment")}
        className="bg-surface-container border border-stop text-stop h-14 rounded-full flex flex-col items-center justify-center gap-1 font-semibold hover:bg-surface-container-low active:scale-95 transition-all"
      >
        <span className="material-symbols-outlined">payments</span>
        <span className="text-xs">Pay entry</span>
      </button>
      <button
        onClick={() => notify("Venue map")}
        className="bg-surface-container border border-border text-fg-1 h-14 rounded-full flex flex-col items-center justify-center gap-1 font-semibold hover:border-primary active:scale-95 transition-all"
      >
        <span className="material-symbols-outlined text-primary">map</span>
        <span className="text-xs">View map</span>
      </button>
    </>
  );
}
