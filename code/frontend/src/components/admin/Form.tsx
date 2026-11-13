/**
 * THE FORM OVER ONE RECORD, WITH A CONTROL THAT FITS EACH FIELD.
 *
 * The same form in the add dialog and on the record page, because they are
 * the same form: a CMS where adding asks for one set of fields and editing
 * another is a CMS nobody can trust.
 *
 * WHAT EACH KIND OF FIELD GETS, and each of these replaced a plain text box:
 *
 *   a choice      a list to choose from — never a box to type "live" into
 *   a picture     the picture, with a button to replace it — never its path
 *   a price       a number with its currency beside it
 *   a list        tags you add and remove — never "S, M, L, XL" as a sentence
 *   yes or no     a switch with its own line of explanation
 *   another record  the other collection's names — never its ids
 *
 * TWO COLUMNS WHERE THE FIELDS ARE SHORT. Twelve fields in one column is two
 * screens of scrolling for a form whose values are mostly one word; a name
 * beside a category and a price beside a stock count is how a person reads a
 * record anyway. Long text, pictures and lists take the full width.
 */
import { useRef, useState } from "react";
import Icon from "../Icon";
import { cn } from "../../lib/cn";
import { siteCurrency } from "../../lib/format";
import { useCollection } from "../../data";
import Choice from "./Choice";
import { Button, Field, Input, Textarea, Toggle } from "./index";
import { text, titleOf, type FieldSpec } from "./fields";

type Change = (value: unknown) => void;
type ControlProps = { spec: FieldSpec; value: unknown; error?: string; onChange: Change };

/** Fields that need the whole row: paragraphs, a picture and its buttons, a
 *  row of tags. */
function wide(spec: FieldSpec): boolean {
  return spec.type === "longtext" || spec.type === "image" || spec.type === "list";
}

/** A field pointing at another collection: that collection's names. */
function RefControl({ spec, value, error, onChange }: ControlProps) {
  const { items } = useCollection(spec.type.slice("ref:".length), { pageSize: 200 });
  return (
    <Field label={spec.label} hint={spec.hint} error={error}>
      <Choice value={text(value)} onChange={onChange} aria-label={spec.label}
        none={spec.required ? undefined : "None"}
        options={items.map((r) => ({ value: r.id, label: titleOf(r) }))} />
    </Field>
  );
}

/**
 * A PICTURE IS CHOSEN BY LOOKING AT IT. The path a picture is stored at is
 * this system's business; on a real run the form offered it to a shop owner
 * as a text field to edit.
 *
 * In the design the chosen file is held in the page's memory as a data URL,
 * which is exactly as persistent as every other write here (store.ts): the
 * backend story gives it an upload behind the same control.
 */
function PictureControl({ spec, value, error, onChange }: ControlProps) {
  const input = useRef<HTMLInputElement>(null);
  const src = text(value);
  const take = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(String(reader.result));
    reader.readAsDataURL(file);
  };
  return (
    <Field label={spec.label} hint={spec.hint} error={error} group>
      <div className="flex items-center gap-4">
        <span className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-line bg-ground text-ink-soft">
          {src ? <img src={src} alt="" className="h-full w-full object-contain" /> : <Icon name="image" size={24} />}
        </span>
        <div className="grid gap-2">
          <div className="flex flex-wrap gap-2">
            <Button type="button" icon="photo" onClick={() => input.current?.click()}>
              {src ? "Replace" : "Choose a picture"}
            </Button>
            {src && <Button type="button" kind="quiet" onClick={() => onChange("")}>Remove</Button>}
          </div>
          <p className="text-xs font-normal text-ink-soft">JPEG, PNG or WebP.</p>
        </div>
        <input ref={input} type="file" accept="image/*" className="sr-only" tabIndex={-1}
          aria-label={`${spec.label} file`} onChange={(e) => take(e.target.files?.[0])} />
      </div>
    </Field>
  );
}

