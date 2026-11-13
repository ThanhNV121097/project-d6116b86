/**
 * ONE RECORD, OPEN.
 *
 * The other screen of a management area: what the list opens onto. A record
 * with four fields belongs in the list's dialog and never needs this; a
 * record with twenty — a product with its description, its pictures, its
 * price, its stock and its status — needs a page, and the fields group into
 * areas (<Sections>) rather than running down one column for two screenfuls.
 *
 *   export default function Product() {
 *     const { id } = useParams();
 *     return (
 *       <RecordPage collection="products" id={id} nav={ADMIN_NAV}
 *         backTo="/admin/products"
 *         title={useContent("pages.admin.products.title")} />
 *     );
 *   }
 *
 * The fields come from src/data/schema.json; giving a spec a `section` puts
 * it on a tab of that name, and a page that passes none gets one panel.
 *
 * WHAT IT REFUSES TO GUESS: a record the list cannot find. An id that is not
 * there is a link somebody followed after the record was deleted, or a typed
 * address, and a page that draws an empty form for it invites the person to
 * save a new record under an id of their own — so it says so and offers the
 * way back.
 */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout, { type NavGroup } from "../DashboardLayout";
import { Breadcrumb, Button, Confirm, Empty, Notice, PageHeader, Panel, Sections } from "./index";
import { Form } from "./Form";
import { fieldsOf, missing, titleOf, type FieldSpec } from "./fields";
import { deleteRow, saveRow } from "./store";
import { useRecord, type Row } from "../../data";

export default function RecordPage({
  collection, id, nav, title, brand, fields, backTo, remove = true, children,
}: {
  collection: string;
  /** From useParams(). */
  id: string | undefined;
  nav: readonly NavGroup[];
  /** The AREA's name for the top bar — "Products", not this record's name. */
  title: string;
  brand?: React.ReactNode;
  fields?: readonly FieldSpec[];
  /** The list this record belongs to, for the crumb and after a delete. */
  backTo?: string;
  remove?: boolean;
  /** Under the form: related lists, a log, whatever this record has. */
  children?: React.ReactNode;
}) {
  const navigate = useNavigate();
  const { item } = useRecord(collection, id);
  const specs = fields ?? fieldsOf(collection);
  const [values, setValues] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const [confirming, setConfirming] = useState(false);

  // The record arrives from the store; it changes when another screen edits
  // it, and the form follows it rather than holding a stale copy.
  useEffect(() => {
    if (item) setValues({ ...item });
  }, [item]);

  function save() {
    const bad = missing(specs, values);
    setErrors(bad);
    if (Object.keys(bad).length > 0) {
      setSaved(false);
      return;
    }
    saveRow(collection, { ...(item ?? ({ id: id ?? "" } as Row)), ...values } as Row);
    setSaved(true);
  }

  function destroy() {
    if (item) deleteRow(collection, item.id);
    // Two calls, not navigate(backTo ?? -1): the router's delta overload
    // takes a number and its address overload a string, never a union.
    if (backTo) navigate(backTo);
    else navigate(-1);
  }

  const change = (key: string, v: unknown) => {
    setValues((cur) => ({ ...cur, [key]: v }));
    setSaved(false);
  };

  // The sections the fields ask for, in the order they first appear.
  const areas: string[] = [];
  for (const f of specs) {
    const area = f.section ?? "";
    if (area && !areas.includes(area)) areas.push(area);
  }

  const form = areas.length > 0
    ? (
      <Sections
        tabs={areas.map((area) => ({
          label: area,
          content: (
            <Form fields={specs.filter((f) => (f.section ?? "") === area)}
              values={values} errors={errors} onChange={change} />
          ),
        }))}
      />
    )
    : <Form fields={specs} values={values} errors={errors} onChange={change} />;

  return (
    <DashboardLayout title={title} nav={nav} brand={brand}>
      {backTo && <Breadcrumb trail={[{ label: title, to: backTo }, { label: titleOf(item) }]} />}
      {!item
        ? (
          <Empty
            title="This record is not here"
            note="It may have been deleted since the link was made."
            action={backTo ? <Button onClick={() => navigate(backTo)}>Back to the list</Button> : undefined}
          />
        )
        : (
          <>
            <PageHeader
              title={titleOf(item)}
              actions={
                <>
                  {remove && <Button kind="quiet" icon="remove" onClick={() => setConfirming(true)}>Delete</Button>}
                  <Button kind="primary" icon="check" onClick={save}>Save changes</Button>
                </>
              }
            />
            {saved && <Notice tone="done" onClose={() => setSaved(false)}>Saved.</Notice>}
            <Panel>{form}</Panel>
            {children}
            <Confirm
              open={confirming}
              onClose={() => setConfirming(false)}
              onConfirm={destroy}
              title={`Delete ${titleOf(item)}?`}
            />
          </>
        )}
    </DashboardLayout>
  );
}
