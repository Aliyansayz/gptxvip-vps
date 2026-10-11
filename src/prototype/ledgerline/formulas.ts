import type { Entry, Account, StatementLine } from "./data";
export const signed = (e: Entry) =>
  e.direction === "credit" ? e.amountCents : -e.amountCents;
export const closing = (a: Account, entries: Entry[]) =>
  a.openingBalanceCents +
  entries
    .filter((e) => e.accountId === a.id)
    .reduce((n, e) => n + signed(e), 0);
export const matchDifference = (line: StatementLine, entry: Entry) =>
  line.amountCents - signed(entry);
