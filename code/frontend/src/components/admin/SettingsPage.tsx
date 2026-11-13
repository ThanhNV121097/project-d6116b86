/**
 * THE SCREEN THAT IS ONE FORM AND NO RECORD.
 *
 * Settings, the business's own details, opening hours, who gets the emails.
 * It is a record page over nothing: the same fields, the same controls, the
 * same Save — so it is the same <Form>, grouped into panels instead of tabs,
 * because settings are read by scanning headings and a tab hides half of
 * them behind a click.
 *
 *   <SettingsPage title={…} nav={ADMIN_NAV}
 *     groups={[
 *       { title: …, fields: [
 *         { key: "name", label: …, type: "text", required: true },
 *         { key: "orders_email", label: …, type: "text" },
 *       ]},
 *       { title: …, fields: [{ key: "open", label: …, type: "bool" }] },
 *     ]}
 *     values={settings} onSave={…}
 *   />
 *
 * WHAT A DESIGN'S SAVE DOES: it holds the values on the screen and says so.
 * There is no settings table in a design and inventing one would be a second
 * store beside src/data; the backend story gives this page a real endpoint
 * and `onSave` is where it lands, with nothing else here changing.
 */
import { useState } from "react";
import DashboardLayout, { type NavGroup } from "../DashboardLayout";
import { Button, Notice, Panel } from "./index";
import { Form } from "./Form";
import { missing, type FieldSpec } from "./fields";

export default function SettingsPage({ title, nav, brand, groups, values, onSave, children }: {
  title: string;
  nav: readonly NavGroup[];
  brand?: React.ReactNode;
  groups: readonly { title?: string; description?: string; fields: readonly FieldSpec[] }[];
  /** What the fields start as. */
  values?: Record<string, unknown>;
  /** Where a real save goes. Without it the values stay on the screen. */
  onSave?: (values: Record<string, unknown>) => void;
  children?: React.ReactNode;
}) {
  const [current, setCurrent] = useState<Record<string, unknown>>(values ?? {});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const all = groups.flatMap((g) => g.fields);

  function save() {
    const bad = missing(all, current);
    setErrors(bad);
    if (Object.keys(bad).length > 0) {
      setSaved(false);
      return;
    }
    onSave?.(current);
    setSaved(true);
  }

  return (
    <DashboardLayout
      title={title}
      nav={nav}
      brand={brand}
      actions={<Button kind="primary" icon="check" onClick={save}>Save changes</Button>}
    >
      {saved && <Notice tone="done" onClose={() => setSaved(false)}>Saved.</Notice>}
      {groups.map((g, i) => (
        <Panel key={g.title ?? `group-${i}`} title={g.title} description={g.description} className="max-w-3xl">
          <Form
            fields={g.fields}
            values={current}
            errors={errors}
            onChange={(key, v) => {
              setCurrent((cur) => ({ ...cur, [key]: v }));
              setSaved(false);
            }}
          />
        </Panel>
      ))}
      {children}
    </DashboardLayout>
  );
}
