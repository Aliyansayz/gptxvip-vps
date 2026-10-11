# Ledgerline

Ledger, Reconciliation, Cash Flow, Audit. Add a positive credit/debit posting, match exact signed amounts within one account, unmatch to reopen. Filters and exports use selected account currency.

## Architecture

`App.tsx` composes root shared controls and product views. `data.ts` owns typed contracts and fictional October 2026 fixtures; `formulas.ts` owns derived mathematics; `actions.ts` owns transitions. Shared root React/Vite runtime, no nested packages.

## State and formulas

Closing account balance = fixture opening + credits − debits. USD and EUR never combined. Selected cash bridge uses only selected-window postings; full closing explicitly includes all postings.

Independent versioned local browser state: `gptx.prototype.ledgerline.v1`. Confirmed Reset demo restores only this product. Light/dark theme and accessible mobile navigation are local. CSV is a real browser download; print opens an actual sample report. All records are fictional; there is no remote API, connected account, delivery or production guarantee.

## Run

From project root: `npm run dev`, then `/agents/prototypes/ledgerline`. Root owns lazy registry, showcase mapping and actual runtime screenshots. Agent C independently records runtime QA in `src/prototype/episodes`.
