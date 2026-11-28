import { useMemo } from "react";
import type { Assumptions, CompanyData } from "../model/inputs";
import { monteCarlo } from "../model/monteCarlo";

const rs = (n: number) => "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
const BINS = 40;

export function MonteCarloPanel({ c, a }: { c: CompanyData; a: Assumptions }) {
  const r = useMemo(() => monteCarlo(c, a), [c, a]);

  // Histogram between the 1st and 99th percentile (ignores extreme tails)
  const lo = r.values[Math.floor(0.01 * (r.values.length - 1))];
  const hi = r.values[Math.floor(0.99 * (r.values.length - 1))];
  const width = (hi - lo) / BINS;
  const counts = new Array(BINS).fill(0);
  for (const v of r.values) {
    if (v < lo || v > hi) continue;
    counts[Math.min(BINS - 1, Math.floor((v - lo) / width))]++;
  }
  const maxCount = Math.max(...counts);

  return (
    <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
        Monte Carlo · {r.values.length.toLocaleString("en-IN")} scenarios
      </h2>
      <p className="mb-4 mt-1 text-xs text-slate-500">
        Growth ±2 pts · margin ±2 pts · WACC ±1 pt · terminal growth ±0.5 pt, around your sliders
      </p>

      <div className="grid gap-3 sm:grid-cols-4">
        <Box label="5th percentile" value={rs(r.p5)} />
        <Box label="Median" value={rs(r.p50)} />
        <Box label="95th percentile" value={rs(r.p95)} />
        <Box label={`Chance ≥ ${rs(c.marketPrice)}`}
          value={(r.probAbovePrice * 100).toFixed(1) + "%"}
          tone={r.probAbovePrice >= 0.5 ? "good" : "bad"} />
      </div>

      <div className="mt-5 flex h-40 items-end gap-[2px]">
        {counts.map((n, i) => {
          const binMid = lo + (i + 0.5) * width;
          const inBand = binMid >= r.p5 && binMid <= r.p95;
          return (
            <div key={i} title={`${rs(lo + i * width)}–${rs(lo + (i + 1) * width)}: ${n}`}
              className={`flex-1 rounded-t ${inBand ? "bg-emerald-400/70" : "bg-slate-600/60"}`}
              style={{ height: `${(n / maxCount) * 100}%` }} />
          );
        })}
      </div>
      <div className="mt-1 flex justify-between text-[11px] text-slate-500">
        <span>{rs(lo)}</span><span>{rs(hi)}</span>
      </div>

      <p className="mt-4 text-xs text-slate-400">
        In 90% of scenarios CAMS is worth between{" "}
        <span className="text-slate-200">{rs(r.p5)}</span> and{" "}
        <span className="text-slate-200">{rs(r.p95)}</span>. Only{" "}
        <span className="text-slate-200">{(r.probAbovePrice * 100).toFixed(1)}%</span>{" "}
        reach the market price of {rs(c.marketPrice)}.
      </p>
    </section>
  );
}

function Box({ label, value, tone }: { label: string; value: string; tone?: "good" | "bad" }) {
  const color = tone === "good" ? "text-emerald-400" : tone === "bad" ? "text-rose-400" : "text-slate-100";
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-950/60 p-3">
      <p className="text-[11px] uppercase tracking-wider text-slate-400">{label}</p>
      <p className={`mt-1 text-xl font-semibold tabular-nums ${color}`}>{value}</p>
    </div>
  );
}