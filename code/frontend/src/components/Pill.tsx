import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import Icon, { type IconName } from "./Icon";

/**
 * THE ACCENT PILL: every call to action on the site. A full-radius button in
 * the lime with the deep green in the heavy capitals, and at its right a
 * white circle holding one glyph — the template's "GET FRESH ›". It leans to
 * the pointer (data-magnetic) on a site that moves.
 *
 * A link when it goes somewhere (`to`), a button when it does something.
 */
export default function Pill({ children, to, onClick, type = "button", disabled = false, testid, glyph = "arrow", className = "" }: {
  children: ReactNode;
  to?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  testid?: string;
  glyph?: IconName;
  className?: string;
}) {
  const cls = `inline-flex items-center gap-3 whitespace-nowrap rounded-full bg-accent py-1.5 pl-6 pr-1.5 font-display text-base uppercase leading-none text-accent-ink transition-opacity hover:opacity-90 disabled:opacity-60 ${className}`;
  const inner = (
    <>
      <span className="py-2">{children}</span>
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ground text-ink"><Icon name={glyph} size={16} /></span>
    </>
  );
  if (to) {
    return <Link to={to} data-testid={testid} data-magnetic="" className={cls}>{inner}</Link>;
  }
  return <button type={type} onClick={onClick} disabled={disabled} data-testid={testid} data-magnetic="" className={cls}>{inner}</button>;
}
