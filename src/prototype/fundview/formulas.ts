import type {
  CapitalEvent,
  Fund,
  Investor,
  NavPoint,
  SharePreview,
} from "./data";
export const quarterOf = (date: string) =>
  `${date.slice(0, 4)} Q${Math.ceil(Number(date.slice(5, 7)) / 3)}`;
export function bridge(
  fund: Fund,
  period: string,
  nav: NavPoint[],
  events: CapitalEvent[],
) {
  const earlier = nav.filter((n) => n.fundId === fund.id && n.period < period);
  const before = events.filter(
    (e) => e.fundId === fund.id && quarterOf(e.date) < period,
  );
  const rows = events.filter(
    (e) => e.fundId === fund.id && quarterOf(e.date) === period,
  );
  const signed = (e: CapitalEvent) =>
    e.kind === "call" ? e.amountCents : -e.amountCents;
  const opening =
    fund.openingNavCents +
    before.reduce((s, e) => s + signed(e), 0) +
    earlier.reduce((s, n) => s + n.gainCents, 0);
  const calls = rows
    .filter((e) => e.kind === "call")
    .reduce((s, e) => s + e.amountCents, 0);
  const distributions = rows
    .filter((e) => e.kind === "distribution")
    .reduce((s, e) => s + e.amountCents, 0);
  const gain =
    nav.find((n) => n.fundId === fund.id && n.period === period)?.gainCents ||
    0;
  return {
    opening,
    calls,
    distributions,
    gain,
    closing: opening + calls - distributions + gain,
    returnRate: opening ? gain / opening : 0,
  };
}
export function commitment(
  investor: Investor,
  events: CapitalEvent[],
  through?: string,
) {
  const rows = events.filter(
    (e) =>
      e.investorId === investor.id &&
      e.fundId === investor.fundId &&
      (!through || quarterOf(e.date) <= through),
  );
  const contributed = rows
      .filter((e) => e.kind === "call")
      .reduce((s, e) => s + e.amountCents, 0),
    distributed = rows
      .filter((e) => e.kind === "distribution")
      .reduce((s, e) => s + e.amountCents, 0);
  return {
    contributed,
    distributed,
    remaining: investor.commitmentCents - contributed,
    available: contributed - distributed,
  };
}
export function capitalError(
  investor: Investor,
  rows: CapitalEvent[],
  kind: string,
  amount: number,
  date: string,
) {
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
    !Number.isFinite(Date.parse(date + "T00:00:00Z")) ||
    !Number.isSafeInteger(amount) ||
    amount <= 0 ||
    !["call", "distribution"].includes(kind)
  )
    return "Enter a valid date and positive USD amount in whole cents.";
  const totals = commitment(investor, rows);
  if (kind === "call" && amount > totals.remaining)
    return "Capital call exceeds remaining commitment.";
  const timeline = [
    ...rows.filter(
      (e) => e.fundId === investor.fundId && e.investorId === investor.id,
    ),
    {
      id: "proposed",
      fundId: investor.fundId,
      investorId: investor.id,
      kind: kind as "call" | "distribution",
      amountCents: amount,
      date,
    },
  ].sort(
    (a, b) =>
      a.date.localeCompare(b.date) ||
      (a.kind === b.kind ? 0 : a.kind === "call" ? -1 : 1),
  );
  let available = 0;
  if (
    timeline.some((e) => {
      available += e.kind === "call" ? e.amountCents : -e.amountCents;
      return available < 0;
    })
  )
    return "Distribution exceeds contributed capital available in the investor’s dated ledger.";
  return "";
}
export const shareActive = (
  share: SharePreview | undefined,
  now = Date.now(),
) => !!share?.enabled && Date.parse(share.expiresAt) > now;
