import { describe, it, expect } from "vitest";
import { CAMS, BASE_CASE } from "./inputs";
import { sensitivityGrid, WACC_RANGE, GROWTH_RANGE } from "./sensitivity";
import { creditRatios, debtCapacity } from "./credit";

describe("sensitivity grid matches Excel", () => {
  const grid = sensitivityGrid(CAMS, BASE_CASE, WACC_RANGE, GROWTH_RANGE);
  it("centre cell = base case ≈ 279.77", () => {
    expect(grid[2][2]).toBeCloseTo(279.77, 1);
  });
  it("best case (11%, 6%) ≈ 443.97", () => {
    expect(grid[0][4]).toBeCloseTo(443.97, 1);
  });
  it("worst case (15%, 4%) ≈ 219.49", () => {
    expect(grid[4][0]).toBeCloseTo(219.49, 1);
  });
});

describe("credit view matches Excel", () => {
  const r = creditRatios(CAMS);
  const d = debtCapacity(CAMS);
  it("interest coverage ≈ 90.71x", () => {
    expect(r.interestCoverage).toBeCloseTo(90.71, 1);
  });
  it("net cash = 382", () => {
    expect(r.netCash).toBe(382);
  });
  it("debt capacity 1366, coverage after ≈ 5.17x", () => {
    expect(d.maxDebt).toBe(1366);
    expect(d.coverageAfter).toBeCloseTo(5.17, 1);
  });
});