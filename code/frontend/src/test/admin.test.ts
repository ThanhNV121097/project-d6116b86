import { describe, expect, it } from "vitest";
import {
  blank, columnsFromFields, fieldsOf, labelOf, missing, titleOf, type FieldSpec,
} from "../components/admin/fields";
import { deleteRow, newId, saveRow } from "../components/admin/store";
import { collections, schema, setCollection, type Row } from "../data";

// THE MANAGEMENT SCREENS' ONE PIECE OF LOGIC.
//
// Everything else in src/components/admin is markup, which the free walk and
// a reviewer can see. These four functions are what a screen DERIVES — the
// columns, the form, what is refused on save, which row a write lands on —
// and they are invisible: a wrong one ships a CMS that looks finished and
// edits the wrong record.
describe("the fields a management screen derives", () => {
  it("names a field a person can read", () => {
    expect(labelOf("created_at")).toBe("Created at");
    expect(labelOf("fullName")).toBe("Full name");
  });

  it("draws for a collection the schema does not describe", () => {
    // The scaffold ships schema.json with no collections at all, and a page
    // written before its data exists must still render rather than throw.
    expect(fieldsOf("nothing-here")).toEqual([]);
    expect(columnsFromFields([])).toEqual([]);
  });

  it("keeps long text out of the table and numbers to the right", () => {
    const fields: FieldSpec[] = [
      { key: "name", label: "Name", type: "text" },
      { key: "story", label: "Story", type: "longtext" },
      { key: "price", label: "Price", type: "price" },
    ];
    const cols = columnsFromFields(fields);
    expect(cols.map((c) => c.key)).toEqual(["name", "price"]);
    expect(cols.find((c) => c.key === "price")?.align).toBe("right");
  });

  it("refuses a required field that is empty, and only that", () => {
    const fields: FieldSpec[] = [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "note", label: "Note", type: "text" },
      { key: "live", label: "Live", type: "bool", required: true },
    ];
    const values = blank(fields);
    // A false toggle is an answer, not an absence: only the text is missing.
    expect(Object.keys(missing(fields, values))).toEqual(["name"]);
    expect(missing(fields, { ...values, name: "Trà sen" })).toEqual({});
  });

  it("calls a record by its own name", () => {
    expect(titleOf({ id: "p1", name: "Nhà Gốm" })).toBe("Nhà Gốm");
    expect(titleOf({ id: "p1" })).toBe("p1");
    expect(titleOf(undefined)).toBe("");
  });
});

describe("what Save does in a design", () => {
  const rows: Row[] = [
    { id: "a", name: "First" },
    { id: "b", name: "Second" },
    { id: "c", name: "Third" },
  ];

  it("edits in place, keeping the person's place in the list", () => {
    setCollection("things", rows.map((r) => ({ ...r })));
    saveRow("things", { id: "b", name: "Second, edited" });
    const after = collections().things;
    expect(after.map((r) => r.id)).toEqual(["a", "b", "c"]);
    expect(after[1].name).toBe("Second, edited");
  });

  it("gives a new record an id and puts it at the end", () => {
    setCollection("things", rows.map((r) => ({ ...r })));
    const saved = saveRow("things", { id: "", name: "Fourth" });
    expect(saved.id).toBeTruthy();
    expect(collections().things.map((r) => r.name)).toEqual(["First", "Second", "Third", "Fourth"]);
  });

  it("removes exactly the row asked for", () => {
    setCollection("things", rows.map((r) => ({ ...r })));
    deleteRow("things", "b");
    expect(collections().things.map((r) => r.id)).toEqual(["a", "c"]);
  });

  it("never gives two records the same id", () => {
    setCollection("things", []);
    expect(newId("things")).not.toBe(newId("things"));
  });
});

// WHAT A FIELD IS, READ OFF ITS ROWS.
//
// The form run bd4d1058 shipped: "Status" as a box to type `live` into,
// "Photograph" as a box holding a file path, "Backdrop colour" as a box
// holding `var(--swatch-2)`. Each of those is decidable from the data, and
// these are the rows that form was drawn from, in miniature.
describe("a field read for what it is", () => {
  const rows: Row[] = Array.from({ length: 8 }, (_, i) => ({
    id: `p${i}`,
    name: `Garment ${i}`,
    image: `/images/products-${i}.jpg`,
    status: i % 3 === 0 ? "draft" : "live",
    backdrop: `var(--swatch-${(i % 4) + 1})`,
    fabric: `A fabric nobody else has, number ${i}`,
  }));

  const specs = () => {
    schema.collections.garments = {
      fields: [
        { key: "name", type: "text" },
        { key: "image", type: "text" },
        { key: "status", type: "text" },
        { key: "backdrop", type: "text" },
        { key: "fabric", type: "text" },
        { key: "swatch", type: "text", hidden: true },
        { key: "size", type: "text", options: ["s", ["m", "Medium"]] },
      ],
    };
    setCollection("garments", rows);
    return fieldsOf("garments");
  };

  it("makes a choice of a text field whose rows share a few values", () => {
    const status = specs().find((f) => f.key === "status");
    expect(status?.options?.map(([v]) => v).sort()).toEqual(["draft", "live"]);
    // A field with a different value on every row is not a choice.
    expect(specs().find((f) => f.key === "name")?.options).toBeUndefined();
    expect(specs().find((f) => f.key === "fabric")?.options).toBeUndefined();
  });

  it("sees that a column of image paths is a picture", () => {
    expect(specs().find((f) => f.key === "image")?.type).toBe("image");
  });

  it("leaves the design's own plumbing off the form", () => {
    const keys = specs().map((f) => f.key);
    expect(keys).not.toContain("backdrop"); // every value is var(--…)
    expect(keys).not.toContain("swatch"); // the schema said hidden
  });

  it("believes the schema when it names the choices", () => {
    expect(specs().find((f) => f.key === "size")?.options).toEqual([["s", "S"], ["m", "Medium"]]);
  });
});
