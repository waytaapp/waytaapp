import { notFound } from "next/navigation";
import { WaytaHeader } from "@/components/wayta-header";
import { getVenue } from "@/lib/venues";
import { getMenuForVenue } from "@/lib/menu";
import { MenuClient } from "./menu-client";

type DigitalMenuPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function DigitalMenuPage({ params }: DigitalMenuPageProps) {
  const { slug } = await params;
  const venue = getVenue(slug);

  if (!venue) {
    notFound();
  }

  const categories = getMenuForVenue(slug);

  return (
    <>
      <WaytaHeader variant="back" backHref={`/venues/${venue.slug}`} />
      <MenuClient venue={venue} categories={categories} />
    </>
  );
}
