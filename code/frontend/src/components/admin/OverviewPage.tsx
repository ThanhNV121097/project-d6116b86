/**
 * THE FIRST SCREEN OF A MANAGEMENT AREA.
 *
 * Not a table. The person signing in at nine in the morning is asking one
 * question — what needs me today — and a list of every product sorted by
 * name does not answer it. So: the figures across the top, each one a link
 * to the list it counts, and under them the few rows that are actually
 * waiting.
 *
 *   <OverviewPage title={…} nav={ADMIN_NAV}
 *     stats={[
 *       { label: …, value: orders.total, to: "/admin/orders" },
 *       { label: …, value: formatPrice(month), note: … },
 *     ]}
 *     panels={[{ title: …, content: <DataTable … /> }]}
 *   />
 *
 * FOUR FIGURES, AND THE COUNT IS THE POINT. A row of eight is a row nobody
 * reads; the grid holds four across a laptop, two on a tablet, one on a
 * phone, so a fifth and sixth sit under the first four rather than squeezing
 * all six into a line of unreadable numbers.
 */
import DashboardLayout, { type NavGroup } from "../DashboardLayout";
import { Panel, Stat } from "./index";
import type { IconName } from "../Icon";

export interface StatSpec {
  label: string;
  value: React.ReactNode;
  note?: string;
  icon?: IconName;
  /** The list this figure counts. A figure you cannot open is a dead end. */
  to?: string;
}

export default function OverviewPage({ title, nav, brand, stats, panels = [], actions, children }: {
  title: string;
  nav: readonly NavGroup[];
  brand?: React.ReactNode;
  stats: readonly StatSpec[];
  /** What is waiting: a short table, a list of recent things. */
  panels?: readonly { title: string; content: React.ReactNode }[];
  actions?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <DashboardLayout title={title} nav={nav} brand={brand} actions={actions}>
      {stats.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <Stat key={s.label} label={s.label} value={s.value} note={s.note} icon={s.icon} to={s.to} />
          ))}
        </div>
      )}
      {panels.map((p) => (
        <Panel key={p.title} title={p.title}>{p.content}</Panel>
      ))}
      {children}
    </DashboardLayout>
  );
}
