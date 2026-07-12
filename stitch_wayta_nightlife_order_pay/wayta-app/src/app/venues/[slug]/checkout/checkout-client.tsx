"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { WaytaBottomNav } from "@/components/wayta-bottom-nav";
import { Stepper } from "@/components/stepper";
import { HoldToPay } from "@/components/hold-to-pay";
import { useCart } from "@/hooks/use-cart";
import { useLocalStorageValue } from "@/hooks/use-local-storage";
import { formatZar } from "@/lib/menu";
import { createOrder, ORDERS_KEY, type StoredOrder } from "@/lib/orders";
import type { Venue } from "@/lib/venues";

type PaymentMethod = "card" | "eft" | "apple_pay";

const PAYMENT_METHODS: Array<{ id: PaymentMethod; label: string; icon: string }> = [
  { id: "card", label: "Credit or debit card", icon: "credit_card" },
  { id: "eft", label: "Instant EFT", icon: "account_balance" },
  { id: "apple_pay", label: "Apple Pay", icon: "phone_iphone" },
];

type CheckoutClientProps = {
  venue: Venue;
};

export function CheckoutClient({ venue }: CheckoutClientProps) {
  const cart = useCart(venue.slug);
  const existingOrders = useLocalStorageValue<StoredOrder[]>(ORDERS_KEY);
  const router = useRouter();
  const [method, setMethod] = useState<PaymentMethod>("card");
  const [isPlacing, setIsPlacing] = useState(false);

  const handlePaymentComplete = () => {
    if (isPlacing || cart.lines.length === 0) return;
    setIsPlacing(true);
    const order = createOrder(existingOrders ?? [], {
      venueSlug: venue.slug,
      venueName: venue.name,
      lines: cart.lines,
      total: cart.total,
    });
    cart.clear();
    router.push(`/orders/${order.id}`);
  };

  if (cart.hydrated && cart.lines.length === 0 && !isPlacing) {
    return (
      <div className="bg-background text-on-background overflow-x-hidden min-h-screen pb-32">
        <main className="pt-24 px-3 max-w-3xl mx-auto flex flex-col items-center text-center">
          <span className="material-symbols-outlined text-fg-3 text-5xl mb-4">shopping_basket</span>
          <h1 className="text-[20px] font-semibold text-fg-0 mb-2">Your cart is empty</h1>
          <p className="text-fg-2 text-sm mb-6">Add something from the menu before checking out.</p>
          <Link
            href={`/venues/${venue.slug}/menu`}
            className="h-12 px-6 rounded-full bg-primary text-black font-medium flex items-center hover:bg-accent-hover active:scale-95 transition-all"
          >
            Browse menu
          </Link>
        </main>
        <WaytaBottomNav active="menu" />
      </div>
    );
  }

  return (
    <div className="bg-background text-on-background overflow-x-hidden min-h-screen pb-40">
      <main className="pt-20 px-3 max-w-3xl mx-auto">
        <p className="text-fg-2 text-[12px] font-medium mb-1 font-mono">
          CHECKOUT · {venue.name.toUpperCase()}
        </p>
        <h1 className="text-[22px] font-semibold mb-6 text-fg-0">Review your order</h1>

        <section className="rounded-lg border border-border bg-surface-container p-4 mb-6">
          <div className="flex flex-col gap-4">
            {cart.lines.map((line) => (
              <div key={line.id} className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-fg-0 truncate">{line.name}</p>
                  <p className="text-fg-2 text-sm font-mono">{formatZar(line.price)} each</p>
                </div>
                <Stepper
                  quantity={line.quantity}
                  onQuantityChange={(q) => cart.setQuantity(line, q)}
                  onRemove={() => cart.removeItem(line.id)}
                />
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-border bg-surface-container p-4 mb-6">
          <div className="flex justify-between text-fg-1 text-sm mb-2">
            <span>Subtotal</span>
            <span className="font-mono">{formatZar(cart.total)}</span>
          </div>
          <div className="flex justify-between text-fg-0 font-semibold text-base pt-2 border-t border-border">
            <span>Total</span>
            <span className="font-mono">{formatZar(cart.total)}</span>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-[15px] font-semibold text-fg-0 mb-3">Pay with</h2>
          <div className="flex flex-col gap-3">
            {PAYMENT_METHODS.map((option) => {
              const selected = option.id === method;
              return (
                <button
                  key={option.id}
                  onClick={() => setMethod(option.id)}
                  className={`flex items-center gap-3 rounded-lg border p-4 text-left transition-all active:scale-[0.99] ${
                    selected
                      ? "border-primary bg-primary/10"
                      : "border-border bg-surface-container-low hover:border-border-strong"
                  }`}
                >
                  <span className={`material-symbols-outlined ${selected ? "text-primary" : "text-fg-2"}`}>
                    {option.icon}
                  </span>
                  <span className={`flex-1 font-medium ${selected ? "text-fg-0" : "text-fg-1"}`}>
                    {option.label}
                  </span>
                  {selected && (
                    <span className="material-symbols-outlined text-primary">check_circle</span>
                  )}
                </button>
              );
            })}
          </div>
        </section>
      </main>

      <div className="fixed bottom-0 inset-x-0 z-40 bg-background/95 backdrop-blur-lg border-t border-border px-3 pt-4 pb-6">
        <div className="max-w-3xl mx-auto">
          <HoldToPay
            onComplete={handlePaymentComplete}
            amount={formatZar(cart.total)}
            disabled={cart.lines.length === 0}
          />
        </div>
      </div>

      <WaytaBottomNav hidden />
    </div>
  );
}
