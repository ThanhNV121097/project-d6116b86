import { type ReactNode } from "react";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import ContactDock from "./components/ContactDock";
import { Motion } from "./motion";
import { T } from "./editable";
import SiteFooter from "./components/SiteFooter";
import SiteHeader from "./components/SiteHeader";
import { useSession } from "./lib/session";
import AdminKinds from "./pages/AdminKinds";
import AdminOverview from "./pages/AdminOverview";
import AdminProduct from "./pages/AdminProduct";
import AdminProducts from "./pages/AdminProducts";
import AdminSignIn from "./pages/AdminSignIn";
import Bag from "./pages/Bag";
import Checkout from "./pages/Checkout";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import Order from "./pages/Order";
import Product from "./pages/Product";
import Shop from "./pages/Shop";

/**
 * Two sites in one address: the shop a customer visits, and the side the
 * shop runs itself from.
 *
 * They do not share a shell. A customer's page sits under the lime strip and
 * above the footer; a management page sits in <DashboardLayout>, which each
 * of them brings with it. So the shop's routes are children of one layout
 * route and the management routes are not.
 *
 * THE HOME PAGE DRAWS ITS OWN HEADER. There the header is a bar of glass
 * lying across the top of the hero photograph, so the hero places it
 * (pages/Home.tsx); on every other page it is the same bar on white.
 */
function Shell() {
  const home = useLocation().pathname === "/";
  return (
    <div className="min-h-screen overflow-x-clip bg-ground font-body text-ink">
      {/* The motion the owner chose, on every page (src/motion). */}
      <Motion />
      {/* THE STRIP: one line of promise in the accent, above everything. */}
      <T k="strip" as="p" className="bg-accent px-4 py-2 text-center text-xs font-medium uppercase tracking-wide text-accent-ink" />
      {!home && <SiteHeader />}
      <main className="mx-auto max-w-page px-[var(--gutter)]"><Outlet /></main>
      <SiteFooter />
      <ContactDock />
    </div>
  );
}

/**
 * The management area's door. Through the scaffold's own session
 * (src/lib/session.ts) and nothing else: the Studio and the walk sign a
 * visitor in by writing THAT session, and a page gated on any other is drawn
 * and walked signed out.
 */
function SignedIn({ children }: { children: ReactNode }) {
  return useSession() ? <>{children}</> : <Navigate to="/admin/sign-in" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route element={<Shell />}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/shop/:id" element={<Product />} />
        <Route path="/bag" element={<Bag />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order" element={<Order />} />
        <Route path="/contact" element={<Contact />} />
      </Route>
      <Route path="/admin/sign-in" element={<AdminSignIn />} />
      <Route path="/admin" element={<SignedIn><AdminOverview /></SignedIn>} />
      <Route path="/admin/products" element={<SignedIn><AdminProducts /></SignedIn>} />
      <Route path="/admin/products/:id" element={<SignedIn><AdminProduct /></SignedIn>} />
      <Route path="/admin/kinds" element={<SignedIn><AdminKinds /></SignedIn>} />
    </Routes>
  );
}
