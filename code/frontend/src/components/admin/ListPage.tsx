/**
 * THE LIST SCREEN OF A MANAGEMENT AREA, WHOLE.
 *
 * Nine tenths of every CMS this product builds is this one screen, repeated
 * per collection: a menu down the left, a search box and the filters the
 * list is really read through, a table with its order and its page numbers,
 * Add in a dialog, Edit on the row, Delete behind a question, and the empty
 * state a new account sees on its first day.
 *
 * Each of those parts already shipped — DashboardLayout, TableFilters,
 * DataTable, FormDialog, Confirm, Empty — and a design turn was still
 * writing the ASSEMBLY of them eleven times a project, in its own way each
 * time. That assembly is model output, which is the bill and the clock both,
 * spent on the one part of a site nobody is judging on taste. So it ships,
 * and a CMS page is what differs:
 *
 *   export default function Products() {
 *     return (
 *       <ListPage
 *         collection="products"
 *         title={useContent("pages.admin.products.title")}
 *         nav={ADMIN_NAV}
 *         rowHref={(r) => `/admin/products/${r.id}`}
 *         filters={[{ key: "status", label: "Status",
 *           options: [["draft", "Draft"], ["live", "Live"]] }]}
 *       />
 *     );
 *   }
 *
 * Nothing above is required but the collection, the title and the menu: the
 * columns and the form come from src/data/schema.json (fields.tsx), and
 * `columns` or `fields` replace them where a turn wants something else.
 *
 * THE FILTERS AND THE PAGE LIVE IN THE ADDRESS BAR (src/lib/table.ts), so
 * "what is waiting for review" is a link somebody can send, and opening a
 * record and coming back lands on the same page of the same list.
 */
import { useState } from "react";
import DashboardLayout, { type NavGroup } from "../DashboardLayout";
import DataTable, { type Column } from "../DataTable";
import TableFilters, { SearchBox, FilterSelect } from "../TableFilters";
import { Button, Confirm, Empty, FormDialog, RowMenu } from "./index";
import { Form } from "./Form";
import { blank, columnsFromFields, fieldsOf, missing, titleOf, type FieldSpec } from "./fields";
import { deleteRow, saveRow } from "./store";
import { useCollection, type Filter, type Row } from "../../data";
import { useTableQuery } from "../../lib/table";

export interface ListFilter {
  key: string;
  label: string;
  options: readonly (readonly [string, string])[];
}

