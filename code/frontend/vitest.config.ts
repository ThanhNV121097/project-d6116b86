import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// The test runner the shipped CI already asks for.
//
// package.json's `test` script was `echo "no tests yet"` and there was no
// runner installed, so CI's `npm test --if-present` found a script, ran it,
// printed a sentence and went green. Every test claim in the pipeline rested
// on that: a reviewer told to "run focused tests" had no tool that could, and
// the verification role records `verified_by = "static"` — read, not run.
//
// `--passWithNoTests` is deliberate. A design is the frontend alone and owes
// no tests; a story that adds behaviour does. Failing a project for having no
// tests yet would paint every new design red before anybody had written one,
// which is the trap this repository's CI comments describe three times over.
// What changes is that a test somebody WRITES now runs, in CI and in
// run_tests, and its verdict is evidence instead of prose.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
  },
});
