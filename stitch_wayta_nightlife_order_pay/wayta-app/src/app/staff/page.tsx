"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BottomSheet } from "@/components/bottom-sheet";
import { StatusBadge, WaitingTimeBadge } from "@/components/status-badge";
import { createSnackbar } from "@/components/snackbar";
import { useLocalStorageValue } from "@/hooks/use-local-storage";
import { formatZar } from "@/lib/menu";
import { nextStatus, ORDERS_KEY, sortByNewest, updateOrderStatus, type StoredOrder } from "@/lib/orders";

const ADVANCE_LABEL: Record<string, string> = {
  preparing: "Start preparing",
  ready: "Mark ready",
  collected: "Mark collected",
};

function useElapsedMinutes(createdAt: number): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(interval);
  }, []);
  return Math.floor((now - createdAt) / 60000);
}

function StaffOrderCard({
  order,
  onAdvance,
  onViewDetails,
}: {
  order: StoredOrder;
  onAdvance: (order: StoredOrder) => void;
  onViewDetails: (order: StoredOrder) => void;
}) {
  const elapsed = useElapsedMinutes(order.createdAt);
  const upcoming = nextStatus(order.status);
  const itemSummary = order.lines.map((line) => `${line.quantity}x ${line.name}`).join(", ");

  return (
    <div className="rounded-lg border border-border bg-surface-container p-4">
      <div className="flex items-start justify-between mb-3 gap-3">
        <div>
          <p className="font-mono font-semibold text-fg-0">{order.id}</p>
          <p className="text-fg-2 text-sm">{order.venueName}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <p className="text-fg-1 text-sm mb-3">{itemSummary}</p>

      <div className="flex items-center justify-between mb-4">
        <WaitingTimeBadge minutes={elapsed} />
        <span className="font-mono text-fg-2 text-sm">{formatZar(order.total)}</span>
      </div>

      <div className="flex gap-3">
        {upcoming && (
          <button
            onClick={() => onAdvance(order)}
            className="flex-1 h-[52px] rounded-full bg-primary text-black font-semibold hover:bg-accent-hover active:scale-95 transition-all"
          >
            {ADVANCE_LABEL[upcoming]}
          </button>
        )}
        <button
          onClick={() => onViewDetails(order)}
          className="h-11 px-5 rounded-full border border-border text-fg-1 font-medium hover:border-border-strong active:scale-95 transition-all"
        >
          Details
        </button>
      </div>
    </div>
  );
}

export default function StaffDashboardPage() {
  const stored = useLocalStorageValue<StoredOrder[]>(ORDERS_KEY);
  const [detailsOrder, setDetailsOrder] = useState<StoredOrder | null>(null);
  const orders = stored === undefined ? undefined : sortByNewest(stored ?? []);
  const activeOrders = orders?.filter((order) => order.status !== "collected") ?? [];
  const completedOrders = orders?.filter((order) => order.status === "collected") ?? [];

  const handleAdvance = (order: StoredOrder) => {
    const upcoming = nextStatus(order.status);
    if (!upcoming || !orders) return;
    updateOrderStatus(orders, order.id, upcoming);
    createSnackbar.show(`${order.id} marked ${upcoming}`, { type: "go", duration: 2500 });
  };

  return (
    <div className="bg-background text-on-background overflow-x-hidden min-h-screen pb-16">
      <header className="sticky top-0 z-30 flex items-center justify-between px-5 h-16 bg-background/90 backdrop-blur-lg border-b border-border">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary">storefront</span>
          <h1 className="font-display font-bold text-lg text-fg-0">Staff dashboard</h1>
        </div>
        <Link href="/" className="text-fg-2 text-sm hover:text-primary transition-colors">
          Exit
        </Link>
      </header>

      <main className="pt-6 px-3 max-w-3xl mx-auto">
        <p className="text-fg-2 text-sm mb-6">
          {orders === undefined ? "Loading orders…" : `${activeOrders.length} active order${activeOrders.length === 1 ? "" : "s"}`}
        </p>

        {orders === undefined && (
          <div className="flex flex-col gap-3">
            <div className="rounded-lg border border-border bg-surface-container h-40 animate-pulse" />
            <div className="rounded-lg border border-border bg-surface-container h-40 animate-pulse" />
          </div>
        )}

        {orders !== undefined && activeOrders.length === 0 && completedOrders.length === 0 && (
          <div className="flex flex-col items-center text-center pt-12">
            <span className="material-symbols-outlined text-fg-3 text-5xl mb-4">receipt_long</span>
            <h2 className="text-[18px] font-semibold text-fg-0 mb-2">No orders yet</h2>
            <p className="text-fg-2 text-sm">New orders will appear here as patrons check out.</p>
          </div>
        )}

        {activeOrders.length > 0 && (
          <section className="flex flex-col gap-3 mb-8">
            {activeOrders.map((order) => (
              <StaffOrderCard
                key={order.id}
                order={order}
                onAdvance={handleAdvance}
                onViewDetails={setDetailsOrder}
              />
            ))}
          </section>
        )}

        {completedOrders.length > 0 && (
          <section>
            <h2 className="text-[15px] font-semibold text-fg-2 mb-3">Completed</h2>
            <div className="flex flex-col gap-2">
              {completedOrders.map((order) => (
                <button
                  key={order.id}
                  onClick={() => setDetailsOrder(order)}
                  className="rounded-lg border border-border bg-surface-container-low p-3 flex items-center justify-between text-left hover:border-border-strong transition-colors"
                >
                  <span className="font-mono text-fg-2 text-sm">{order.id}</span>
                  <span className="text-fg-3 text-sm">{order.venueName}</span>
                  <StatusBadge status={order.status} showIcon={false} />
                </button>
              ))}
            </div>
          </section>
        )}
      </main>

      <BottomSheet
        isOpen={detailsOrder !== null}
        onClose={() => setDetailsOrder(null)}
        title={detailsOrder ? `Order ${detailsOrder.id}` : undefined}
      >
        {detailsOrder && (
          <div className="flex flex-col gap-4">
            <p className="text-fg-2 text-sm">{detailsOrder.venueName}</p>
            <div className="flex flex-col gap-2">
              {detailsOrder.lines.map((line) => (
                <div key={line.id} className="flex justify-between text-sm">
                  <span className="text-fg-1">
                    {line.quantity}x {line.name}
                  </span>
                  <span className="font-mono text-fg-2">{formatZar(line.price * line.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between pt-3 border-t border-border font-semibold">
              <span className="text-fg-0">Total</span>
              <span className="font-mono text-fg-0">{formatZar(detailsOrder.total)}</span>
            </div>
          </div>
        )}
      </BottomSheet>
    </div>
  );
}