/** A list of short values — sizes, tags — as things you add and remove. */
function TagsControl({ spec, value, error, onChange }: ControlProps) {
  const [draft, setDraft] = useState("");
  const tags = Array.isArray(value)
    ? value.map(String)
    : text(value).split(",").map((s) => s.trim()).filter(Boolean);
  const add = () => {
    const next = draft.trim();
    if (next && !tags.includes(next)) onChange([...tags, next]);
    setDraft("");
  };
  return (
    <Field label={spec.label} hint={spec.hint ?? "Press Enter to add one."} error={error} group>
      <div className="flex min-h-9 flex-wrap items-center gap-1.5 rounded-md border border-field bg-surface px-2 py-1.5 shadow-xs">
        {tags.map((tag) => (
          <span key={tag} className="inline-flex items-center gap-1 rounded-md bg-ground px-2 py-0.5 text-sm font-normal text-ink">
            {tag}
            <button type="button" aria-label={`Remove ${tag}`} className="text-ink-soft hover:text-ink"
              onClick={() => onChange(tags.filter((t) => t !== tag))}>
              <Icon name="close" size={12} />
            </button>
          </span>
        ))}
        <input value={draft} aria-label={`Add to ${spec.label}`}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={add}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(); }
            if (e.key === "Backspace" && draft === "" && tags.length > 0) onChange(tags.slice(0, -1));
          }}
          className="min-w-20 flex-1 bg-transparent text-sm font-normal text-ink outline-none" />
      </div>
    </Field>
  );
}

/** A number of money, with what it is a number OF beside it. */
function PriceControl({ spec, value, error, onChange }: ControlProps) {
  return (
    <Field label={spec.label} hint={spec.hint} error={error}>
      <span className="relative block">
        <Input type="number" inputMode="decimal" min={0} value={text(value)} className="pr-14 tabular-nums"
          onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))} />
        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs font-normal text-ink-soft">
          {siteCurrency()}
        </span>
      </span>
    </Field>
  );
}

/** One control, chosen by what the field is. */
function Control(props: ControlProps) {
  const { spec, value, error, onChange } = props;
  if (spec.type === "bool") {
    return <Toggle checked={Boolean(value)} onChange={onChange} label={spec.label} hint={spec.hint} />;
  }
  if (spec.type.startsWith("ref:")) return <RefControl {...props} />;
  if (spec.type === "image") return <PictureControl {...props} />;
  if (spec.type === "list") return <TagsControl {...props} />;
  if (spec.type === "price") return <PriceControl {...props} />;
  if (spec.options) {
    return (
      <Field label={spec.label} hint={spec.hint} error={error}>
        <Choice value={text(value)} onChange={onChange} aria-label={spec.label}
          options={spec.options.map(([v, label]) => ({ value: v, label }))} />
      </Field>
    );
  }
  if (spec.type === "longtext") {
    return (
      <Field label={spec.label} hint={spec.hint} error={error}>
        <Textarea value={text(value)} onChange={(e) => onChange(e.target.value)} />
      </Field>
    );
  }
  const numeric = spec.type === "number";
  return (
    <Field label={spec.label} hint={spec.hint} error={error}>
      <Input type={numeric ? "number" : spec.type === "url" ? "url" : "text"} value={text(value)}
        className={numeric ? "tabular-nums" : undefined}
        onChange={(e) => onChange(numeric && e.target.value !== "" ? Number(e.target.value) : e.target.value)} />
    </Field>
  );
}

export function Form({ fields, values, errors, onChange, columns = 2 }: {
  fields: readonly FieldSpec[];
  values: Record<string, unknown>;
  errors?: Record<string, string>;
  onChange: (key: string, value: unknown) => void;
  /** 1 for a narrow place — a dialog on a phone decides for itself anyway. */
  columns?: 1 | 2;
}) {
  return (
    <div className={cn("grid gap-x-4 gap-y-5", columns === 2 && "md:grid-cols-2")}>
      {fields.map((f) => (
        <div key={f.key} className={cn(columns === 2 && wide(f) && "md:col-span-2")}>
          <Control spec={f} value={values[f.key]} error={errors?.[f.key]} onChange={(v) => onChange(f.key, v)} />
        </div>
      ))}
    </div>
  );
}
