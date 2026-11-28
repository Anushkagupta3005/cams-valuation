import type { DcfResult } from "../model/dcf";
import type { CompanyData } from "../model/inputs";

const cr = (n: number) => n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
const pct = (n: number) => (n * 100).toFixed(0) + "%";

type Step = { label: string; value: string; note?: string; highlight?: boolean };

export function FlowView({ r, c }: { r: DcfResult; c: CompanyData }) {
  const y1 = r.rows[0];
  const tvShare = r.pvTerminalValue / r.enterpriseValue;

  const cashSteps: Step[] = [
    { label: "Revenue FY27", value: cr(y1.revenue), note: "FY26 × (1 + growth)" },
    { label: "EBITDA", value: cr(y1.ebitda), note: "× EBITDA margin" },
    { label: "EBIT", value: cr(y1.ebit), note: "− depreciation" },
    { label: "NOPAT", value: cr(y1.nopat), note: "− tax" },
    { label: "Free cash flow", value: cr(y1.fcf), note: "+ depreciation − capex", highlight: true },
  ];

  const valueSteps: Step[] = [
    { label: "PV of 5-yr FCF", value: cr(r.sumPvFcf), note: "discounted at WACC" },
    { label: "PV of terminal value", value: cr(r.pvTerminalValue), note: `${pct(tvShare)} of total value` },
    { label: "Enterprise value", value: cr(r.enterpriseValue), note: "business value" },
    { label: "Equity value", value: cr(r.equityValue), note: `+ net cash ${cr(c.investments - c.borrowings)}` },
    { label: "Value / share", value: "₹" + cr(r.valuePerShare), note: `÷ ${c.shares} cr shares`, highlight: true },
  ];

  return (
    <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
      <h2 className="mb-1 text-sm font-semibold uppercase tracking-wider text-slate-300">
        How the value is built
      </h2>
      <p className="mb-4 text-xs text-slate-500">₹ crore · move a slider and watch each step update</p>
      <FlowRow title="1 · From revenue to cash (FY27)" steps={cashSteps} />
      <FlowRow title="2 · From cash to value per share" steps={valueSteps} />
    </section>
  );
}

function FlowRow({ title, steps }: { title: string; steps: Step[] }) {
  return (
    <div className="mb-4 last:mb-0">
      <p className="mb-2 text-xs font-medium text-emerald-400">{title}</p>
      <div className="flex items-stretch gap-2 overflow-x-auto">
        {steps.map((s, i) => (
          <div key={s.label} className="flex flex-1 items-center gap-2">
            <div
              className={`min-w-0 flex-1 rounded-xl border p-3 ${
                s.highlight
                  ? "border-emerald-500/60 bg-emerald-500/10"
                  : "border-slate-700 bg-slate-950/60"
              }`}
            >
              <p className="text-[11px] uppercase tracking-wider text-slate-400">{s.label}</p>
              <p className="mt-1 text-lg font-semibold tabular-nums">{s.value}</p>
              {s.note && <p className="mt-0.5 text-[11px] text-slate-500">{s.note}</p>}
            </div>
            {i < steps.length - 1 && <span className="text-slate-600">→</span>}
          </div>
        ))}
      </div>
    </div>
  );
}