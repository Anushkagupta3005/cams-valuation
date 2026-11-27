import { describe, it, expect } from "vitest";
import { runDcf } from "./dcf";
import { CAMS, BASE_CASE } from "./inputs";

describe("DCF matches the Excel model", () => {
  const r = runDcf(CAMS, BASE_CASE);

  it("FY27 free cash flow ≈ 464.81", () => {
    expect(r.rows[0].fcf).toBeCloseTo(464.81, 1);
  });
  it("sum of PV of FCF ≈ 1945.68", () => {
    expect(r.sumPvFcf).toBeCloseTo(1945.68, 1);
  });
  it("terminal value ≈ 8608.30", () => {
    expect(r.terminalValue).toBeCloseTo(8608.30, 1);
  });
  it("value per share ≈ ₹279.77", () => {
    expect(r.valuePerShare).toBeCloseTo(279.77, 1);
  });
  it("rejects WACC ≤ terminal growth", () => {
    expect(() => runDcf(CAMS, { ...BASE_CASE, wacc: 0.04 })).toThrow();
  });
});