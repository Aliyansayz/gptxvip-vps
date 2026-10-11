# SaaS Metrics Kit

Revenue, Retention, Recovery and Unit Economics. Starting MRR derives from explicit initial contract amounts plus all prior signed movements; selected movements reconcile ending MRR. Current fixture period October2026 receives plan expansion/contraction. Historical amounts do not mutate on plan changes. Past-due contracts remain in contracted MRR; deterministic retry #1 fails, #2 succeeds, paid invoices cannot retry and cash recovery creates no duplicate MRR. Retention uses original selected-plan cohort denominator; CAC payback assumes explicit80% gross margin. Board mode hides operational controls and prints actual selected metric rows.

## Architecture and state

`App.tsx` composes product views and root shared controls. Typed domain fixtures/contracts live in `data.ts`, mathematics in `formulas.ts`, transitions in `actions.ts`. Independent versioned browser key `gptx.prototype.saas-metrics-kit.v1`; confirmed reset only resets this domain. All monetary values are integer USD cents. Records/periods are explicitly fictional October2026 browser fixtures. No external accounts, messages, billing or integrations.

## Run and QA

Root `npm run dev`; `/agents/prototypes/saas-metrics-kit` after registry integration. Root owns showcase/screenshots, Agent C records independent behavior/source QA. CSV downloads use selected data; print creates an actual report. Shared accessible mobile navigation/local theme/dialog controls reused from root infrastructure.
