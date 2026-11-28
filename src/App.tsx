import { useMemo, useState } from "react";
import { CAMS, BASE_CASE, type Assumptions } from "./model/inputs";
import { runDcf } from "./model/dcf";
import { FlowView } from "./components/FlowView";
import { SensitivityHeatmap } from "./components/SensitivityHeatmap";
import { CreditPanel } from "./components/CreditPanel";

// Growth tapers from the starting rate: e.g. 12% → 12, 11, 10, 10, 9
const TAPER = [0, 0.01, 0.02, 0.02, 0.03];

const rs = (n: number) =>
  "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
const pct = (n: number) => (n * 100).toFixed(1) + "%";

export default function App() {
  const [startGrowth, setStartGrowth] = useState(0.12);
  const [margin, setMargin] = useState(BASE_CASE.ebitdaMargin);
  const [capex, setCapex] = useState(BASE_CASE.capexPct);
  const [wacc, setWacc] = useState(BASE_CASE.wacc);
  const [tg, setTg] = useState(BASE_CASE.terminalGrowth);

  const a: Assumptions = useMemo(
    () => ({
      ...BASE_CASE,
      growth: TAPER.map((t) => startGrowth - t),
      ebitdaMargin: margin,
      capexPct: capex,
      wacc,
      terminalGrowth: tg,
    }),
    [startGrowth, margin, capex, wacc, tg]
  );

  const result = useMemo(() => {
    try {
      return runDcf(CAMS, a);
    } catch {
      return null;
    }
  }, [a]);

  function reset() {
    setStartGrowth(0.12);
    setMargin(BASE_CASE.ebitdaMargin);
    setCapex(BASE_CASE.capexPct);
    setWacc(BASE_CASE.wacc);
    setTg(BASE_CASE.terminalGrowth);
  }

  const up = (result?.upside ?? 0) >= 0;

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

        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          {/* Assumptions panel */}
          <aside className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
                Assumptions
              </h2>
              <button
                onClick={reset}
                className="rounded-lg border border-slate-700 px-3 py-1 text-xs text-slate-300 hover:border-emerald-400 hover:text-emerald-400"
              >
                Reset
              </button>
            </div>
            <Slider label="Starting revenue growth (FY27)" hint="tapers by ~3 pts to FY31"
              value={startGrowth} min={0.04} max={0.2} step={0.005} onChange={setStartGrowth} />
            <Slider label="EBITDA margin" hint="5-yr avg 45%"
              value={margin} min={0.35} max={0.55} step={0.005} onChange={setMargin} />
            <Slider label="Capex % of revenue" hint="FY26: 9.3%"
              value={capex} min={0.04} max={0.12} step={0.005} onChange={setCapex} />
            <Slider label="WACC" hint="CAPM: 7.3% + 1.0 × 6%"
              value={wacc} min={0.09} max={0.16} step={0.001} onChange={setWacc} />
            <Slider label="Terminal growth" hint="must stay below WACC"
              value={tg} min={0.03} max={0.07} step={0.0025} onChange={setTg} />
          </aside>

          {/* Results */}
          <main>
            {result ? (
              <section className="grid gap-4 sm:grid-cols-3">
                <Stat label="Intrinsic value / share" value={rs(result.valuePerShare)} />
                <Stat label="Market price" value={rs(CAMS.marketPrice)} />
                <Stat
                  label="Upside / downside"
                  value={(up ? "+" : "") + pct(result.upside)}
                  tone={up ? "good" : "bad"}
                />
              </section>
            ) : (
              <div className="rounded-2xl border border-rose-900 bg-rose-950/40 p-5 text-rose-300">
                WACC must be higher than terminal growth. Adjust the sliders.
              </div>
            )}
                      {result && <FlowView r={result} c={CAMS} />}
                      {result && <SensitivityHeatmap c={CAMS} a={a} />} 
                      <CreditPanel c={CAMS} /> 
          </main>
        </div>
      </div>
    </div>
  );
}

function Slider({
  label, hint, value, min, max, step, onChange,
}: {
  label: string; hint: string; value: number; min: number; max: number;
  step: number; onChange: (v: number) => void;
}) {
  return (
    <div className="mb-5">
      <div className="flex items-baseline justify-between">
        <label className="text-sm text-slate-200">{label}</label>
        <span className="text-sm font-semibold tabular-nums text-emerald-400">{pct(value)}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full accent-emerald-400"
      />
      <p className="text-xs text-slate-500">{hint}</p>
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