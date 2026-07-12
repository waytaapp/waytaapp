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
        <p className="text-fg-2 text-[12px] font-medium mb-1">
          {venue.name} menu
        </p>
        <h1 className="text-[22px] font-semibold mb-6 text-fg-0">Order drinks</h1>

        {categories.map((category) => (
          <section key={category.name} className="mb-8">
            <h2 className="text-[17px] font-semibold border-l-4 border-primary pl-3 mb-4 text-fg-0">
              {category.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {category.items.map((item) => (
                <div
                  key={item.name}
                  className="rounded-lg border border-border bg-surface-container/70 backdrop-blur-md p-4 flex flex-col"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-fg-0">{item.name}</h3>
                    <span className="text-primary font-semibold font-mono whitespace-nowrap ml-2 text-sm">
                      {formatZar(item.price)}
                    </span>
                  </div>
                  <p className="text-fg-2 text-sm mb-4 flex-grow">{item.description}</p>
                  <button className="bg-primary text-black h-10 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-accent-hover active:scale-95 transition-all">
                    <span className="material-symbols-outlined text-lg">add</span>
                    Add to cart
                  </button>
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>

      {/* Cart FAB (will be replaced with real cart state in Phase 2) */}
      <div className="fixed bottom-24 right-5 z-40">
        <button className="bg-primary text-black h-14 px-5 rounded-full flex items-center gap-3 hover:bg-accent-hover active:scale-95 transition-all font-medium">
          <span className="material-symbols-outlined">shopping_basket</span>
          <span className="text-sm font-semibold font-mono">R0.00</span>
        </button>
      </div>

      <WaytaBottomNav active="menu" />
    </div>
  );
}
