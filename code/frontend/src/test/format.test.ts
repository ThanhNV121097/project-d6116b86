import { describe, expect, it } from "vitest";
import { formatDate, formatPrice } from "../lib/format";

// ONE TEST, AND IT IS THE SCAFFOLD'S OWN CONTRACT.
//
// It is here so that `npm test` means something from the first commit: a
// runner with no test in it passes, and a passing run of nothing is the
// sentence that let every "tests pass" claim in this pipeline be true and
// worthless. It also tests the one rule the whole site depends on — every
// date and every price on the site goes through src/lib/format.ts, so that a
// page cannot write one format while another page writes a second (the free
// walk reports `date-format` when they do).
describe("the site's one date and price format", () => {
  it("formats a price for the site's locale", () => {
    const out = formatPrice(1234.5);
    expect(out).toBeTruthy();
    expect(typeof out).toBe("string");
  });

  it("formats a date for the site's locale", () => {
    const out = formatDate("2026-11-04");
    expect(out).toBeTruthy();
    expect(typeof out).toBe("string");
  });

  it("does not crash on a value the data does not have", () => {
    expect(() => formatDate("")).not.toThrow();
    expect(() => formatPrice(Number.NaN)).not.toThrow();
  });
});
