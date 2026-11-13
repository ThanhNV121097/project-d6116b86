import { useContent } from "../editable";
import OverviewPage from "../components/admin/OverviewPage";
import { useCollection } from "../data";
import type { Product } from "../lib/shop";
import { useAdminNav } from "./admin-nav";

/**
 * The first screen of the shop's own side: how many juices there are and how
 * many are still drafts, the kinds they are sorted into, and how many ways to
 * pay checkout offers — each figure opening the list it counts.
 */
export default function AdminOverview() {
  const nav = useAdminNav();
  const products = useCollection<Product>("products", { pageSize: 500 }).items;
  const kinds = useCollection("categories", { pageSize: 1 });
  const methods = useCollection("payment_methods", { pageSize: 1 });
  const drafts = products.filter((p) => p.status === "draft").length;
  return (
    <OverviewPage
      title={useContent("pages.admin.overview.title")}
      nav={nav}
      stats={[
        { label: useContent("pages.admin.overview.products"), value: products.length, icon: "tag", to: "/admin/products",
          note: `${drafts} ${useContent("pages.admin.overview.drafts")}` },
        { label: useContent("pages.admin.overview.live"), value: products.length - drafts, icon: "check", to: "/admin/products",
          note: useContent("pages.admin.overview.live_note") },
        { label: useContent("pages.admin.overview.kinds"), value: kinds.total, icon: "grid", to: "/admin/kinds",
          note: useContent("pages.admin.overview.kinds_note") },
        { label: useContent("pages.admin.overview.payments"), value: methods.total, icon: "card",
          note: useContent("pages.admin.overview.payments_note") },
      ]}
    />
  );
}
