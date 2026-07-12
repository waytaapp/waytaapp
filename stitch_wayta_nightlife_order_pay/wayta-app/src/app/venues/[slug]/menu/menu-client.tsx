"use client";

import Link from "next/link";
import { WaytaBottomNav } from "@/components/wayta-bottom-nav";
import { Stepper } from "@/components/stepper";
import { useCart } from "@/hooks/use-cart";
import type { MenuCategory } from "@/lib/menu";
import { formatZar } from "@/lib/menu";
import type { Venue } from "@/lib/venues";

type MenuClientProps = {
  venue: Venue;
  categories: MenuCategory[];
};

export function MenuClient({ venue, categories }: MenuClientProps) {
  const cart = useCart(venue.slug);

  const quantityFor = (itemId: string) => cart.lines.find((line) => line.id === itemId)?.quantity ?? 0;

  return (
    <div className="bg-background text-on-background overflow-x-hidden min-h-screen pb-40">
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
              {category.items.map((item) => {
                const quantity = quantityFor(item.id);
                return (
                  <div
                    key={item.id}
                    className="rounded-lg border border-border bg-surface-container/70 backdrop-blur-md p-4 flex flex-col"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-fg-0">{item.name}</h3>
                      <span className="text-primary font-semibold font-mono whitespace-nowrap ml-2 text-sm">
                        {formatZar(item.price)}
                      </span>
                    </div>
                    <p className="text-fg-2 text-sm mb-4 flex-grow">{item.description}</p>
                    {quantity > 0 ? (
                      <div className="flex justify-center">
                        <Stepper
                          quantity={quantity}
                          onQuantityChange={(q) => cart.setQuantity(item, q)}
                          onRemove={() => cart.removeItem(item.id)}
                        />
                      </div>
                    ) : (
                      <button
                        onClick={() => cart.setQuantity(item, 1)}
                        className="bg-primary text-black h-10 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-accent-hover active:scale-95 transition-all"
                      >
                        <span className="material-symbols-outlined text-lg">add</span>
                        Add to cart
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </main>

      {cart.hydrated && cart.count > 0 && (
        <div className="fixed bottom-24 inset-x-3 z-40">
          <Link
            href={`/venues/${venue.slug}/checkout`}
            className="w-full h-14 px-5 rounded-full bg-primary text-black flex items-center justify-between hover:bg-accent-hover active:scale-95 transition-all font-medium"
            style={{ boxShadow: "var(--glow-amber)" }}
          >
            <span className="flex items-center gap-2 text-sm font-semibold">
              <span className="material-symbols-outlined">shopping_basket</span>
              View cart · {cart.count} {cart.count === 1 ? "item" : "items"}
            </span>
            <span className="flex items-center gap-1 font-mono font-semibold text-sm">
              {formatZar(cart.total)}
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </span>
          </Link>
        </div>
      )}

      <WaytaBottomNav active="menu" />
    </div>
  );
}
