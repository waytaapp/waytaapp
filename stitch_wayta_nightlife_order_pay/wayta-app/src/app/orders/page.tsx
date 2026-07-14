"use client";

import Link from "next/link";
import { WaytaHeader } from "@/components/wayta-header";
import { WaytaBottomNav } from "@/components/wayta-bottom-nav";
import { StatusBadge } from "@/components/status-badge";
import { useLocalStorageValue } from "@/hooks/use-local-storage";
import { formatZar } from "@/lib/menu";
import { ORDERS_KEY, sortByNewest, type StoredOrder } from "@/lib/orders";

export default function OrdersListPage() {
  const stored = useLocalStorageValue<StoredOrder[]>(ORDERS_KEY);
  const orders = stored === undefined ? undefined : sortByNewest(stored ?? []);

  return (
    <div className="bg-background text-on-background overflow-x-hidden min-h-screen">
      <WaytaHeader />

      <main className="pt-24 pb-32 px-3 max-w-3xl mx-auto">
        <h1 className="text-[22px] font-semibold mb-6 text-fg-0">Your orders</h1>

        {orders === undefined && (
          <div className="flex flex-col gap-3">
            <div className="rounded-lg border border-border bg-surface-container h-20 animate-pulse" />
            <div className="rounded-lg border border-border bg-surface-container h-20 animate-pulse" />
          </div>
        )}

        {orders !== undefined && orders.length === 0 && (
          <div className="flex flex-col items-center text-center pt-12">
            <span className="material-symbols-outlined text-fg-3 text-5xl mb-4">receipt_long</span>
            <h2 className="text-[18px] font-semibold text-fg-0 mb-2">No orders yet</h2>
            <p className="text-fg-2 text-sm mb-6">Orders you place will show up here.</p>
            <Link
              href="/venues"
              className="h-12 px-6 rounded-full bg-primary text-black font-medium flex items-center hover:bg-accent-hover active:scale-95 transition-all"
            >
              Find a venue
            </Link>
          </div>
        )}

        {orders !== undefined && orders.length > 0 && (
          <div className="flex flex-col gap-3">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="rounded-lg border border-border bg-surface-container p-4 flex items-center justify-between hover:border-border-strong transition-colors active:scale-[0.99]"
              >
                <div>
                  <p className="font-mono font-semibold text-fg-0">{order.id}</p>
                  <p className="text-fg-2 text-sm">{order.venueName}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-fg-1 text-sm">{formatZar(order.total)}</span>
                  <StatusBadge status={order.status} showIcon={false} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <WaytaBottomNav active="orders" />
    </div>
  );
}
