import type { CartLine } from "@/lib/cart";
import { writeLocalStorageValue } from "@/hooks/use-local-storage";

export type OrderStatus = "received" | "preparing" | "ready" | "collected";

export interface StoredOrder {
  id: string;
  venueSlug: string;
  venueName: string;
  lines: CartLine[];
  total: number;
  status: OrderStatus;
  createdAt: number;
}

export const ORDERS_KEY = "wayta_orders";

export function generateOrderId(venueName: string): string {
  const initial = venueName.trim().charAt(0).toUpperCase() || "W";
  const code = Math.floor(10 + Math.random() * 90);
  return `${initial}-${code}`;
}

export function createOrder(
  existingOrders: StoredOrder[],
  input: { venueSlug: string; venueName: string; lines: CartLine[]; total: number }
): StoredOrder {
  const order: StoredOrder = {
    id: generateOrderId(input.venueName),
    venueSlug: input.venueSlug,
    venueName: input.venueName,
    lines: input.lines,
    total: input.total,
    status: "received",
    createdAt: Date.now(),
  };
  writeLocalStorageValue(ORDERS_KEY, [...existingOrders, order]);
  return order;
}

export function findOrder(orders: StoredOrder[], id: string): StoredOrder | undefined {
  return orders.find((order) => order.id === id);
}

export function sortByNewest(orders: StoredOrder[]): StoredOrder[] {
  return [...orders].sort((a, b) => b.createdAt - a.createdAt);
}
