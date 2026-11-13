import { useContent } from "../editable";
import SignInPage from "../components/admin/SignInPage";

/** The way into the shop's own side. */
export default function AdminSignIn() {
  return (
    <SignInPage
      title={useContent("pages.admin.signin.title")}
      description={useContent("pages.admin.signin.description")}
      note={useContent("pages.admin.signin.note")}
      brand={useContent("site.name")}
      to="/admin"
    />
  );
}
