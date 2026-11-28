import { useMemo } from "react";
import { CAMS, BASE_CASE } from "./model/inputs";
import { runDcf } from "./model/dcf";

const rs = (n: number) =>
  "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
const pct = (n: number) => (n * 100).toFixed(1) + "%";

export default function App() {
  const a = BASE_CASE;
  const result = useMemo(() => runDcf(CAMS, a), [a]);
  const up = result.upside >= 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <header className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
            DCF · Credit Analysis
          </p>
          <h1 className="mt-2 text-3xl font-semibold">CAMS Valuation Explorer</h1>
          <p className="mt-1 text-sm text-slate-400">
            Computer Age Management Services · FY26 base year · ₹ crore
          </p>
        </header>

        <section className="grid gap-4 sm:grid-cols-3">
          <Stat label="Intrinsic value / share" value={rs(result.valuePerShare)} />
          <Stat label="Market price" value={rs(CAMS.marketPrice)} />
          <Stat
            label="Upside / downside"
            value={(up ? "+" : "") + pct(result.upside)}
            tone={up ? "good" : "bad"}
          />
        </section>
      </div>
    </div>
  );
}

function Stat({
  label, value, tone,
}: { label: string; value: string; tone?: "good" | "bad" }) {
  const color =
    tone === "good" ? "text-emerald-400" : tone === "bad" ? "text-rose-400" : "text-slate-100";
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg">
      <p className="text-xs uppercase tracking-wider text-slate-400">{label}</p>
      <p className={`mt-2 text-3xl font-semibold tabular-nums ${color}`}>{value}</p>
    </div>
  );
}