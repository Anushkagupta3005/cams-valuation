import type { Assumptions, CompanyData } from "../model/inputs";
import { sensitivityGrid, WACC_RANGE, GROWTH_RANGE } from "../model/sensitivity";

const pct = (n: number) => (n * 100).toFixed(1).replace(/\.0$/, "") + "%";
const rs = (n: number) => "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });

function cellColor(value: number, price: number) {
  const ratio = value / price;
  if (ratio >= 1) return "bg-emerald-500/30 text-emerald-200";
  if (ratio >= 0.8) return "bg-amber-500/20 text-amber-200";
  if (ratio >= 0.5) return "bg-rose-500/20 text-rose-200";
  return "bg-rose-500/40 text-rose-100";
}

export function SensitivityHeatmap({ c, a }: { c: CompanyData; a: Assumptions }) {
  const grid = sensitivityGrid(c, a, WACC_RANGE, GROWTH_RANGE);
  const values = grid.flat();
  const isCurrent = (w: number, g: number) =>
    Math.abs(w - a.wacc) < 0.0005 && Math.abs(g - a.terminalGrowth) < 0.0001;

  return (
    <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
        Sensitivity · value per share
      </h2>
      <p className="mb-4 mt-1 text-xs text-slate-500">
        Rows: WACC · Columns: terminal growth · Colour vs market price {rs(c.marketPrice)}
      </p>

      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-1 text-sm tabular-nums">
          <thead>
            <tr>
              <th className="p-2 text-left text-xs font-medium text-slate-500">WACC \ g</th>
              {GROWTH_RANGE.map((g) => (
                <th key={g} className="p-2 text-xs font-medium text-slate-400">{pct(g)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {grid.map((row, i) => (
              <tr key={WACC_RANGE[i]}>
                <td className="p-2 text-xs font-medium text-slate-400">{pct(WACC_RANGE[i])}</td>
                {row.map((v, j) => (
                  <td
                    key={j}
                    className={`rounded-lg p-2 text-center font-semibold ${cellColor(v, c.marketPrice)} ${
                      isCurrent(WACC_RANGE[i], GROWTH_RANGE[j]) ? "ring-2 ring-emerald-400" : ""
                    }`}
                  >
                    {rs(v)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-slate-400">
        Range: <span className="text-slate-200">{rs(Math.min(...values))}</span> to{" "}
        <span className="text-slate-200">{rs(Math.max(...values))}</span>.{" "}
        {Math.max(...values) < c.marketPrice
          ? `Even the most optimistic cell is below the ${rs(c.marketPrice)} market price.`
          : "Some combinations justify the market price."}
      </p>
    </section>
  );
}