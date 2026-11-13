import type { CartLine } from "../cart";

/**
 * The design's mock of a paid order: the last one placed on this browser.
 *
 * For the design only. Paying here is a success state with no charge; after
 * approval the backend story replaces this module, and an order is marked
 * paid only by the payment provider's own notice to the server.
 */
export interface PlacedOrder {
  ref: string;
  /** ISO date and time. */
  placedAt: string;
  name: string;
  reply: string;
  address: string;
  note?: string;
  delivery: string;
  payment: string;
  lines: CartLine[];
  subtotal: number;
  /** null while the owner has not set a delivery fee. */
  fee: number | null;
  total: number;
}

const KEY = "ep:last-order";
let memory: string | null = null;

/** A short order number a customer can read out on the phone. */
export function newRef(): string {
  return `EP-${Date.now().toString(36).slice(-5).toUpperCase()}`;
}

export function saveOrder(order: PlacedOrder): void {
  const raw = JSON.stringify(order);
  memory = raw;
  try {
    localStorage.setItem(KEY, raw);
  } catch {
    // Storage refused: the order lasts this page.
  }
}

export function lastOrder(): PlacedOrder | null {
  let raw = memory;
  try {
    raw = localStorage.getItem(KEY) ?? memory;
  } catch {
    // Storage refused: what this page kept.
  }
  if (!raw) return null;
  try {
    const v = JSON.parse(raw) as PlacedOrder;
    return v && typeof v.ref === "string" && Array.isArray(v.lines) ? v : null;
  } catch {
    return null;
  }
}
