"use client";

import { useCallback, useSyncExternalStore } from "react";

const emitter = new EventTarget();

function subscribe(key: string) {
  return (onStoreChange: () => void) => {
    const handler = () => onStoreChange();
    emitter.addEventListener(key, handler);
    window.addEventListener("storage", handler);
    return () => {
      emitter.removeEventListener(key, handler);
      window.removeEventListener("storage", handler);
    };
  };
}

/**
 * Reads a JSON value from localStorage without a setState-in-effect hydration
 * flash: the server snapshot is `undefined` ("still hydrating"), the client
 * snapshot is `null` when the key is genuinely absent, or the parsed value.
 */
export function useLocalStorageValue<T>(key: string): T | null | undefined {
  const getSnapshot = useCallback(() => window.localStorage.getItem(key), [key]);
  const getServerSnapshot = () => undefined;

  const raw = useSyncExternalStore(subscribe(key), getSnapshot, getServerSnapshot);

  if (raw === undefined) return undefined;
  if (raw === null) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function writeLocalStorageValue<T>(key: string, value: T): void {
  window.localStorage.setItem(key, JSON.stringify(value));
  emitter.dispatchEvent(new Event(key));
}

export function removeLocalStorageValue(key: string): void {
  window.localStorage.removeItem(key);
  emitter.dispatchEvent(new Event(key));
}
