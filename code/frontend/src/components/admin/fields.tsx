/**
 * THE FIELDS OF A RECORD, READ OFF THE SCHEMA THE SITE ALREADY HAS — and
 * read for what each one IS, not only for what type it has.
 *
 * A management screen is a list of records and a form over one of them, and
 * both are the same knowledge twice: which fields this collection has, what
 * each is called, what kind of value it holds. src/data/schema.json already
 * says so — it is what the Studio's Data panel reads — so a CMS page does not
 * restate it.
 *
 * WHAT A TYPE ALONE GOT WRONG. The first version of this file mapped a
 * field's type to a control and stopped, and on a real run (bd4d1058) that
 * produced a form of twelve identical boxes: "Status" was a box to type
 * `live` into, "Photograph" a box holding `/images/products-so-mi-linen.jpg`,
 * and "Backdrop colour" a box holding `var(--swatch-2)` — this system's own
 * stylesheet variable, offered to a shop owner as content. Every one of
 * those is decidable from the data the page already has:
 *
 *   - a text field whose rows share a handful of values is a CHOICE;
 *   - a value that is an image path is a PICTURE;
 *   - a value that is a stylesheet variable is not the owner's content at
 *     all, and is left off the form.
 *
 * The schema can say all three outright (`options`, `"type": "image"`,
 * `hidden`) and is believed when it does. Where it does not, the rows decide.
 *
 * AND IT IS A DEFAULT, NOT A CAGE. Every screen takes `fields` and `columns`.
 */
import { type ReactNode } from "react";
import { Badge, type Tone } from "./index";
import { collections, schema, type Row } from "../../data";
import { formatDate, formatPrice } from "../../lib/format";
import type { Column } from "../DataTable";

/** One field of a record, as a screen needs to know it. */
export interface FieldSpec {
  key: string;
  label: string;
  /** text, longtext, number, price, image, url, bool, list, ref:<collection>. */
  type: string;
  hint?: string;
  /** Empty is refused when the form is saved. */
  required?: boolean;
  /** A closed set of choices — [value, label] — for a status or a kind. */
  options?: readonly (readonly [string, string])[];
  /** Which tab of a record page it belongs to. One tab when nobody says. */
  section?: string;
  /** Hidden in the table below 1024px. */
  secondary?: boolean;
}

/** Never shown or edited: the id is the row's identity and _source/_picture
 *  are the design's own marks, which the Studio's Check reads. */
const OWN = new Set(["id", "_source", "_picture"]);

/** "created_at" → "Created at", "fullName" → "Full name", "ao-khoac" → "Ao khoac". */
export function labelOf(key: string): string {
  const words = key.replace(/[_-]+/g, " ").replace(/([a-z\d])([A-Z])/g, "$1 $2").trim();
  return words.charAt(0).toUpperCase() + words.slice(1).toLowerCase();
}

/** A value that is a picture: a path to one, or one held inline — which is
 *  what the form's own picture control writes when a file is chosen. */
const IMAGE_PATH = /^data:image\/|\.(jpe?g|png|webp|gif|avif|svg)(\?.*)?$/i;

function strings(rows: readonly Row[], key: string): string[] {
  return rows.map((r) => r[key]).filter((v): v is string => typeof v === "string" && v.trim() !== "");
}

/**
 * The choices a text field really has, when its rows show it has them: at
 * least four rows, between two and six distinct values, each short, and
 * fewer values than half the rows — so "status" over eighteen products
 * (draft, live) is a choice and "name" (eighteen names) is not.
 */
function choicesIn(values: readonly string[]): [string, string][] | undefined {
  if (values.length < 4) return undefined;
  const distinct = [...new Set(values)];
  if (distinct.length < 2 || distinct.length > 6 || distinct.length * 2 > values.length) return undefined;
  if (distinct.some((v) => v.length > 24 || v.trim().split(/\s+/).length > 3)) return undefined;
  return distinct.map((v) => [v, labelOf(v)]);
}

/** The collection's fields, in the schema's own order, each read for what it
 *  is. Empty for a collection the schema does not describe. */
export function fieldsOf(collection: string): FieldSpec[] {
  const found = schema.collections[collection];
  if (!found) return [];
  const rows = collections()[collection] ?? [];
  const out: FieldSpec[] = [];
  for (const f of found.fields) {
    if (OWN.has(f.key) || f.key.startsWith("_") || f.hidden) continue;
    const seen = strings(rows, f.key);
    // A stylesheet variable is the design talking to itself.
    if (seen.length > 0 && seen.every((v) => v.startsWith("var(--"))) continue;
    const spec: FieldSpec = {
      key: f.key, label: f.label ?? labelOf(f.key), type: f.type,
      hint: f.hint, required: f.required, section: f.section,
    };
    if (f.options) {
      spec.options = f.options.map((o) => (typeof o === "string" ? [o, labelOf(o)] : [o[0], o[1]]) as [string, string]);
    } else if (f.type === "text" || f.type === "url") {
      if (seen.length > 0 && seen.every((v) => IMAGE_PATH.test(v))) spec.type = "image";
      else if (f.type === "text") spec.options = choicesIn(seen);
    }
    out.push(spec);
  }
  return out;
}

