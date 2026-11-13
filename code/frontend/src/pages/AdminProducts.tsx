import { useContent } from "../editable";
import ListPage from "../components/admin/ListPage";
import { useAdminNav } from "./admin-nav";

/**
 * Every product, as a list to search, filter, add to and edit. The columns
 * and the form come from src/data/schema.json: a field added there appears
 * here.
 */
export default function AdminProducts() {
  const nav = useAdminNav();
  const live = useContent("pages.admin.products.live");
  const draft = useContent("pages.admin.products.draft");
  return (
    <ListPage
      collection="products"
      title={useContent("pages.admin.products.title")}
      nav={nav}
      rowHref={(r) => `/admin/products/${r.id}`}
      searchPlaceholder={useContent("pages.admin.products.search")}
      filters={[{ key: "status", label: useContent("pages.admin.products.status"), options: [["live", live], ["draft", draft]] }]}
    />
  );
}
