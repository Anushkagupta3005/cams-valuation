import type { CompanyData } from "./inputs";

export function creditRatios(c: CompanyData) {
  return {
    interestCoverage: c.ebit / c.interest,
    debtToEbitda: c.borrowings / c.ebitda,
    debtToEquity: c.borrowings / c.equity,
    netCash: c.investments - c.borrowings,
    cashConversion: c.cfo / c.ebitda,
    freeCashFlow: c.cfo - c.capex,
  };
}

export function debtCapacity(c: CompanyData, targetMultiple = 2, rate = 0.09) {
  const maxDebt = targetMultiple * c.ebitda;
  const newInterest = maxDebt * rate;
  return { maxDebt, newInterest, coverageAfter: c.ebit / newInterest };
}