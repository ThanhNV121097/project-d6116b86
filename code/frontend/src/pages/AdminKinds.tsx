import { useContent } from "../editable";
import ListPage from "../components/admin/ListPage";
import { useAdminNav } from "./admin-nav";

/** The kinds the shop sorts its products into — a short list, edited in a dialog. */
export default function AdminKinds() {
  const nav = useAdminNav();
  return <ListPage collection="categories" title={useContent("pages.admin.kinds.title")} nav={nav} searchPlaceholder={useContent("pages.admin.products.search")} />;
}
