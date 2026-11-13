import { useParams } from "react-router-dom";
import { useContent } from "../editable";
import RecordPage from "../components/admin/RecordPage";
import { useAdminNav } from "./admin-nav";

/** One product, open: its fields on the tabs src/data/schema.json gives them. */
export default function AdminProduct() {
  const { id } = useParams();
  const nav = useAdminNav();
  return (
    <RecordPage collection="products" id={id} nav={nav} backTo="/admin/products"
      title={useContent("pages.admin.products.title")} />
  );
}
