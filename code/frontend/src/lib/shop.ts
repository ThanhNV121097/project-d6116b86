/**
 * What this shop's records are, as the pages read them. The fields are the
 * ones src/data/schema.json declares; change both together.
 */
export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  /** The price before a reduction; drawn struck through beside the price. */
  was?: number;
  /** One or two words for the chip on the card: a flavour, a size. */
  fact?: string;
  stock?: number;
  status?: string;
  /** Shown in the first row of the home page. */
  deal?: boolean;
  image?: string;
  image_back?: string;
  image_detail?: string;
  options?: string[];
  material?: string;
  care?: string;
  description?: string;
}

export interface Department {
  id: string;
  name: string;
  image?: string;
}

/** One link of the header, as content.json holds it. */
export interface NavItem {
  label: string;
  href: string;
}

/** One card of the notes band: a photograph, a few lines, and — only when it
 *  is a real person's review — their name. */
export interface Note {
  line: string;
  image?: string;
  name?: string;
}

/** Every picture a product has, the main one first. */
export function picturesOf(p: Product): string[] {
  return [p.image, p.image_back, p.image_detail].filter((s): s is string => Boolean(s));
}
