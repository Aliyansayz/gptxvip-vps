import { seed, type Entry } from "./data";
import { matchDifference } from "./formulas";
import { uid } from "../shared";
const log = (
  s: typeof seed,
  action: string,
  recordId: string,
  details: string,
) => [
  ...s.audit,
  {
    id: uid(s.audit, "audit"),
    at: "2026-10-08T16:00:00",
    action,
    recordId,
    details,
  },
];
export function post(s: typeof seed, e: Omit<Entry, "id" | "reconciled">) {
  if (
    !Number.isInteger(e.amountCents) ||
    e.amountCents <= 0 ||
    !e.description.trim() ||
    !e.reference.trim()
  )
    throw Error("A positive amount, description and reference are required.");
  const entry = { ...e, id: uid(s.entries, "entry"), reconciled: false };
  return {
    ...s,
    entries: [...s.entries, entry],
    audit: log(
      s,
      "Journal posted",
      entry.id,
      `${e.direction} ${e.amountCents} minor units; ${e.reference}`,
    ),
  };
}
export function match(s: typeof seed, lineId: string, entryId: string) {
  const line = s.statements.find((l) => l.id === lineId)!;
  const entry = s.entries.find((e) => e.id === entryId);
  if (
    !entry ||
    entry.accountId !== line.accountId ||
    matchDifference(line, entry) !== 0 ||
    entry.reconciled
  )
    throw Error(
      "Match requires the same account and exact signed amount, with an unreconciled entry.",
    );
  return {
    ...s,
    entries: s.entries.map((e) =>
      e.id === entryId ? { ...e, reconciled: true } : e,
    ),
    statements: s.statements.map((l) =>
      l.id === lineId ? { ...l, matchedEntryId: entryId } : l,
    ),
    audit: log(
      s,
      "Statement matched",
      lineId,
      `Matched ${entryId}; amount ${line.amountCents}`,
    ),
  };
}
export function unmatch(s: typeof seed, lineId: string) {
  const line = s.statements.find((l) => l.id === lineId)!;
  return {
    ...s,
    entries: s.entries.map((e) =>
      e.id === line.matchedEntryId ? { ...e, reconciled: false } : e,
    ),
    statements: s.statements.map((l) =>
      l.id === lineId ? { ...l, matchedEntryId: "" } : l,
    ),
    audit: log(
      s,
      "Statement unmatched",
      lineId,
      `Released ${line.matchedEntryId}`,
    ),
  };
}
