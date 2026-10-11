export interface Candle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}
export interface DepthLevel {
  side: "bid" | "ask";
  price: number;
  quantity: number;
}
export interface Holding {
  asset: string;
  quantity: number;
  averageCost: number;
}
export interface Wallet {
  id: string;
  label: string;
  cluster: string;
  balance: number;
  activity: string[];
}
export interface TokenEvent {
  id: string;
  asset: string;
  date: string;
  kind: string;
  description: string;
}
export interface GasSample {
  time: string;
  network: string;
  gwei: number;
}
export interface State {
  view: string;
  asset: string;
  window: string;
  network: string;
  cluster: string;
  stream: boolean;
  candles: Record<string, Candle[]>;
  holdings: Holding[];
  bookmarks: string[];
  tick: number;
}
export const wallets: Wallet[] = [
  {
    id: "w1",
    label: "Research wallet 01",
    cluster: "Builders",
    balance: 42.3,
    activity: [
      "2026-10-05 · Sample transfer: 1.2 ETH",
      "2026-10-04 · Sample staking deposit: 3 ETH",
    ],
  },
  {
    id: "w2",
    label: "Research wallet 02",
    cluster: "Builders",
    balance: 17.8,
    activity: ["2026-10-03 · Sample receive: 2 ETH"],
  },
  {
    id: "w3",
    label: "Research wallet 03",
    cluster: "Treasuries",
    balance: 120.4,
    activity: ["2026-10-05 · Sample allocation: 10 ETH"],
  },
];
export const events: TokenEvent[] = [
  {
    id: "event-1",
    asset: "ETH",
    date: "2026-10-12",
    kind: "Research review",
    description: "Fictional protocol research committee",
  },
  {
    id: "event-2",
    asset: "BTC",
    date: "2026-10-15",
    kind: "Community",
    description: "Fictional ecosystem briefing",
  },
  {
    id: "event-3",
    asset: "ETH",
    date: "2026-10-20",
    kind: "Sample unlock",
    description: "Fictional token calendar allocation",
  },
];
export const gas: GasSample[] = Array.from({ length: 12 }, (_, i) => ({
  time: `2026-10-05T${String(8 + Math.floor(i / 2)).padStart(2, "0")}:00`,
  network: i % 2 ? "Arbitrum" : "Ethereum",
  gwei: i % 2 ? 0.12 + i / 200 : 12 + i * 1.6,
}));
const candles = (base: number): Candle[] =>
  Array.from({ length: 20 }, (_, i) => {
    const open = base + Math.sin(i / 2) * base * 0.018 + i * base * 0.001;
    const close = open + Math.cos(i) * base * 0.008;
    return {
      time: `2026-10-05T${String(4 + Math.floor(i / 2)).padStart(2, "0")}:${i % 2 ? "30" : "00"}`,
      open,
      close,
      high: Math.max(open, close) + base * 0.006,
      low: Math.min(open, close) - base * 0.005,
      volume: 75 + i * 13,
    };
  });
export const seed: State = {
  view: "Market",
  asset: "ETH",
  window: "20 candles",
  network: "Ethereum",
  cluster: "All",
  stream: false,
  tick: 0,
  candles: { ETH: candles(2400), BTC: candles(62000) },
  holdings: [
    { asset: "ETH", quantity: 4.2, averageCost: 2200 },
    { asset: "BTC", quantity: 0.18, averageCost: 58000 },
  ],
  bookmarks: [],
};
export const depth = (price: number): DepthLevel[] =>
  Array.from({ length: 10 }, (_, i) => ({
    side: i < 5 ? "ask" : "bid",
    price: price + (i < 5 ? 5 - i : -(i - 4)) * price * 0.0006,
    quantity: 1.2 + (i % 5) * 0.7,
  }));

const unique = (rows: { id: string }[]) =>
  rows.every((r) => typeof r.id === "string" && !!r.id) &&
  new Set(rows.map((r) => r.id)).size === rows.length;
const text = (v: unknown): v is string => typeof v === "string" && !!v.trim();
const nonnegative = (v: unknown): v is number =>
  typeof v === "number" && Number.isFinite(v) && v >= 0;
const integer = (v: unknown): v is number =>
  nonnegative(v) && Number.isSafeInteger(v);
const validDate = (v: string) =>
  /^\d{4}-\d{2}-\d{2}$/.test(v) &&
  new Date(v + "T00:00:00Z").toISOString().slice(0, 10) === v;
export function validate(s: State) {
  const assets = ["ETH", "BTC"];
  return (
    ["Market", "Portfolio", "Wallets", "Token Calendar / Gas"].includes(
      s.view,
    ) &&
    assets.includes(s.asset) &&
    ["20 candles", "8 candles"].includes(s.window) &&
    ["Ethereum", "Arbitrum"].includes(s.network) &&
    ["All", "Builders", "Treasuries"].includes(s.cluster) &&
    integer(s.tick) &&
    assets.every(
      (asset) =>
        Array.isArray(s.candles[asset]) &&
        s.candles[asset].length > 0 &&
        s.candles[asset].every(
          (c, i, rows) =>
            text(c.time) &&
            Number.isFinite(Date.parse(c.time + "Z")) &&
            [c.open, c.high, c.low, c.close, c.volume].every(nonnegative) &&
            c.low > 0 &&
            c.low <= Math.min(c.open, c.close) &&
            c.high >= Math.max(c.open, c.close) &&
            (i === 0 || rows[i - 1].time < c.time),
        ),
    ) &&
    s.holdings.every(
      (h) =>
        assets.includes(h.asset) &&
        nonnegative(h.quantity) &&
        nonnegative(h.averageCost),
    ) &&
    new Set(s.holdings.map((h) => h.asset)).size === s.holdings.length &&
    s.bookmarks.every((id) => events.some((e) => e.id === id)) &&
    new Set(s.bookmarks).size === s.bookmarks.length
  );
}
