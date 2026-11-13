import { T, useContent } from "../editable";
import OverviewPage from "../components/admin/OverviewPage";
import AdminLowStock from "../components/AdminLowStock";
import { useCollection } from "../data";
import { formatPrice } from "../lib/format";
import type { Product } from "../lib/shop";
import { useAdminNav } from "./admin-nav";

/**
 * The first screen of the shop's own side: four figures, each opening the
 * list it counts, and under them what is running low — the question the
 * person signing in at nine is actually asking.
 */
export default function AdminOverview() {
  const nav = useAdminNav();
  const products = useCollection<Product>("products", { pageSize: 500 }).items;
  const kinds = useCollection("categories", { pageSize: 1 });
  const low = products.filter((p) => (p.stock ?? 0) < 10);
  const drafts = products.filter((p) => p.status === "draft").length;
  const worth = products.reduce((sum, p) => sum + p.price * (p.stock ?? 0), 0);
  const columns = [
    useContent("pages.admin.overview.col_product"),
    useContent("pages.admin.overview.col_kind"),
    useContent("pages.admin.overview.col_stock"),
  ] as const;
  return (
    <OverviewPage
      title={useContent("pages.admin.overview.title")}
      nav={nav}
      stats={[
        { label: useContent("pages.admin.overview.products"), value: products.length, icon: "tag", to: "/admin/products",
          note: `${drafts} ${useContent("pages.admin.overview.drafts")}` },
        { label: useContent("pages.admin.overview.kinds"), value: kinds.total, icon: "grid", to: "/admin/kinds" },
        { label: useContent("pages.admin.overview.low"), value: low.length, icon: "alert", to: "/admin/products",
          note: useContent("pages.admin.overview.low_note") },
        { label: useContent("pages.admin.overview.worth"), value: formatPrice(worth), icon: "cash",
          note: useContent("pages.admin.overview.worth_note") },
      ]}
      panels={[{
        title: useContent("pages.admin.overview.low_title"),
        content: low.length > 0 ? <AdminLowStock rows={low} labels={columns} /> : <T k="pages.admin.overview.low_none" as="p" className="text-sm text-ink-soft" />,
      }]}
    />
  );
}
