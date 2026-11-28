import type { Assumptions, CompanyData } from "./inputs";
import { runDcf } from "./dcf";

// Seeded random generator: same seed → same results (makes it testable)
export function mulberry32(seed: number): () => number {
  let s = seed;
  return () => {
    s += 0x6d2b79f5;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Standard normal random number (Box–Muller)
function normal(rand: () => number): number {
  const u = 1 - rand();
  const v = rand();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

export interface McResult {
  values: number[];
  p5: number;
  p50: number;
  p95: number;
  mean: number;
  probAbovePrice: number;
}

export function monteCarlo(
  c: CompanyData, a: Assumptions, runs = 10000, seed = 42
): McResult {
  const rand = mulberry32(seed);
  const values: number[] = [];

  for (let i = 0; i < runs; i++) {
    const growthShift = normal(rand) * 0.02;              // ±2 pts
    const ebitdaMargin = a.ebitdaMargin + normal(rand) * 0.02; // ±2 pts
    const wacc = a.wacc + normal(rand) * 0.01;             // ±1 pt
    const terminalGrowth = a.terminalGrowth + normal(rand) * 0.005; // ±0.5 pt
    if (wacc - terminalGrowth < 0.02) continue; // skip unrealistic draws

    values.push(
      runDcf(c, {
        ...a,
        growth: a.growth.map((g) => g + growthShift),
        ebitdaMargin, wacc, terminalGrowth,
      }).valuePerShare
    );
  }

  values.sort((x, y) => x - y);
  const q = (p: number) => values[Math.floor(p * (values.length - 1))];
  const mean = values.reduce((s, v) => s + v, 0) / values.length;
  const above = values.filter((v) => v >= c.marketPrice).length;

  return { values, p5: q(0.05), p50: q(0.5), p95: q(0.95), mean,
           probAbovePrice: above / values.length };
}