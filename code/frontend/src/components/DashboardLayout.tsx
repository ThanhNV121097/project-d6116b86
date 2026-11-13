import { type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { allowed, signOut, useSession } from "../lib/session";
import { useContent } from "../editable";
import Icon from "./Icon";
import { Separator } from "./ui/separator";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader,
  SidebarInset, SidebarMenu, SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger,
} from "./ui/sidebar";

/**
 * The shell every page of a CMS sits in: a menu down the left, the work on
 * the right.
 *
 * A dashboard is not a page of the website with a table on it. The person in
 * it is working, not visiting: they move between areas all day, so the areas
 * are always on the screen; they read rows, so the content is dense; they
 * never want a hero, a marketing header or a footer of links to the blog.
 *
 *   <DashboardLayout
 *     title="Products"
 *     nav={[
 *       { heading: "Selling", items: [
 *         { to: "/supplier/products", label: "Products" },
 *         { to: "/supplier/calendar", label: "Dates & places" },
 *       ]},
 *       { heading: "Money", items: [{ to: "/supplier/payouts", label: "Payouts" }] },
 *       { items: [{ to: "/admin/queue", label: "Awaiting review", roles: ["admin"] }] },
 *     ]}
 *     actions={<button className="…">New product</button>}
 *   >
 *     …filters and the table…
 *   </DashboardLayout>
 *
 * An item with `roles` is shown only to those roles — a supplier never sees
 * the admin's queue in the menu. Hiding it is not the gate: the PAGE is
 * gated with <RequireRole>, because a menu the eye cannot see is still a URL
 * anyone can type.
 *
 * WHAT DRAWS IT. shadcn/ui's Sidebar (src/components/ui/sidebar.tsx): the
 * menu a person who has used any current dashboard already knows — grouped,
 * the place you are filled in, collapsing behind one button, a sheet from the
 * left on a phone, ⌘B to fold it. The first version of this file drew its
 * own, correctly, and it looked like what it was.
 *
 * The menu is a real <nav> down the left on purpose: the walk finds a
 * management page's menu by WHERE it is and what element it is
 * (dashboard-shell), not by a class name.
 */
export interface NavItem {
  to: string;
  label: string;
  /** A count beside the item — things waiting, unread. */
  badge?: number;
  /** Which roles see it. Everyone signed in when not given. */
  roles?: readonly string[];
}

export interface NavGroup {
  heading?: string;
  items: readonly NavItem[];
}

export default function DashboardLayout({ title, nav, actions, children, brand }: {
  title: string;
  nav: readonly NavGroup[];
  /** The buttons for this page — "New product", "Export". */
  actions?: ReactNode;
  children: ReactNode;
  /** What stands at the top of the menu. The site's name when not given. */
  brand?: ReactNode;
}) {
  const session = useSession();
  const siteName = useContent("site.name");
  const { pathname } = useLocation();

  const groups = nav
    .map((g) => ({ ...g, items: g.items.filter((i) => allowed(session, i.roles) || !i.roles) }))
    .filter((g) => g.items.length > 0);
  const all = groups.flatMap((g) => g.items);

  // WHERE YOU ARE, AND ONLY THERE. An item is lit for its own address and
  // for the pages under it — "/admin/products" on "/admin/products/42" —
  // unless another item lives under it, in which case only its own address
  // counts. Without that second half "/admin" stayed lit on every page of
  // the area and the menu showed two places at once (measured on run
  // bd4d1058: Overview and Products both filled).
  const here = (item: NavItem) => {
    const base = item.to.replace(/\/$/, "");
    if (pathname === base || pathname === item.to) return true;
    const parentOfAnother = all.some((o) => o.to !== item.to && o.to.startsWith(base + "/"));
    return !parentOfAnother && pathname.startsWith(base + "/");
  };

  return (
    <SidebarProvider data-dashboard="true" className="bg-ground font-body text-ink">
      <Sidebar collapsible="offcanvas">
        <SidebarHeader>
          <div className="flex h-8 items-center gap-2 px-2 text-sm font-semibold text-ink">{brand ?? siteName}</div>
        </SidebarHeader>
        <SidebarContent>
          <nav aria-label="Sections" className="flex min-h-0 flex-1 flex-col gap-2">
            {groups.map((g, i) => (
              <SidebarGroup key={g.heading ?? `group-${i}`}>
                {g.heading && <SidebarGroupLabel>{g.heading}</SidebarGroupLabel>}
                <SidebarGroupContent>
                  <SidebarMenu>
                    {g.items.map((item) => (
                      <SidebarMenuItem key={item.to}>
                        <SidebarMenuButton asChild isActive={here(item)}>
                          <Link to={item.to} aria-current={here(item) ? "page" : undefined}>
                            <span>{item.label}</span>
                          </Link>
                        </SidebarMenuButton>
                        {item.badge ? <SidebarMenuBadge>{item.badge}</SidebarMenuBadge> : null}
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </nav>
        </SidebarContent>
        {session && (
          <SidebarFooter>
            <div className="flex items-center gap-2 rounded-md px-2 py-1.5">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-ground text-xs font-semibold text-ink">
                {session.name.slice(0, 1).toUpperCase()}
              </span>
              <span className="grid min-w-0 flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium text-ink">{session.name}</span>
                <span className="truncate text-xs text-ink-soft">{session.role || session.email}</span>
              </span>
              <button type="button" onClick={signOut} aria-label="Sign out"
                className="rounded-md p-1.5 text-ink-soft hover:bg-ground hover:text-ink">
                <Icon name="logout" size={16} />
              </button>
            </div>
          </SidebarFooter>
        )}
      </Sidebar>

      <SidebarInset className="min-w-0 bg-ground">
        <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b border-line bg-surface px-4 lg:px-6">
          <SidebarTrigger className="-ml-1 text-ink-soft" />
          <Separator orientation="vertical" className="mx-1 data-[orientation=vertical]:h-4" />
          <h1 className="min-w-0 flex-1 truncate font-body text-base font-medium tracking-normal text-ink">{title}</h1>
          <div className="flex items-center gap-2">{actions}</div>
        </header>
        <main className="flex min-w-0 flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
