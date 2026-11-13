import { useContent } from "../editable";
import type { NavGroup } from "../components/DashboardLayout";

/**
 * The management area's menu, once, for every page of it. A hook rather than
 * a constant so its words come out of content.json like every other word on
 * the site: the owner renames "Kinds" to "Collections" in the Studio and
 * every page's menu follows.
 */
export function useAdminNav(): NavGroup[] {
  return [
    { items: [{ to: "/admin", label: useContent("pages.admin.nav.overview") }] },
    {
      heading: useContent("pages.admin.nav.catalogue"),
      items: [
        { to: "/admin/products", label: useContent("pages.admin.nav.products") },
        { to: "/admin/kinds", label: useContent("pages.admin.nav.kinds") },
      ],
    },
  ];
}
