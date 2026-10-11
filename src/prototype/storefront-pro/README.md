# Storefront Pro

Orders, Inventory, Reconciliation, Customers. Order controls enforce paid→packed→shipped and pending→paid. Canceling an unshipped order returns reserved stock. Positive integer restocks create movement records. Settlement adjustment requires explanation.

## Architecture

`App.tsx` composes root shared controls and product views. `data.ts` owns typed contracts and fictional October 2026 fixtures; `formulas.ts` owns derived mathematics; `actions.ts` owns transitions. Shared root React/Vite runtime, no nested packages.

## State and formulas

Order total = sum(quantity × priceCents). Available stock assumes seeded orders already reserved. Cancellation returns each item once. Settlement difference = charged − fees − settled.

Independent versioned local browser state: `gptx.prototype.storefront-pro.v1`. Confirmed Reset demo restores only this product. Light/dark theme and accessible mobile navigation are local. CSV is a real browser download; print opens an actual sample report. All records are fictional; there is no remote API, connected account, delivery or production guarantee.

## Run

From project root: `npm run dev`, then `/agents/prototypes/storefront-pro`. Root owns lazy registry, showcase mapping and actual runtime screenshots. Agent C independently records runtime QA in `src/prototype/episodes`.
