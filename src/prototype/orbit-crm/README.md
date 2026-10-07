# Orbit CRM

Five-stage deal board, contacts/companies, weighted forecast and relationship activity. Stage moves use probability defaults: qualify15%, discovery40%, proposal70%, won100%, lost0%. Raw and weighted forecast exclude won/lost; won reported separately. Owner and close-month selectors partition related views. Merge requires matching duplicate email/company; source deals relink to keep ID. New/edit forms validate positive USD value and company/contact relationship.

## Architecture and state

`App.tsx` composes product views and root shared controls. Typed domain fixtures/contracts live in `data.ts`, mathematics in `formulas.ts`, transitions in `actions.ts`. Independent versioned browser key `gptx.prototype.orbit-crm.v1`; confirmed reset only resets this domain. All monetary values are integer USD cents. Records/periods are explicitly fictional October2026 browser fixtures. No external accounts, messages, billing or integrations.

## Run and QA

Root `npm run dev`; `/agents/prototypes/orbit-crm` after registry integration. Root owns showcase/screenshots, Agent C records independent behavior/source QA. CSV downloads use selected data; print creates an actual report. Shared accessible mobile navigation/local theme/dialog controls reused from root infrastructure.
