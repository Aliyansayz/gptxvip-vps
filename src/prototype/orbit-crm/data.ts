export interface Deal {
  id: string;
  title: string;
  companyId: string;
  contactId: string;
  valueCents: number;
  stage: string;
  ownerId: string;
  probability: number;
  expectedClose: string;
  nextAction: string;
}
export interface Contact {
  id: string;
  name: string;
  email: string;
  companyId: string;
}
export interface Company {
  id: string;
  name: string;
  industry: string;
}
export interface Activity {
  id: string;
  dealId: string;
  kind: string;
  note: string;
  date: string;
  ownerId: string;
}
export const stages = ["qualify", "discovery", "proposal", "won", "lost"];
export const probabilities: Record<string, number> = {
  qualify: 0.15,
  discovery: 0.4,
  proposal: 0.7,
  won: 1,
  lost: 0,
};
export const seed = {
  companies: [
    { id: "co1", name: "Northstar Studio", industry: "Design" },
    { id: "co2", name: "Harbor Labs", industry: "Technology" },
    { id: "co3", name: "Evergreen Co.", industry: "Retail" },
  ] as Company[],
  contacts: [
    {
      id: "contact-1",
      name: "Maya Chen",
      email: "maya@northstar.example.test",
      companyId: "co1",
    },
    {
      id: "contact-2",
      name: "M. Chen",
      email: "maya@northstar.example.test",
      companyId: "co1",
    },
    {
      id: "contact-3",
      name: "Sam Avery",
      email: "sam@harbor.example.test",
      companyId: "co2",
    },
    {
      id: "contact-4",
      name: "Jamie Park",
      email: "jamie@evergreen.example.test",
      companyId: "co3",
    },
  ] as Contact[],
  deals: Array.from({ length: 8 }, (_, i) => ({
    id: `deal-${i + 1}`,
    title: [
      "Brand expansion",
      "Annual platform",
      "Retail rollout",
      "Design partnership",
      "API pilot",
      "Team expansion",
      "Renewal review",
      "Regional launch",
    ][i],
    companyId: `co${(i % 3) + 1}`,
    contactId:
      i % 3 === 0
        ? i === 3
          ? "contact-2"
          : "contact-1"
        : i % 3 === 1
          ? "contact-3"
          : "contact-4",
    valueCents: [
      1800000, 4200000, 950000, 2800000, 7600000, 3200000, 1200000, 2400000,
    ][i],
    stage: stages[i % 5],
    ownerId: i % 2 ? "Jamie" : "Jordan",
    probability: probabilities[stages[i % 5]],
    expectedClose: `2026-${i % 2 ? "11" : "10"}-20`,
    nextAction: [
      "Book discovery call",
      "Send pricing proposal",
      "Review scope",
    ][i % 3],
  })) as Deal[],
  activities: [
    {
      id: "activity-1",
      dealId: "deal-1",
      kind: "note",
      note: "Initial conversation: wants a phased rollout.",
      date: "2026-10-03",
      ownerId: "Jordan",
    },
  ] as Activity[],
  owner: "All",
  period: "All periods",
};
export function validate(s: typeof seed) {
  return (
    ["All", "Jordan", "Jamie"].includes(s.owner) &&
    ["All periods", "2026-10", "2026-11"].includes(s.period) &&
    s.contacts.every((c) => s.companies.some((co) => co.id === c.companyId)) &&
    s.deals.every(
      (d) =>
        s.contacts.some(
          (c) => c.id === d.contactId && c.companyId === d.companyId,
        ) &&
        stages.includes(d.stage) &&
        d.probability === probabilities[d.stage] &&
        d.valueCents > 0 &&
        Number.isInteger(d.valueCents),
    ) &&
    s.activities.every(
      (a) =>
        typeof a.id === "string" &&
        s.deals.some((d) => d.id === a.dealId) &&
        typeof a.note === "string" &&
        typeof a.date === "string" &&
        typeof a.ownerId === "string",
    )
  );
}
