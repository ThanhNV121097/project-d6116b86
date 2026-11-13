import { useSyncExternalStore } from "react";

/**
 * The design's mock cart: what a visitor has put in it, on this browser.
 *
 * For the design only, exactly as src/lib/session.ts is. A shop whose "Add
 * to bag" does nothing cannot be judged — the owner presses it in the Studio
 * and either sees a bag with a shirt in it or sees nothing — so the bag
 * holds things. After approval the backend story replaces this module behind
 * the same names, with an order that is marked paid only by the gateway's own
 * notice; no page changes.
 *
 * Use it; never write another cart. ONLY where the owner's brief sells
 * online: a shop that takes orders by message has no bag, however central
 * the bag is to the template it was built from.
 *
 *   useCart()                   { lines, count, total } — redraws on change
 *   addToCart(line, qty?)       the same thing in the same variant adds up
 *   setQuantity(key, qty)       0 takes the line out
 *   removeFromCart(key) / clearCart()
 *
 * Kept as JSON in localStorage under "agentteam:cart".
 */
export interface CartLine {
  /** The record's id. */
  id: string;
  name: string;
  /** In the site's currency, as the record has it. */
  price: number;
  image?: string;
  /** The chosen size, colour, weight — whatever the record varies by. */
  variant?: string;
  qty: number;
}

const KEY = "agentteam:cart";
let memory: string | null = null;

/** What makes two lines the same line: the thing and its variant. */
export function lineKey(line: Pick<CartLine, "id" | "variant">): string {
  return line.variant ? `${line.id}::${line.variant}` : line.id;
}

function load(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return memory;
  }
}

function parse(raw: string | null): CartLine[] {
  if (!raw) return [];
  try {
    const v = JSON.parse(raw) as unknown;
    if (!Array.isArray(v)) return [];
    return v.filter((l): l is CartLine =>
      typeof l === "object" && l !== null && typeof (l as CartLine).id === "string" && Number((l as CartLine).qty) > 0);
  } catch {
    return [];
  }
}

let lastRaw: string | null | undefined;
let last: CartLine[] = [];

function read(): CartLine[] {
  const raw = load();
  if (raw !== lastRaw) {
    lastRaw = raw;
    last = parse(raw);
  }
  return last;
}

const listeners = new Set<() => void>();

function write(lines: CartLine[]) {
  const raw = lines.length > 0 ? JSON.stringify(lines) : null;
  memory = raw;
  try {
    if (raw === null) localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, raw);
  } catch {
    // Storage refused: the bag lasts this page.
  }
  listeners.forEach((l) => l());
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY || e.key === null) onChange();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onStorage);
  };
}

const NONE: CartLine[] = [];

export function useCart() {
  const lines = useSyncExternalStore(subscribe, read, () => NONE);
  return {
    lines,
    count: lines.reduce((n, l) => n + l.qty, 0),
    total: lines.reduce((sum, l) => sum + l.price * l.qty, 0),
  };
}

export function addToCart(line: Omit<CartLine, "qty">, qty = 1): void {
  const lines = read();
  const key = lineKey(line);
  const at = lines.findIndex((l) => lineKey(l) === key);
  write(at >= 0
    ? lines.map((l, i) => (i === at ? { ...l, qty: l.qty + qty } : l))
    : [...lines, { ...line, qty }]);
}

export function setQuantity(key: string, qty: number): void {
  write(read().flatMap((l) => (lineKey(l) !== key ? [l] : qty > 0 ? [{ ...l, qty }] : [])));
}

export function removeFromCart(key: string): void {
  setQuantity(key, 0);
}

export function clearCart(): void {
  write([]);
}
