/**
 * THE MANAGEMENT AREA'S PARTS, ON SHADCN/UI.
 *
 * Every CMS this product builds needs the same dozen things: a page header
 * with its actions, a panel, a field, a button that means something, a
 * status, a dialog to add a record in, a row menu, tabs, a message when a
 * list is empty. They ship, so a design turn ASSEMBLES a management area and
 * does not draw one.
 *
 * WHAT THEY ARE MADE OF. The first version of this file was hand-written
 * over Headless UI, and what came out of it on a real run was a form of
 * twelve identical grey boxes: correct, accessible, and looking like nobody
 * had designed it — which was true. These are thin names over
 * src/components/ui, which is shadcn/ui (MIT) taken by
 * scripts/vendor-shadcn.py: Radix for the behaviour — focus trap, scroll
 * lock, roving focus, typeahead — and a look thousands of dashboards already
 * share, so a person who has used one finds this one where they left it.
 *
 * Tailwind Plus and its Catalyst kit are NOT here and cannot be: their
 * licence names a website builder as a use it does not permit, and this
 * product is one.
 *
 * THE NAMES STAYED. PageHeader, Panel, Field and the rest are what the design
 * brief and the review already call these, and a page written against the
 * first version of this file still compiles.
 *
 * COLOURS COME FROM [data-dashboard] in theme.css: nothing here names one.
 * Every part paints with ground, surface, ink, ink-soft, accent, line and
 * danger, which that scope re-points at a neutral working palette — and the
 * parts Radix renders through a portal carry the scope themselves, because a
 * portal leaves the element that set it.
 */
