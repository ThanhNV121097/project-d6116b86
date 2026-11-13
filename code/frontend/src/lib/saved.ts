import { useSyncExternalStore } from "react";

/**
 * The things a visitor has put a heart on.
 *
 * The template draws a heart on every card, and a heart that does nothing is
 * a picture of a control. This one keeps the choice — in the visitor's own
 * browser, under "agentteam:saved" — so it is still there when they come
 * back, and the card shows it. A shop with accounts moves this to its
 * backend; the card does not change.
 */
const KEY = "agentteam:saved";
const listeners = new Set<() => void>();
let cache: readonly string[] | null = null;

function read(): readonly string[] {
  if (cache) return cache;
  try {
    const raw = window.localStorage.getItem(KEY);
    const list: unknown = raw ? JSON.parse(raw) : [];
    cache = Array.isArray(list) ? list.filter((x): x is string => typeof x === "string") : [];
  } catch {
    cache = [];
  }
  return cache;
}

function subscribe(fn: () => void): () => void {
  listeners.add(fn);
  return () => { listeners.delete(fn); };
}

const NONE: readonly string[] = [];

/** Whether this visitor has saved the record. */
export function useSaved(id: string): boolean {
  return useSyncExternalStore(subscribe, read, () => NONE).includes(id);
}

/** Puts the heart on, or takes it off. */
export function toggleSaved(id: string): void {
  const now = read();
  cache = now.includes(id) ? now.filter((x) => x !== id) : [...now, id];
  try {
    window.localStorage.setItem(KEY, JSON.stringify(cache));
  } catch {
    // A browser that will not store it still shows it for this visit.
  }
  listeners.forEach((fn) => { fn(); });
}
