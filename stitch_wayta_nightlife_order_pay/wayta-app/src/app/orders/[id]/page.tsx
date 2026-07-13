"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { WaytaHeader } from "@/components/wayta-header";
import { WaytaBottomNav } from "@/components/wayta-bottom-nav";
import { StatusBadge, WaitingTimeBadge } from "@/components/status-badge";
import { useLocalStorageValue } from "@/hooks/use-local-storage";
import { formatZar } from "@/lib/menu";
import { findOrder, ORDERS_KEY, type StoredOrder } from "@/lib/orders";

const STATUS_LABEL: Record<StoredOrder["status"], string> = {
  received: "Order received",
  preparing: "Preparing your order",
  ready: "Ready for collection",
  collected: "Collected",
};

export default function OrderTrackingPage() {
  const params = useParams<{ id: string }>();
  const orders = useLocalStorageValue<StoredOrder[]>(ORDERS_KEY);
  const order = orders === undefined ? undefined : (findOrder(orders ?? [], params.id) ?? null);
  const [elapsedMinutes, setElapsedMinutes] = useState(0);

  useEffect(() => {
    if (!order) return;

    const tick = () => setElapsedMinutes(Math.floor((Date.now() - order.createdAt) / 60000));
    tick();
    const interval = setInterval(tick, 30000);
    return () => clearInterval(interval);
  }, [order]);

  if (order === undefined) {
    return (
      <div className="bg-background text-on-background overflow-x-hidden min-h-screen">
        <WaytaHeader variant="back" backHref="/orders" />
        <main className="pt-24 pb-32 px-3 min-h-screen">
          <div className="rounded-lg border border-border bg-surface-container h-64 animate-pulse" />
        </main>
        <WaytaBottomNav active="orders" />
      </div>
    );
  }

  if (order === null) {
    return (
      <div className="bg-background text-on-background overflow-x-hidden min-h-screen">
        <WaytaHeader variant="back" backHref="/orders" />
        <main className="pt-24 pb-32 px-3 min-h-screen flex flex-col items-center text-center">
          <span className="material-symbols-outlined text-fg-3 text-5xl mb-4">receipt_long</span>
          <h1 className="text-[20px] font-semibold text-fg-0 mb-2">Order not found</h1>
          <p className="text-fg-2 text-sm mb-6">This order doesn&apos;t exist on this device.</p>
          <Link
            href="/venues"
            className="h-12 px-6 rounded-full bg-primary text-black font-medium flex items-center hover:bg-accent-hover active:scale-95 transition-all"
          >
            Find a venue
          </Link>
        </main>
        <WaytaBottomNav active="orders" />
      </div>
    );
  }

  const itemSummary = order.lines.map((line) => `${line.quantity}x ${line.name}`).join(", ");
  const isDone = order.status === "ready" || order.status === "collected";

  return (
    <div className="bg-background text-on-background overflow-x-hidden min-h-screen">
      <WaytaHeader variant="back" backHref="/orders" />

      <main className="pt-24 pb-32 px-3 min-h-screen">
        {/* Order status card */}
        <div className="relative overflow-hidden rounded-lg border border-border bg-surface-container mb-6 p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-fg-2 text-[12px] font-medium mb-1">
                {order.venueName}
              </p>
              <h2 className="text-2xl font-bold font-mono text-fg-0">{order.id}</h2>
            </div>
            <StatusBadge status={order.status} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Timeline */}
            <div className="flex flex-col gap-6 py-4">
              {/* Received */}
              <div className="flex gap-4 relative">
                <div className="absolute left-3 top-6 w-0.5 h-12 bg-go" />
                <div className="z-10 w-6 h-6 rounded-full bg-go flex items-center justify-center text-black flex-shrink-0">
                  <span className="material-symbols-outlined text-sm">check</span>
                </div>
                <div>
                  <h3 className="font-medium text-fg-0">Order received</h3>
                  <p className="text-fg-2 text-sm">{itemSummary}</p>
                </div>
              </div>

              {/* Preparing */}
              <div className="flex gap-4 relative">
                <div className={`absolute left-3 top-6 w-0.5 h-12 ${isDone ? "bg-go" : "bg-border"}`} />
                <div
                  className={`z-10 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isDone ? "bg-go text-black" : "bg-background border-2 border-warn"
                  }`}
                >
                  {isDone ? (
                    <span className="material-symbols-outlined text-sm">check</span>
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-warn" />
                  )}
                </div>
                <div>
                  <h3 className={`font-medium ${isDone ? "text-fg-0" : "text-warn"}`}>Preparing</h3>
                  <p className="text-fg-2 text-sm">Your order is being made at the bar.</p>
                </div>
              </div>

              {/* Ready */}
              <div className="flex gap-4">
                <div
                  className={`z-10 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isDone ? "bg-go text-black" : "bg-background border border-border"
                  }`}
                >
                  <span className={`material-symbols-outlined text-sm ${isDone ? "" : "text-fg-2"}`}>
                    done_all
                  </span>
                </div>
                <div>
                  <h3 className={`font-medium ${isDone ? "text-fg-0" : "text-fg-3"}`}>
                    Ready for collection
                  </h3>
                  <p className={`text-sm ${isDone ? "text-fg-2" : "text-fg-3"}`}>
                    Head to the bar when notified.
                  </p>
                </div>
              </div>
            </div>

            {/* QR Code */}
            <div className="bg-surface-container-low p-6 rounded-lg flex flex-col items-center justify-center border border-border relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none bg-gradient-to-br from-primary to-accent-hover" />
              <div className="w-48 h-48 bg-white p-2 rounded-lg relative mb-4" style={{ boxShadow: "var(--glow-amber)" }}>
                <img
                  alt={`QR code for order ${order.id}`}
                  className="w-full h-full"
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(order.id)}`}
                />
              </div>
              <p className="text-[12px] text-fg-2 text-center font-medium">
                Show this at the pickup counter
              </p>
            </div>
          </div>
        </div>

        {/* Status summary cards */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          <div className="bg-surface-container border border-border p-4 rounded-lg flex flex-col justify-center gap-2">
            <span className="text-fg-2 text-[12px] font-medium">
              {STATUS_LABEL[order.status]}
            </span>
            <WaitingTimeBadge minutes={elapsedMinutes} />
          </div>
          <div className="bg-surface-container border border-border p-4 rounded-lg flex flex-col justify-center">
            <span className="text-fg-2 text-[12px] font-medium mb-2">Total paid</span>
            <span className="text-2xl font-bold leading-none text-fg-0 font-mono">
              {formatZar(order.total)}
            </span>
          </div>
        </div>

        <button className="w-full h-14 rounded-full border-2 border-stop text-stop font-semibold flex items-center justify-center gap-2 hover:bg-stop/10 active:scale-95 transition-all">
          <span className="material-symbols-outlined">contact_support</span>
          Need help with this order
        </button>
      </main>

      <WaytaBottomNav active="orders" />
    </div>
  );
}
