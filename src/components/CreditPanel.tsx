import { useState } from "react";
import type { CompanyData } from "../model/inputs";
import { creditRatios, debtCapacity } from "../model/credit";

const cr = (n: number) => n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
const x = (n: number) => (n >= 10 ? n.toFixed(0) : n.toFixed(2)) + "x";

export function CreditPanel({ c }: { c: CompanyData }) {
  const [multiple, setMultiple] = useState(2);
  const [rate, setRate] = useState(0.09);

  const r = creditRatios(c);
  const d = debtCapacity(c, multiple, rate);

  const verdict =
    d.coverageAfter >= 3
      ? { text: "Comfortable", cls: "text-emerald-400 border-emerald-500/50 bg-emerald-500/10" }
      : d.coverageAfter >= 1.5
      ? { text: "Stretched", cls: "text-amber-300 border-amber-500/50 bg-amber-500/10" }
      : { text: "Risky", cls: "text-rose-300 border-rose-500/50 bg-rose-500/10" };

  const metrics = [
    { label: "Interest coverage", value: x(r.interestCoverage), note: "EBIT ÷ interest · safe above 3x" },
    { label: "Debt / EBITDA", value: x(r.debtToEbitda), note: "safe below 3x" },
    { label: "Net cash", value: "₹" + cr(r.netCash) + " cr", note: "investments − borrowings" },
    { label: "Cash conversion", value: (r.cashConversion * 100).toFixed(0) + "%", note: "operating cash ÷ EBITDA" },
  ];

  return (
    <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
        Credit view · FY26
      </h2>
      <p className="mb-4 mt-1 text-xs text-slate-500">Could CAMS safely take on more debt?</p>

      <div className="grid gap-3 sm:grid-cols-4">
        {metrics.map((m) => (
          <div key={m.label} className="rounded-xl border border-slate-700 bg-slate-950/60 p-3">
            <p className="text-[11px] uppercase tracking-wider text-slate-400">{m.label}</p>
            <p className="mt-1 text-xl font-semibold tabular-nums">{m.value}</p>
            <p className="mt-0.5 text-[11px] text-slate-500">{m.note}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-xl border border-slate-700 bg-slate-950/60 p-4">
        <p className="mb-3 text-xs font-medium text-emerald-400">Debt capacity test</p>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <Range label="Borrow up to (× EBITDA)" display={multiple.toFixed(1) + "x"}
              value={multiple} min={0.5} max={5} step={0.5} onChange={setMultiple} />
            <Range label="Interest rate on new debt" display={(rate * 100).toFixed(1) + "%"}
              value={rate} min={0.07} max={0.14} step={0.005} onChange={setRate} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Result label="New debt" value={"₹" + cr(d.maxDebt) + " cr"} />
            <Result label="New interest / yr" value={"₹" + cr(d.newInterest) + " cr"} />
            <Result label="Coverage after" value={x(d.coverageAfter)} />
            <div className={`flex items-center justify-center rounded-lg border p-3 text-lg font-semibold ${verdict.cls}`}>
              {verdict.text}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Range({
  label, display, value, min, max, step, onChange,
}: {
  label: string; display: string; value: number; min: number; max: number;
  step: number; onChange: (v: number) => void;
}) {
  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm">
        <span className="text-slate-200">{label}</span>
        <span className="font-semibold tabular-nums text-emerald-400">{display}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full accent-emerald-400" />
    </div>
  );
}

function Result({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-800 p-3">
      <p className="text-[11px] uppercase tracking-wider text-slate-400">{label}</p>
      <p className="mt-1 text-lg font-semibold tabular-nums">{value}</p>
    </div>
  );
}