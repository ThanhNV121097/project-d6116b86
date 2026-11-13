/**
 * What this shop's records are, as the pages read them. The fields are the
 * ones src/data/schema.json declares; change both together.
 */
export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  /** The source page's own figure when the price was converted. Never shown. */
  price_listed?: string;
  /** The bottle size as the label writes it: "250 ml". */
  volume?: string;
  /** The lead fruit, for the chip on the card. */
  fact?: string;
  /** What is in it, in the order on the label. */
  ingredients?: string[];
  /** How long it keeps, as a phrase: "5 days in the fridge". */
  keeps?: string;
  /** Bottles on hand, when the owner keeps a count; read by AdminLowStock. */
  stock?: number;
  status?: string;
  description?: string;
  /** Sizes or sweetness a buyer chooses between. */
  options?: string[];
  image?: string;
  image_back?: string;
  image_detail?: string;
}

/** A kind of juice: fruit, greens, roots & spice. */
export interface Department {
  id: string;
  name: string;
}

/** One way an order reaches the customer. Fee and areas are the owner's to fill. */
export interface DeliveryOption {
  id: string;
  name: string;
  fee?: number | null;
  minimum?: number | null;
  areas?: string;
  note?: string;
}

/** One way to pay online at checkout. */
export interface PaymentMethod {
  id: string;
  name: string;
  icon?: string;
  note?: string;
}

/** Delivery and cancelling, in the owner's words. */
export interface Policy {
  id: string;
  title: string;
  body?: string;
}

/** One link of the header, as content.json holds it. */
export interface NavItem {
  label: string;
  href: string;
}

/** One card of the notes band: a photograph, a short title and a line. A
 *  name goes under it only when it is a real person's review. */
export interface Note {
  title?: string;
  line: string;
  image?: string;
  name?: string;
}

/** Every picture a product has, the main one first. */
export function picturesOf(p: Product): string[] {
  return [p.image, p.image_back, p.image_detail].filter((s): s is string => Boolean(s));
}

/** Whether two pictures were saved the same way — both cut out (.png) or both
 *  kept whole — so one can stand in for the other under the pointer. */
export function sameKind(a?: string, b?: string): boolean {
  if (!a || !b) return false;
  const cut = (s: string) => /\.png(?:$|[?#])/i.test(s);
  return cut(a) === cut(b);
}

/** The icon a way to pay is drawn with. */
export function payIcon(s?: string): "card" | "qr" | "wallet" | "cash" {
  return s === "qr" || s === "wallet" || s === "cash" ? s : "card";
}
