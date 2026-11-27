import type { Assumptions, CompanyData } from "./inputs";
import { runDcf } from "./dcf";

export function sensitivityGrid(
  c: CompanyData, a: Assumptions,
  waccs: number[], growths: number[]
): number[][] {
  return waccs.map((wacc) =>
    growths.map((terminalGrowth) =>
      runDcf(c, { ...a, wacc, terminalGrowth }).valuePerShare
    )
  );
}

export const WACC_RANGE = [0.11, 0.12, 0.133, 0.14, 0.15];
export const GROWTH_RANGE = [0.04, 0.045, 0.05, 0.055, 0.06];