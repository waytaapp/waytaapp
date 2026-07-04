export type VenueSlug = "black-door" | "sumo" | "taboo" | "montana";

export interface Venue {
  slug: VenueSlug;
  name: string;
  area: string;
  address: string;
  contactName: string;
  phone: string;
  isLive: boolean;
  heroTagline: string;
}

export const VENUES: Record<VenueSlug, Venue> = {
  "black-door": {
    slug: "black-door",
    name: "Black Door",
    area: "Sandton, Johannesburg",
    address: "123 Maude Street, Sandton, Johannesburg, 2196",
    contactName: "Jameson Blake",
    phone: "+27 11 555 0123",
    isLive: true,
    heroTagline: "Sleek nightclub, signature cocktails.",
  },
  sumo: {
    slug: "sumo",
    name: "Sumo",
    area: "Rosebank, Johannesburg",
    address: "44 Baker Street, Rosebank, Johannesburg, 2196",
    contactName: "Naledi Khumalo",
    phone: "+27 11 555 0456",
    isLive: true,
    heroTagline: "High-energy rooftop bar.",
  },
  taboo: {
    slug: "taboo",
    name: "Taboo",
    area: "Sandton, Johannesburg",
    address: "12 Rivonia Road, Sandton, Johannesburg, 2196",
    contactName: "Michael Peters",
    phone: "+27 11 555 0789",
    isLive: false,
    heroTagline: "Late-night lounge and dancefloor.",
  },
  montana: {
    slug: "montana",
    name: "Montana",
    area: "Hatfield, Pretoria",
    address: "8 Burnett Street, Hatfield, Pretoria, 0028",
    contactName: "Zanele Dube",
    phone: "+27 12 555 0234",
    isLive: true,
    heroTagline: "Student-favourite party spot.",
  },
};

export function getVenue(slug: string): Venue | undefined {
  return VENUES[slug as VenueSlug];
}

export function getAllVenues(): Venue[] {
  return Object.values(VENUES);
}