import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import Icon, { type IconName } from "../Icon";
import { cn } from "../../lib/cn";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "../ui/alert-dialog";
import { Badge as UiBadge } from "../ui/badge";
import {
  Breadcrumb as UiBreadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { Button as UiButton } from "../ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input as UiInput } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Textarea as UiTextarea } from "../ui/textarea";

/** The top of a management page: what it is, and what you can do here. */
export function PageHeader({ title, count, actions }: {
  title: string; count?: string; actions?: ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        <h2 className="truncate font-body text-2xl font-semibold tracking-tight text-ink">{title}</h2>
        {count && <p className="mt-1 text-sm text-ink-soft">{count}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  );
}

/** A box of related things. */
export function Panel({ title, description, children, footer, className }: {
  title?: string; description?: string; children: ReactNode; footer?: ReactNode; className?: string;
}) {
  return (
    <Card className={cn("gap-4 py-5 shadow-xs", className)}>
      {(title || description) && (
        <CardHeader className="px-5">
          {title && <CardTitle className="font-body text-base">{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent className="px-5">{children}</CardContent>
      {footer && <CardFooter className="border-t border-line px-5 pt-4">{footer}</CardFooter>}
    </Card>
  );
}

type ButtonKind = "primary" | "default" | "danger" | "quiet";

/**
 * THREE KINDS AND A QUIET ONE, because a management screen with five kinds of
 * button has told the person nothing about which one matters. `danger` is a
 * colour now — it used to draw exactly as `default` did, because the palette
 * had no colour for it, and a Delete that looks like a Cancel is how a row is
 * lost.
 */
export function Button({ kind = "default", icon, children, className, ...rest }: {
  kind?: ButtonKind; icon?: IconName; children?: ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const variant = { primary: "default", default: "outline", danger: "destructive", quiet: "ghost" }[kind] as
    "default" | "outline" | "destructive" | "ghost";
  return (
    <UiButton variant={variant} size="sm" className={className} {...rest}>
      {icon && <Icon name={icon} size={16} />}
      {children}
    </UiButton>
  );
}

/**
 * A FIELD IS ITS LABEL, ITS CONTROL AND WHAT WENT WRONG. A control without a
 * label is the commonest thing a hand-written admin form gets wrong, and the
 * one a person filling it in cannot work around.
 */
export function Field({ label, hint, error, children, className, group }: {
  label: string; hint?: string; error?: string; children: ReactNode; className?: string;
  /** For a control made of several — a picture with its buttons, a row of
   *  tags. A <label> around more than one control sends a click on the words
   *  to whichever comes first, so those are named as a group instead. */
  group?: boolean;
}) {
  return (
    <div className={cn("grid gap-2", className)} data-invalid={error ? "true" : undefined}>
      {group ? (
        <div role="group" aria-label={label} className="grid gap-2 text-sm">
          <span className="font-medium leading-none text-ink">{label}</span>
          {children}
        </div>
      ) : (
        // A <label> around the control, so a click on the words reaches it
        // without an id having to be threaded through every caller.
        <Label className="grid gap-2 font-medium text-ink">
          <span>{label}</span>
          {children}
        </Label>
      )}
      {hint && !error && <p className="text-xs text-ink-soft">{hint}</p>}
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <UiInput {...props} className={cn("bg-surface font-normal", props.className)} />;
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <UiTextarea rows={props.rows ?? 4} {...props} className={cn("bg-surface font-normal", props.className)} />;
}

/** Long text a person wrote — a description, a policy — set with Tailwind's
 *  own typography plugin rather than a pile of spacing utilities. */
export function Prose({ children }: { children: ReactNode }) {
  return <div className="prose prose-sm max-w-none text-ink">{children}</div>;
}

export type Tone = "neutral" | "good" | "warn" | "off" | "danger";

/** A state as a word with a mark, never a bare colour: a colour alone is
 *  unreadable to anyone who cannot tell two of them apart. */
export function Badge({ tone = "neutral", children }: { tone?: Tone; children: ReactNode }) {
  const dot: Record<Tone, string> = {
    neutral: "bg-ink-soft", good: "bg-accent", warn: "bg-ink", off: "bg-line", danger: "bg-danger",
  };
  return (
    <UiBadge variant="outline" className="gap-1.5 bg-surface font-normal text-ink">
      <i className={cn("size-1.5 rounded-full", dot[tone])} aria-hidden="true" />
      {children}
    </UiBadge>
  );
}

/**
 * ADDING AND EDITING HAPPEN IN A DIALOG, not on another page: the person is
 * in the middle of a list and should come back to the row they were on.
 */
export function FormDialog({ open, onClose, title, description, children, footer, wide }: {
  open: boolean; onClose: () => void; title: string; description?: string;
  children: ReactNode; footer?: ReactNode; wide?: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={(next) => { if (!next) onClose(); }}>
      <DialogContent className={cn("max-h-[90vh] gap-0 overflow-hidden p-0", wide ? "sm:max-w-2xl" : "sm:max-w-lg")}>
        <DialogHeader className="border-b border-line px-6 py-4">
          <DialogTitle className="font-body">{title}</DialogTitle>
          {/* Always present: Radix warns, and a screen reader announces
              nothing, for a dialog that describes itself with no words. */}
          <DialogDescription className={description ? "" : "sr-only"}>{description ?? title}</DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto px-6 py-5">{children}</div>
        {footer && <DialogFooter className="border-t border-line bg-ground px-6 py-3">{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
}

/** The actions on a row, behind one button, so a table of twenty rows is not
 *  a table of sixty buttons. What destroys something sits last, under a
 *  rule, in the colour that says so. */
export function RowMenu({ items }: {
  items: { label: string; onClick: () => void; danger?: boolean }[];
}) {
  const safe = items.filter((i) => !i.danger);
  const risky = items.filter((i) => i.danger);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <UiButton variant="ghost" size="icon-sm" aria-label="Actions" className="text-ink-soft">
          <Icon name="more" size={16} />
        </UiButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-36">
        {safe.map((it) => (
          <DropdownMenuItem key={it.label} onSelect={it.onClick}>{it.label}</DropdownMenuItem>
        ))}
        {safe.length > 0 && risky.length > 0 && <DropdownMenuSeparator />}
        {risky.map((it) => (
          <DropdownMenuItem key={it.label} variant="destructive" onSelect={it.onClick}>{it.label}</DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** On or off, said as a control rather than as a checkbox nobody notices. */
export function Toggle({ checked, onChange, label, hint }: {
  checked: boolean; onChange: (v: boolean) => void; label: string; hint?: string;
}) {
  return (
    <Label className="flex items-center justify-between gap-4 rounded-md border border-line bg-surface px-3 py-2.5 font-normal">
      <span className="grid gap-0.5">
        <span className="font-medium text-ink">{label}</span>
        {hint && <span className="text-xs text-ink-soft">{hint}</span>}
      </span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </Label>
  );
}

/** Areas of one record, when it has more than one screenful. */
export function Sections({ tabs }: { tabs: { label: string; content: ReactNode }[] }) {
  if (tabs.length === 0) return null;
  return (
    <Tabs defaultValue={tabs[0].label} className="gap-4">
      <TabsList>
        {tabs.map((t) => <TabsTrigger key={t.label} value={t.label}>{t.label}</TabsTrigger>)}
      </TabsList>
      {tabs.map((t) => <TabsContent key={t.label} value={t.label}>{t.content}</TabsContent>)}
    </Tabs>
  );
}

/**
 * THE SCREEN A NEW ACCOUNT ACTUALLY SEES FIRST. A list with nothing in it is
 * the one state every admin area has on its first day and the one no design
 * turn remembers to draw, so it ships as a blank panel that reads as broken.
 */
export function Empty({ title, note, action, icon = "package" }: {
  title: string; note?: string; action?: ReactNode; icon?: IconName;
}) {
  return (
    <div className="flex flex-col items-center rounded-lg border border-dashed border-line px-6 py-12 text-center">
      <span className="flex size-10 items-center justify-center rounded-md bg-ground text-ink-soft">
        <Icon name={icon} size={20} />
      </span>
      <p className="mt-4 text-sm font-medium text-ink">{title}</p>
      {note && <p className="mt-1 max-w-sm text-sm text-ink-soft">{note}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

/**
 * A FIGURE AT THE TOP OF AN OVERVIEW. The first screen of a management area
 * answers "what is waiting for me" before it shows a table, and that answer
 * is four numbers: the label small above, the number large, and anything that
 * explains it under — in that order, because the person is scanning four of
 * these and reading none of them.
 */
export function Stat({ label, value, note, icon, to }: {
  label: string; value: ReactNode; note?: string; icon?: IconName; to?: string;
}) {
  const card = (
    <Card className={cn("gap-2 py-5 shadow-xs", to && "transition-colors hover:bg-ground")}>
      <CardHeader className="px-5">
        <CardDescription>{label}</CardDescription>
        <CardTitle className="font-body text-2xl font-semibold tabular-nums">{value}</CardTitle>
        {icon && <CardAction className="text-ink-soft"><Icon name={icon} size={16} /></CardAction>}
      </CardHeader>
      {note && <CardFooter className="px-5 text-sm text-ink-soft">{note}</CardFooter>}
    </Card>
  );
  return to ? <Link to={to} className="block rounded-xl">{card}</Link> : card;
}

/** Where you are, when a record sits under a list. The last one is the page
 *  itself and is not a link, because a link to here does nothing. */
export function Breadcrumb({ trail }: { trail: readonly { label: string; to?: string }[] }) {
  return (
    <UiBreadcrumb>
      <BreadcrumbList>
        {trail.map((step, i) => {
          const last = i === trail.length - 1;
          return (
            <span key={`${step.label}-${i}`} className="contents">
              {i > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {step.to && !last
                  ? <BreadcrumbLink asChild><Link to={step.to}>{step.label}</Link></BreadcrumbLink>
                  : <BreadcrumbPage>{step.label}</BreadcrumbPage>}
              </BreadcrumbItem>
            </span>
          );
        })}
      </BreadcrumbList>
    </UiBreadcrumb>
  );
}

/**
 * ASKING BEFORE SOMETHING IS GONE. Deleting is the one action in a CMS that
 * cannot be undone by doing it again, and a row menu puts it one click from
 * Edit. So it asks, and the question names the record — "Delete Trà sen Tây
 * Hồ?" — because "Are you sure?" is a question about nothing and a person
 * who has clicked it twice stops reading it.
 */
export function Confirm({ open, onClose, onConfirm, title, note, verb }: {
  open: boolean; onClose: () => void; onConfirm: () => void;
  title: string; note?: string; verb?: string;
}) {
  return (
    <AlertDialog open={open} onOpenChange={(next) => { if (!next) onClose(); }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="font-body">{title}</AlertDialogTitle>
          <AlertDialogDescription>{note ?? "This cannot be undone."}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={onConfirm}>{verb ?? "Delete"}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/**
 * WHAT JUST HAPPENED, WHERE IT HAPPENED. A save with no answer leaves the
 * person pressing the button again. This sits above the thing it is about
 * and stays until the next action.
 */
export function Notice({ tone = "info", children, onClose }: {
  tone?: "info" | "done" | "alert"; children: ReactNode; onClose?: () => void;
}) {
  const mark: Record<string, IconName> = { info: "info", done: "done", alert: "alert" };
  return (
    <div role="status"
      className={cn("flex items-start gap-2 rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink",
        tone === "alert" && "border-danger/40 text-danger")}>
      <Icon name={mark[tone]} size={16} className={cn("mt-0.5", tone === "alert" ? "text-danger" : "text-accent")} />
      <div className="flex-1">{children}</div>
      {onClose && (
        <button type="button" onClick={onClose} aria-label="Dismiss" className="text-ink-soft hover:text-ink">
          <Icon name="close" size={14} />
        </button>
      )}
    </div>
  );
}
