import { WaytaHeader } from "@/components/wayta-header";
import { getAllVenues, getVenue } from "@/lib/venues";
import { VenuesClient } from "./venues-client";

export default function VenueDiscoveryPage() {
  const venues = getAllVenues();
  const featured = getVenue("black-door")!;

  return (
    <>
      <WaytaHeader variant="menu" />
      <VenuesClient venues={venues} featured={featured} />
    </>
  );
}
