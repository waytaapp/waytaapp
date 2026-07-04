import { notFound } from "next/navigation";
import { WaytaHeader } from "@/components/wayta-header";
import { WaytaBottomNav } from "@/components/wayta-bottom-nav";
import { getVenue } from "@/lib/venues";
import { getMenuForVenue, formatZar } from "@/lib/menu";

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
    <div className="bg-background text-on-background overflow-x-hidden min-h-screen pb-32">
      <WaytaHeader variant="back" backHref={`/venues/${venue.slug}`} />

      <main className="pt-20 px-3 max-w-3xl mx-auto">
        <p className="text-zinc-500 text-xs font-semibold uppercase tracking-[0.2em] mb-1">
          {venue.name} Menu
        </p>
        <h1 className="text-2xl font-semibold mb-6">Order Drinks</h1>

        {categories.map((category) => (
          <section key={category.name} className="mb-8">
            <h2 className="text-lg font-semibold border-l-4 border-primary pl-3 mb-4">
              {category.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {category.items.map((item) => (
                <div
                  key={item.name}
                  className="rounded-xl border border-zinc-800 bg-zinc-900/70 backdrop-blur-md p-4 flex flex-col"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{item.name}</h3>
                    <span className="text-primary font-bold whitespace-nowrap ml-2">
                      {formatZar(item.price)}
                    </span>
                  </div>
                  <p className="text-zinc-400 text-sm mb-4 flex-grow">{item.description}</p>
                  <button className="bg-primary text-fg-on-accent h-10 rounded-lg font-semibold flex items-center justify-center gap-2 active:scale-95 transition-transform">
                    <span className="material-symbols-outlined text-lg">add_shopping_cart</span>
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>

      {/* Cart FAB (static — no cart state yet, matches other mock-data screens) */}
      <div className="fixed bottom-24 right-5 z-40">
        <button className="bg-secondary-container text-white h-14 px-5 rounded-full flex items-center gap-3 shadow-2xl active:scale-95 transition-transform">
          <span className="material-symbols-outlined">shopping_basket</span>
          <span className="text-sm font-bold">R0.00</span>
        </button>
      </div>

      <WaytaBottomNav active="menu" />
    </div>
  );
}
