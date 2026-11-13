/**
 * WHAT "SAVE" MEANS IN A DESIGN.
 *
 * The design is the frontend on mock data, and a management area that cannot
 * add a row is a management area nobody can judge: the owner clicks Add in
 * the Studio, types a product, and either sees it in the table or sees a
 * dialog that does nothing. So the screens write — into the same in-memory
 * store every `useCollection` reads (src/data/index.ts), which redraws every
 * page showing that collection.
 *
 * IT IS NOT PERSISTENCE AND MUST NOT PRETEND TO BE. A reload brings the JSON
 * files back. That is correct for a design: the records are the design's mock
 * data, the Studio's Data panel is where the owner's real records are edited,
 * and the story *Site data from the database* replaces src/data/index.ts with
 * calls to the backend — POST, PUT and DELETE land here, behind these three
 * names, and no screen changes.
 */
import { collections, setCollection, type Row } from "../../data";

/**
 * A new record's id.
 *
 * A COUNTER AND NOT THE LIST'S LENGTH. The first version was
 * `${collection}-${rows.length + 1}-${now}`, which repeats itself twice over:
 * two records added inside one millisecond get the same id (the test found
 * it), and so does one added after another was deleted, since the length came
 * back round. An id that repeats means a later edit writes over an earlier
 * record — the one defect in a CMS a person cannot see and cannot undo.
 */
let made = 0;

export function newId(collection: string): string {
  made += 1;
  return `${collection}-${Date.now().toString(36)}-${made}`;
}

/**
 * Adds or replaces a record, keeping the order of the list: an edit that
 * moves the row being edited to the bottom of the table loses the person's
 * place, which is the one thing they were holding.
 */
export function saveRow(collection: string, row: Row): Row {
  const rows = collections()[collection] ?? [];
  const saved: Row = row.id ? row : { ...row, id: newId(collection) };
  const at = rows.findIndex((r) => r.id === saved.id);
  const next = at >= 0
    ? rows.map((r, i) => (i === at ? { ...r, ...saved } : r))
    : [...rows, saved];
  setCollection(collection, next);
  return saved;
}

export function deleteRow(collection: string, id: string): void {
  const rows = collections()[collection] ?? [];
  setCollection(collection, rows.filter((r) => r.id !== id));
}