export default function ListPage({
  collection, title, nav, brand, columns, fields, filters = [], search = true,
  searchPlaceholder, rowHref, add = true, remove = true, caption, actions, children,
}: {
  /** The collection this screen lists, as src/data/schema.json names it. */
  collection: string;
  title: string;
  nav: readonly NavGroup[];
  brand?: React.ReactNode;
  /** Replaces the columns derived from the schema. */
  columns?: readonly Column<Row>[];
  /** Replaces the form fields derived from the schema. */
  fields?: readonly FieldSpec[];
  filters?: readonly ListFilter[];
  search?: boolean;
  searchPlaceholder?: string;
  /** Where a row opens. Without it the row does not open anywhere. */
  rowHref?: (row: Row) => string;
  /** False where records are not created here — an orders list. */
  add?: boolean;
  remove?: boolean;
  caption?: string;
  /** Beside Add in the top bar: Export, Import, whatever this list has. */
  actions?: React.ReactNode;
  /** Above the table: a row of <Stat>, a notice, anything this list needs. */
  children?: React.ReactNode;
}) {
  const t = useTableQuery({ size: 20 });
  const specs = fields ?? fieldsOf(collection);
  const where: Record<string, Filter | undefined> = {};
  for (const f of filters) where[f.key] = t.get(f.key);
  const { items, total, pages, page, loading } = useCollection(collection, {
    page: t.page, pageSize: t.size, sort: t.sort, q: t.q, where,
  });

  // The record in the dialog: a row being edited, or a blank one to add.
  const [editing, setEditing] = useState<Row | null>(null);
  const [confirming, setConfirming] = useState<Row | null>(null);
  const open = (row: Row | null) => setEditing(row ?? ({ id: "" } as Row));

  const addButton = add ? <Button kind="primary" icon="plus" onClick={() => open(null)}>Add</Button> : null;

  return (
    <DashboardLayout title={title} nav={nav} brand={brand} actions={<>{actions}{addButton}</>}>
      {children}
      {(search || filters.length > 0) && (
        <TableFilters onClear={t.filtering ? t.clear : undefined}>
          {search && <SearchBox value={t.q} onChange={t.setQ} placeholder={searchPlaceholder} />}
          {filters.map((f) => (
            <FilterSelect
              key={f.key}
              label={f.label}
              value={t.get(f.key)}
              onChange={(v) => t.set(f.key, v)}
              options={f.options}
            />
          ))}
        </TableFilters>
      )}

      <DataTable<Row>
        columns={columns ?? columnsFromFields(specs)}
        rows={items}
        rowKey={(r) => r.id}
        total={total}
        page={page}
        pages={pages}
        size={t.size}
        sort={t.sort}
        onSort={t.toggleSort}
        onPage={t.setPage}
        onSize={t.setSize}
        loading={loading}
        caption={caption ?? title}
        href={rowHref}
        actions={(row) => (
          <RowMenu
            items={[
              { label: "Edit", onClick: () => open(row) },
              ...(remove ? [{ label: "Delete", onClick: () => setConfirming(row), danger: true }] : []),
            ]}
          />
        )}
        empty={
          <Empty
            title={t.filtering ? "Nothing matches those filters" : "Nothing here yet"}
            note={t.filtering ? "Clear a filter to see more." : undefined}
            action={t.filtering
              ? <Button onClick={t.clear}>Clear filters</Button>
              : addButton}
          />
        }
      />

      {/* Keyed on the record, so opening another one starts from ITS values
          and not from what was typed into the last. */}
      <RecordDialog key={editing?.id ?? "closed"} collection={collection} specs={specs} record={editing}
        heading={title} onClose={() => setEditing(null)} />

      <Confirm
        open={confirming !== null}
        onClose={() => setConfirming(null)}
        onConfirm={() => confirming && deleteRow(collection, confirming.id)}
        title={confirming ? `Delete ${titleOf(confirming)}?` : ""}
      />
    </DashboardLayout>
  );
}

/**
 * The add-and-edit dialog. Its own component so that its state — what has
 * been typed, what was refused — belongs to ONE record and is thrown away
 * with it.
 */
function RecordDialog({ collection, specs, record, heading, onClose }: {
  collection: string;
  specs: readonly FieldSpec[];
  /** The row being edited, a row with no id to add one, or null when shut. */
  record: Row | null;
  heading: string;
  onClose: () => void;
}) {
  const adding = !record?.id;
  const [values, setValues] = useState<Record<string, unknown>>(() => (adding ? blank(specs) : { ...record }));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const roomy = specs.length > 5;

  function save() {
    const bad = missing(specs, values);
    if (Object.keys(bad).length > 0) {
      setErrors(bad);
      return;
    }
    saveRow(collection, { ...(record ?? {}), ...values } as Row);
    onClose();
  }

  return (
    <FormDialog
      open={record !== null}
      onClose={onClose}
      wide={roomy}
      title={adding ? `Add to ${heading.toLowerCase()}` : `Edit ${titleOf(record ?? undefined)}`}
      description={adding ? undefined : "Changes show on the site as soon as they are saved."}
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button kind="primary" onClick={save}>{adding ? "Add" : "Save changes"}</Button>
        </>
      }
    >
      <Form fields={specs} values={values} errors={errors} columns={roomy ? 2 : 1}
        onChange={(key, v) => setValues((cur) => ({ ...cur, [key]: v }))} />
    </FormDialog>
  );
}
