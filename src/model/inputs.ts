export interface Assumptions {
    growth: number[];        // revenue growth per year, FY27–FY31
    ebitdaMargin: number;
    depreciationPct: number; // % of revenue
    capexPct: number;        // % of revenue
    taxRate: number;
    wacc: number;
    terminalGrowth: number;
  }
  
  export interface CompanyData {
    baseRevenue: number;     // FY26, ₹ crore
    investments: number;
    borrowings: number;
    shares: number;          // crore
    marketPrice: number;     // ₹
    ebitda: number;          // FY26 actuals, for credit
    ebit: number;
    interest: number;
    equity: number;
    cfo: number;
    capex: number;
  }
  
  export const CAMS: CompanyData = {
    baseRevenue: 1516, investments: 446, borrowings: 64,
    shares: 24.8, marketPrice: 712,
    ebitda: 683, ebit: 635, interest: 7, equity: 1321, cfo: 584, capex: 141,
  };
  
  export const BASE_CASE: Assumptions = {
    growth: [0.12, 0.11, 0.10, 0.10, 0.09],
    ebitdaMargin: 0.45, depreciationPct: 0.065, capexPct: 0.08,
    taxRate: 0.25, wacc: 0.133, terminalGrowth: 0.05,
  };