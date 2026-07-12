"use client";

import { useState } from "react";
import { WaytaHeader } from "@/components/wayta-header";
import { WaytaBottomNav } from "@/components/wayta-bottom-nav";
import { BudgetDialog } from "@/components/budget-dialog";
import { useLocalStorageValue, writeLocalStorageValue } from "@/hooks/use-local-storage";
import { BUDGET_LIMIT_KEY } from "@/lib/budget";
import { formatZar } from "@/lib/menu";
import { ORDERS_KEY, sortByNewest, type StoredOrder } from "@/lib/orders";

const CIRCLE_RADIUS = 80;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;

export default function BudgetDashboardPage() {
  const limit = useLocalStorageValue<number>(BUDGET_LIMIT_KEY);
  const storedOrders = useLocalStorageValue<StoredOrder[]>(ORDERS_KEY);
  const [dialogOpen, setDialogOpen] = useState(false);

  const orders = sortByNewest(storedOrders ?? []);
  const spent = orders.reduce((sum, order) => sum + order.total, 0);
  const hasLimit = typeof limit === "number" && limit > 0;
  const progress = hasLimit ? Math.min(spent / limit, 1) : 0;
  const circleOffset = CIRCLE_CIRCUMFERENCE * (1 - progress);
  const isHydrated = limit !== undefined && storedOrders !== undefined;

  return (
    <div className="bg-background text-on-background overflow-x-hidden min-h-screen pb-32">
      <WaytaHeader variant="menu" />

      <main className="pt-24 px-5 max-w-lg mx-auto space-y-6">
        {/* Tonight's budget */}
        <section className="rounded-lg border border-border bg-surface-container/70 backdrop-blur-md p-6 flex flex-col items-center gap-4 relative overflow-hidden">
          <h2 className="text-[17px] font-semibold w-full text-fg-0">Tonight&apos;s budget</h2>

          {isHydrated && hasLimit && (
            <div className="relative flex items-center justify-center py-4">
              <svg className="w-48 h-48">
                <circle
                  className="text-border"
                  cx="96"
                  cy="96"
                  fill="transparent"
                  r={CIRCLE_RADIUS}
                  stroke="currentColor"
                  strokeWidth="12"
                />
                <circle
                  className={progress >= 1 ? "text-stop" : "text-primary"}
                  style={{
                    transition: "stroke-dashoffset var(--dur-ui) var(--ease-out)",
                    transform: "rotate(-90deg)",
                    transformOrigin: "50% 50%",
                  }}
                  cx="96"
                  cy="96"
                  fill="transparent"
                  r={CIRCLE_RADIUS}
                  stroke="currentColor"
                  strokeDasharray={CIRCLE_CIRCUMFERENCE}
                  strokeDashoffset={circleOffset}
                  strokeLinecap="round"
                  strokeWidth="12"
                />
              </svg>
              <div className="absolute flex flex-col items-center text-center">
                <span className="text-4xl font-bold font-mono text-fg-0">{formatZar(spent)}</span>
                <span className="text-fg-2 text-[12px] font-medium">Spent of {formatZar(limit)}</span>
              </div>
            </div>
          )}

          {isHydrated && !hasLimit && (
            <div className="py-8 flex flex-col items-center text-center gap-2">
              <span className="material-symbols-outlined text-fg-3 text-4xl">account_balance_wallet</span>
              <p className="text-fg-2 text-sm">Set a limit to track your spend tonight.</p>
            </div>
          )}

          {!isHydrated && <div className="w-48 h-48 rounded-full bg-surface-container-low animate-pulse" />}

          <button
            onClick={() => setDialogOpen(true)}
            className="w-full h-14 bg-primary text-black font-semibold rounded-full hover:bg-accent-hover active:scale-95 transition-all"
            style={{ boxShadow: "var(--glow-amber)" }}
          >
            {hasLimit ? "Update budget" : "Set a budget"}
          </button>
        </section>

        {/* Recent activity */}
        <section className="space-y-4">
          <h3 className="text-[17px] font-semibold text-fg-0">Recent activity</h3>

          {!isHydrated && (
            <div className="space-y-3">
              <div className="h-20 rounded-lg bg-surface-container-low animate-pulse" />
              <div className="h-20 rounded-lg bg-surface-container-low animate-pulse" />
            </div>
          )}

          {isHydrated && orders.length === 0 && (
            <p className="text-fg-2 text-sm">Orders you place will show up here.</p>
          )}

          {isHydrated && orders.length > 0 && (
            <div className="space-y-3">
              {orders.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  className="bg-surface-container/70 backdrop-blur-md border border-border p-4 rounded-lg flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-surface-container-low flex items-center justify-center border border-border">
                      <span className="material-symbols-outlined text-primary">local_bar</span>
                    </div>
                    <div>
                      <p className="font-medium text-fg-0">{order.venueName}</p>
                      <p className="text-xs text-fg-2 font-mono">{order.id}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold font-mono text-fg-0">-{formatZar(order.total)}</p>
                    <p className="text-[11px] text-go font-medium capitalize">{order.status}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <BudgetDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        currentLimit={hasLimit ? limit : null}
        onSave={(amount) => writeLocalStorageValue(BUDGET_LIMIT_KEY, amount)}
      />

      <WaytaBottomNav active="wallet" />
    </div>
  );
}
