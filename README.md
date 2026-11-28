# CAMS Valuation Explorer

An interactive DCF and credit analysis of **Computer Age Management Services (CAMS)**, India's largest mutual fund registrar. I first built the model by hand in Excel, then rebuilt it as a tested TypeScript engine with a React dashboard.

**Live demo:** _link coming soon_

## What it does
- **DCF valuation:** 5-year free cash flow forecast → CAPM-based WACC → terminal value → value per share vs market price
- **Live assumptions:** sliders for growth, EBITDA margin, capex, WACC and terminal growth; everything recalculates instantly
- **Flow view:** shows how revenue turns into value per share, step by step
- **Sensitivity heatmap:** WACC × terminal growth grid, colour-coded against the market price
- **Monte Carlo:** 10,000 seeded scenarios → percentile range and probability of reaching the market price
- **Credit view:** interest coverage, debt/EBITDA, net cash, cash conversion, plus an interactive debt-capacity test

## Key findings (base case)
| Metric | Value |
|---|---|
| Value per share | **₹280** vs market price ₹712 |
| Sensitivity range (WACC 11–15%, g 4–6%) | ₹219 – ₹444 |
| Monte Carlo 90% range | ₹221 – ₹369 · 0% of scenarios reach ₹712 |
| Interest coverage | ~91x · net cash ₹382 cr |
| Debt capacity at 2x EBITDA | ~₹1,366 cr, coverage still ~5x |

The market price implies a much lower cost of equity or stronger long-term growth than my base case.

## Assumptions
| Input | Value | Reason |
|---|---|---|
| Revenue growth | 12% → 9% | Below 13.6% 5-yr CAGR (inflated by FY25 boom); AUM growth minus 3–3.5% yield dilution |
| EBITDA margin | 45% | Stable 43–47% for 5 years; matches management guidance |
| Capex | 8% of revenue | Elevated during the platform rebuild |
| Tax | 25% | Consistent history |
| WACC | 13.3% | CAPM: 7.3% risk-free + 1.0 beta × 6% ERP; almost no debt |
| Terminal growth | 5% | Near long-run nominal growth, below WACC |

## Tech
React · TypeScript · Vite · Tailwind CSS · Vitest

- All maths lives in `src/model/` as pure, tested functions, separate from the UI
- **15 unit tests** verify the engine reproduces the Excel model exactly (₹279.77/share, 91x coverage)
- Monte Carlo uses a seeded random generator, so results are reproducible and testable

## Run locally
```bash
npm install
npm run dev     # app at localhost:5173
npm test        # run tests
```

## Limitations
Single company; revenue modelled as one growth rate rather than AUM × yield; working capital assumed flat; other income excluded to avoid double counting the investments added to equity value.
