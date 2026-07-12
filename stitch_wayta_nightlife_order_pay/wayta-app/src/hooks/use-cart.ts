"use client";

import { useCallback, useMemo } from "react";
import { type CartLine, cartCount, cartKey, cartTotal } from "@/lib/cart";
import { removeLocalStorageValue, useLocalStorageValue, writeLocalStorageValue } from "@/hooks/use-local-storage";

export function useCart(venueSlug: string) {
  const key = cartKey(venueSlug);
  const stored = useLocalStorageValue<CartLine[]>(key);
  const hydrated = stored !== undefined;
  const lines = useMemo(() => stored ?? [], [stored]);

  const setQuantity = useCallback(
    (item: { id: string; name: string; price: number }, quantity: number) => {
      const existing = lines.find((line) => line.id === item.id);
      const next = existing
        ? lines.map((line) => (line.id === item.id ? { ...line, quantity } : line))
        : quantity > 0
          ? [...lines, { ...item, quantity }]
          : lines;
      writeLocalStorageValue(key, next);
    },
    [key, lines]
  );

  const removeItem = useCallback(
    (itemId: string) => {
      writeLocalStorageValue(
        key,
        lines.filter((line) => line.id !== itemId)
      );
    },
    [key, lines]
  );

  const clear = useCallback(() => {
    removeLocalStorageValue(key);
  }, [key]);

  return {
    lines,
    hydrated,
    setQuantity,
    removeItem,
    clear,
    total: cartTotal(lines),
    count: cartCount(lines),
  };
}
