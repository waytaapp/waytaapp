import { notFound } from "next/navigation";
import { WaytaHeader } from "@/components/wayta-header";
import { getVenue } from "@/lib/venues";
import { CheckoutClient } from "./checkout-client";

type CheckoutPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { slug } = await params;
  const venue = getVenue(slug);

  if (!venue) {
    notFound();
  }

  return (
    <>
      <WaytaHeader variant="back" backHref={`/venues/${venue.slug}/menu`} />
      <CheckoutClient venue={venue} />
    </>
  );
}
