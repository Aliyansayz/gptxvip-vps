import { seed, probabilities, type Deal } from "./data";
import { uid } from "../shared";
export function stageMove(s: typeof seed, id: string, stage: string) {
  return {
    ...s,
    deals: s.deals.map((d) =>
      d.id === id ? { ...d, stage, probability: probabilities[stage] } : d,
    ),
  };
}
export function saveDeal(s: typeof seed, d: Omit<Deal, "id">, id?: string) {
  if (
    !d.title.trim() ||
    d.valueCents <= 0 ||
    !Number.isInteger(d.valueCents) ||
    !s.contacts.some(
      (c) => c.id === d.contactId && c.companyId === d.companyId,
    ) ||
    !d.expectedClose
  )
    throw Error(
      "Enter a title, positive value, close date and matching company/contact.",
    );
  return {
    ...s,
    deals: id
      ? s.deals.map((old) => (old.id === id ? { ...d, id } : old))
      : [...s.deals, { ...d, id: uid(s.deals, "deal") }],
  };
}
export function merge(s: typeof seed, keep: string, source: string) {
  const k = s.contacts.find((c) => c.id === keep),
    src = s.contacts.find((c) => c.id === source);
  if (
    !k ||
    !src ||
    keep === source ||
    k.email.toLowerCase() !== src.email.toLowerCase() ||
    k.companyId !== src.companyId
  )
    throw Error("Select a duplicate pair with the same email and company.");
  return {
    ...s,
    contacts: s.contacts.filter((c) => c.id !== source),
    deals: s.deals.map((d) =>
      d.contactId === source ? { ...d, contactId: keep } : d,
    ),
  };
}
