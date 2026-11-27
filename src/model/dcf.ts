import type { Assumptions, CompanyData } from "./inputs";

export interface YearRow {
  year: number; revenue: number; ebitda: number; depreciation: number;
  ebit: number; tax: number; nopat: number; capex: number;
  fcf: number; discountFactor: number; pvFcf: number;
}

export interface DcfResult {
  rows: YearRow[];
  sumPvFcf: number;
  terminalValue: number;
  pvTerminalValue: number;
  enterpriseValue: number;
  equityValue: number;
  valuePerShare: number;
  upside: number;
}

export function forecast(c: CompanyData, a: Assumptions): YearRow[] {
  let revenue = c.baseRevenue;
  return a.growth.map((g, i) => {
    revenue = revenue * (1 + g);
    const ebitda = revenue * a.ebitdaMargin;
    const depreciation = revenue * a.depreciationPct;
    const ebit = ebitda - depreciation;
    const tax = ebit * a.taxRate;
    const nopat = ebit - tax;
    const capex = revenue * a.capexPct;
    const fcf = nopat + depreciation - capex;
    const discountFactor = 1 / Math.pow(1 + a.wacc, i + 1);
    return { year: i + 1, revenue, ebitda, depreciation, ebit, tax, nopat,
             capex, fcf, discountFactor, pvFcf: fcf * discountFactor };
  });
}

export function runDcf(c: CompanyData, a: Assumptions): DcfResult {
  if (a.wacc <= a.terminalGrowth) {
    throw new Error("WACC must be greater than terminal growth");
  }
  const rows = forecast(c, a);
  const last = rows[rows.length - 1];
  const sumPvFcf = rows.reduce((s, r) => s + r.pvFcf, 0);
  const terminalValue = (last.fcf * (1 + a.terminalGrowth)) / (a.wacc - a.terminalGrowth);
  const pvTerminalValue = terminalValue * last.discountFactor;
  const enterpriseValue = sumPvFcf + pvTerminalValue;
  const equityValue = enterpriseValue + c.investments - c.borrowings;
  const valuePerShare = equityValue / c.shares;
  return { rows, sumPvFcf, terminalValue, pvTerminalValue, enterpriseValue,
           equityValue, valuePerShare, upside: valuePerShare / c.marketPrice - 1 };
}