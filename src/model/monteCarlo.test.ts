import { describe, it, expect } from "vitest";
import { monteCarlo } from "./monteCarlo";
import { CAMS, BASE_CASE } from "./inputs";

describe("Monte Carlo", () => {
  const r = monteCarlo(CAMS, BASE_CASE);

  it("is reproducible with the same seed", () => {
    expect(monteCarlo(CAMS, BASE_CASE).p50).toBe(r.p50);
  });
  it("runs close to 10,000 valid scenarios", () => {
    expect(r.values.length).toBeGreaterThan(9000);
  });
  it("median stays near the base case (~₹280)", () => {
    expect(r.p50).toBeGreaterThan(250);
    expect(r.p50).toBeLessThan(320);
  });
  it("very few scenarios reach the ₹712 market price", () => {
    expect(r.probAbovePrice).toBeLessThan(0.05);
  });
});