/**
 * THE WAY INTO THE MANAGEMENT AREA.
 *
 * Every CMS needs one and no two of them differ: an address, a password, one
 * button. It is also the screen a design turn is most likely to get subtly
 * wrong at the end of a long build — a form that is not a <form> (so Enter
 * does nothing), a password field that is a text field, an area whose pages
 * are gated while the door into them is not.
 *
 *   <Route path="/admin/sign-in" element={
 *     <SignInPage title={useContent("pages.admin.signin.title")} to="/admin" />
 *   } />
 *
 * TWO PIECES, BECAUSE THE FIRST VERSION WAS ONE AND COULD NOT BE PLACED.
 * SignInPage owns the whole screen — a card in the middle of it, the
 * management palette round it. A design that wanted its own photograph down
 * one side had nothing to put there but the whole screen again: on run
 * bd4d1058 it nested SignInPage, min-h-screen and all, inside a column of its
 * own layout. So the form is its own part:
 *
 *   <SignInForm to="/admin" />          the form alone, wherever you put it
 *   <SignInPage title=… to="/admin" />  the whole screen, for when you do not
 *
 * WHOSE SIGN-IN IT IS. Where more than one kind of person signs in, `roles`
 * draws the choice and the session carries it, which is what <RequireRole>
 * and design/pages.json's "roles" read.
 *
 * IT IS THE MOCK SESSION (src/lib/session.ts), as the whole design is: no
 * password is checked, because there is nothing yet to check one against.
 * The backend story replaces that one module behind the same three names.
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Choice from "./Choice";
import { Button, Field, Input } from "./index";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { signIn, useSession } from "../../lib/session";

/** The form alone: no card, no screen. Carries the management palette with
 *  it, so it is right wherever a design places it. */
export function SignInForm({ to = "/", roles, note }: {
  to?: string;
  roles?: readonly (readonly [string, string])[];
  note?: React.ReactNode;
}) {
  const navigate = useNavigate();
  const session = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(roles?.[0]?.[0] ?? "");
  const [error, setError] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      setError("An email address is needed");
      return;
    }
    signIn(email, undefined, role || undefined);
    navigate(to);
  }

  return (
    <div data-dashboard="true" className="bg-transparent">
      {/* A <form>, so Enter in either field signs in — the one thing
          everybody tries and the commonest omission of a hand-written one. */}
      <form onSubmit={submit} className="grid gap-5">
        <Field label="Email" error={error}>
          <Input type="email" autoComplete="username" placeholder="you@example.com" value={email}
            onChange={(e) => { setEmail(e.target.value); setError(""); }} />
        </Field>
        <Field label="Password">
          <Input type="password" autoComplete="current-password" value={password}
            onChange={(e) => setPassword(e.target.value)} />
        </Field>
        {roles && roles.length > 1 && (
          <Field label="Signing in as">
            <Choice value={role} onChange={setRole} aria-label="Signing in as"
              options={roles.map(([value, label]) => ({ value, label }))} />
          </Field>
        )}
        <Button kind="primary" type="submit" className="h-9 w-full">Sign in</Button>
      </form>
      {note && <p className="mt-4 text-center text-sm text-ink-soft">{note}</p>}
      {session && (
        <p className="mt-4 text-center text-sm text-ink-soft">
          Signed in as {session.email}.{" "}
          <button type="button" onClick={() => navigate(to)} className="font-medium text-ink underline underline-offset-4">
            Continue
          </button>
        </p>
      )}
    </div>
  );
}

export default function SignInPage({ title, description, to = "/", roles, note, brand }: {
  title: string;
  /** One line under the title: what this area is. */
  description?: string;
  /** Where signing in lands. The area's overview. */
  to?: string;
  /** [value, label] — "supplier", "Supplier". One kind of person needs none. */
  roles?: readonly (readonly [string, string])[];
  /** A line under the button: who this area is for, who to ask for access. */
  note?: React.ReactNode;
  brand?: React.ReactNode;
}) {
  return (
    <div data-dashboard="true" className="flex min-h-svh flex-col items-center justify-center gap-6 bg-ground p-6 font-body md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        {brand && <div className="flex items-center justify-center gap-2 font-medium text-ink">{brand}</div>}
        <Card className="shadow-xs">
          <CardHeader className="text-center">
            <CardTitle className="font-body text-xl">{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </CardHeader>
          <CardContent>
            <SignInForm to={to} roles={roles} note={note} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
