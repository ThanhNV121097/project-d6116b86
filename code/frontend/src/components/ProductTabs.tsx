import { type ReactNode } from "react";
import { Tabs } from "radix-ui";

/**
 * The longer things about one record, behind tabs: the description, the
 * care, delivery and returns, the reviews.
 *
 * They belong on the page — they are what turns a picture and a price into
 * a decision — and they do not belong in one column down it, where the third
 * of them is two screens below the button. Tabs keep all of them one click
 * from the first screen.
 *
 *   <ProductTabs tabs={[
 *     { label: <T k="pages.product.tabs.about" />, content: <p>{shirt.description}</p> },
 *     { label: <T k="pages.product.tabs.care" />, content: shirt.care && <p>{shirt.care}</p> },
 *   ]} />
 *
 * A tab with nothing in it is left out, and one tab alone is drawn as its
 * content with no tab bar: the part never shows a heading over nothing.
 * Radix carries the arrow keys and the roles.
 */
export default function ProductTabs({ tabs, className = "" }: {
  tabs: readonly { label: ReactNode; content: ReactNode }[];
  className?: string;
}) {
  const shown = tabs.filter((t) => t.content !== null && t.content !== undefined && t.content !== false && t.content !== "");
  if (shown.length === 0) return null;
  if (shown.length === 1) {
    return <div data-block="details" className={`text-ink ${className}`}>{shown[0].content}</div>;
  }
  return (
    <Tabs.Root data-block="details" defaultValue="tab-0" className={className}>
      <Tabs.List className="flex flex-wrap gap-x-8 gap-y-2 border-b border-line">
        {shown.map((t, i) => (
          <Tabs.Trigger
            key={i}
            value={`tab-${i}`}
            className="-mb-px border-b-2 border-transparent pb-3 text-sm text-ink-soft outline-none hover:text-ink focus-visible:text-ink data-[state=active]:border-ink data-[state=active]:text-ink"
          >
            {t.label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      {shown.map((t, i) => (
        <Tabs.Content key={i} value={`tab-${i}`} className="max-w-[68ch] pt-6 text-ink outline-none">
          {t.content}
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
}