/** What to call one record on a screen: its own name, else its id. */
export function titleOf(row: Row | undefined): string {
  if (!row) return "";
  for (const key of ["name", "title", "label", "heading", "full_name", "code"]) {
    const v = row[key];
    if (typeof v === "string" && v.trim()) return v;
  }
  return row.id;
}

/** A record of another collection, by what it is called. For a column a page
 *  writes itself: `render: (r) => nameIn("categories", r.category)`. */
export function nameIn(collection: string, id: unknown): string {
  const key = text(id);
  const found = (collections()[collection] ?? []).find((r) => r.id === key);
  return found ? titleOf(found) : key;
}

export function text(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (Array.isArray(value)) return value.join(", ");
  return String(value);
}

/** A date by its field name, because the schema has no date type: a CMS
 *  shows `created_at` as a date or it shows an ISO string to a person. */
function dated(key: string): boolean {
  return key.endsWith("_at") || key.endsWith("_on") || key.includes("date");
}

const GOOD = new Set(["live", "active", "published", "paid", "approved", "done", "delivered", "confirmed", "open", "in stock"]);
const BAD = new Set(["rejected", "failed", "cancelled", "canceled", "refunded", "overdue", "blocked", "out of stock"]);
const OFF = new Set(["draft", "hidden", "archived", "closed", "inactive", "paused"]);

/** What a state's word means for its mark. The WORD is always drawn; this
 *  only chooses the dot beside it. */
export function toneOf(value: string): Tone {
  const v = value.trim().toLowerCase().replace(/[_-]+/g, " ");
  if (GOOD.has(v)) return "good";
  if (BAD.has(v)) return "danger";
  if (OFF.has(v)) return "off";
  return "neutral";
}

/** What one cell shows. Every date and price through src/lib/format.ts, so
 *  the CMS and the site cannot write two formats (the walk's `date-format`). */
function cell(spec: FieldSpec, row: Row): ReactNode {
  const value = row[spec.key];
  if (spec.type === "image") {
    return (
      <span className="flex size-9 items-center justify-center overflow-hidden rounded-md border border-line bg-ground">
        {value ? <img src={text(value)} alt="" className="h-full w-full object-contain" /> : null}
      </span>
    );
  }
  if (value === null || value === undefined || value === "") {
    return <span className="text-ink-soft">—</span>;
  }
  if (spec.type === "price") return formatPrice(value as number);
  if (spec.type === "bool") return <Badge tone={value ? "good" : "off"}>{value ? "Yes" : "No"}</Badge>;
  if (spec.options) {
    const found = spec.options.find(([v]) => v === text(value));
    return <Badge tone={toneOf(text(value))}>{found ? found[1] : text(value)}</Badge>;
  }
  // A FIELD POINTING AT ANOTHER RECORD SHOWS THAT RECORD. `cat-2` in a
  // Category column is this system's own key on the screen of somebody who
  // has never heard of it.
  if (spec.type.startsWith("ref:")) return nameIn(spec.type.slice("ref:".length), value);
  if (dated(spec.key)) return formatDate(text(value));
  // One line, cut with an ellipsis. A value nobody expected to be long — a
  // pasted address, an encoded picture in a field the schema called text —
  // otherwise takes the whole table's width and pushes every other column
  // off the screen, which is what the first render of this did.
  return <span className="block max-w-[32ch] truncate">{text(value)}</span>;
}

/**
 * The table's columns from the fields. The first six, because a CMS table
 * with twelve columns is read by nobody and five cut the status off a
 * seven-field collection. Long text never (it is paragraphs in a cell), and
 * numbers to the right where a person compares them.
 */
export function columnsFromFields(fields: readonly FieldSpec[], max = 6): Column<Row>[] {
  return fields
    .filter((f) => f.type !== "longtext" && f.type !== "list")
    .slice(0, max)
    .map((f, i) => ({
      key: f.key,
      label: f.type === "image" ? "" : f.label,
      sortable: f.type !== "image",
      align: f.type === "price" || f.type === "number" ? ("right" as const) : ("left" as const),
      secondary: f.secondary ?? i >= 3,
      render: (row: Row) => cell(f, row),
    }));
}

/** An empty record shaped by the fields, for the add dialog. */
export function blank(fields: readonly FieldSpec[]): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const f of fields) out[f.key] = f.type === "bool" ? false : f.type === "list" ? [] : "";
  return out;
}

/** Which required fields are empty. Nothing is saved while this has keys. */
export function missing(
  fields: readonly FieldSpec[],
  values: Record<string, unknown>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const f of fields) {
    if (!f.required) continue;
    const v = values[f.key];
    if (v === undefined || v === null || v === "" || (Array.isArray(v) && v.length === 0)) {
      out[f.key] = `${f.label} is needed`;
    }
  }
  return out;
}
