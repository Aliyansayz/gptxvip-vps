export interface Account {
  id: string;
  name: string;
  currency: string;
  openingBalanceCents: number;
}
export interface Entry {
  id: string;
  accountId: string;
  date: string;
  description: string;
  direction: string;
  amountCents: number;
  category: string;
  reference: string;
  reconciled: boolean;
}
export interface StatementLine {
  id: string;
  accountId: string;
  date: string;
  amountCents: number;
  reference: string;
  matchedEntryId: string;
}
export interface AuditEvent {
  id: string;
  at: string;
  action: string;
  recordId: string;
  details: string;
}
export const seed = {
  accounts: [
    {
      id: "usd",
      name: "Operating account",
      currency: "USD",
      openingBalanceCents: 7500000,
    },
    {
      id: "eur",
      name: "Europe operations",
      currency: "EUR",
      openingBalanceCents: 4200000,
    },
  ] as Account[],
  entries: [
    {
      id: "entry-1",
      accountId: "usd",
      date: "2026-10-01",
      description: "Customer receipts",
      direction: "credit",
      amountCents: 2450000,
      category: "Revenue",
      reference: "REC-001",
      reconciled: false,
    },
    {
      id: "entry-2",
      accountId: "usd",
      date: "2026-10-02",
      description: "Cloud infrastructure",
      direction: "debit",
      amountCents: 650000,
      category: "Operations",
      reference: "CLOUD-01",
      reconciled: false,
    },
    {
      id: "entry-3",
      accountId: "usd",
      date: "2026-10-03",
      description: "Team payroll",
      direction: "debit",
      amountCents: 1800000,
      category: "Payroll",
      reference: "PAY-01",
      reconciled: false,
    },
    {
      id: "entry-4",
      accountId: "eur",
      date: "2026-10-01",
      description: "EU customer receipts",
      direction: "credit",
      amountCents: 1500000,
      category: "Revenue",
      reference: "EU-01",
      reconciled: false,
    },
    {
      id: "entry-5",
      accountId: "eur",
      date: "2026-10-04",
      description: "Studio lease",
      direction: "debit",
      amountCents: 480000,
      category: "Operations",
      reference: "EU-02",
      reconciled: false,
    },
  ] as Entry[],
  statements: [
    {
      id: "line-1",
      accountId: "usd",
      date: "2026-10-01",
      amountCents: 2450000,
      reference: "REC-001",
      matchedEntryId: "",
    },
    {
      id: "line-2",
      accountId: "usd",
      date: "2026-10-02",
      amountCents: -660000,
      reference: "CLOUD-01",
      matchedEntryId: "",
    },
    {
      id: "line-3",
      accountId: "eur",
      date: "2026-10-01",
      amountCents: 1500000,
      reference: "EU-01",
      matchedEntryId: "",
    },
  ] as StatementLine[],
  audit: [] as AuditEvent[],
  account: "usd",
  range: "All dates",
};
export function validate(s: typeof seed) {
  return (
    s.accounts.some((a) => a.id === s.account) &&
    ["All dates", "Oct 1–3", "Oct 4–8"].includes(s.range) &&
    s.entries.every(
      (e) =>
        s.accounts.some((a) => a.id === e.accountId) &&
        ["credit", "debit"].includes(e.direction) &&
        Number.isInteger(e.amountCents) &&
        e.amountCents > 0,
    ) &&
    s.statements.every(
      (l) =>
        s.accounts.some((a) => a.id === l.accountId) &&
        (!l.matchedEntryId ||
          s.entries.some(
            (e) =>
              e.id === l.matchedEntryId &&
              e.accountId === l.accountId &&
              e.reconciled,
          )),
    ) &&
    s.audit.every(
      (a) =>
        typeof a.id === "string" &&
        typeof a.at === "string" &&
        typeof a.action === "string" &&
        typeof a.recordId === "string" &&
        typeof a.details === "string",
    )
  );
}
