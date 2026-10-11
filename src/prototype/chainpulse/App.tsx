import { useEffect, useState } from "react";
import {
  Shell,
  useDemo,
  Card,
  Kpis,
  Select,
  Table,
  Dialog,
  Field,
  Button,
  Bars,
  csv,
  Notice,
  Empty,
} from "../shared";
import {
  validate,
  seed,
  depth,
  wallets,
  events,
  gas,
  type Holding,
} from "./data";
import { lastPrice, valuation, median, tick } from "./formulas";
import { saveHolding } from "./actions";
import { Candlesticks } from "./Views";
const dollars = (v: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(v);
export default function App() {
  const { state, setState, reset } = useDemo("chainpulse", seed, validate);
  const [edit, setEdit] = useState<Holding | null>(null);
  const [error, setError] = useState("");
  const [wallet, setWallet] = useState<string | null>(null);
  const update = (patch: Partial<typeof state>) =>
    setState((s) => ({ ...s, ...patch }));
  useEffect(() => {
    if (!state.stream) return;
    const timer = setInterval(
      () =>
        setState((s) => ({
          ...s,
          tick: s.tick + 1,
          candles: {
            ...s.candles,
            [s.asset]: tick(s.candles[s.asset], s.tick + 1),
          },
        })),
      3500,
    );
    return () => clearInterval(timer);
  }, [state.stream, state.asset, setState]);
  const candles = state.candles[state.asset].slice(
    -Number(state.window.split(" ")[0]),
  );
  const price = lastPrice(candles);
  const positions = valuation(state.holdings, state.candles);
  const total = positions.reduce((s, p) => s + p.value, 0);
  const gasRows = gas.filter((g) => g.network === state.network);
  const clusterRows = wallets.filter(
    (w) => state.cluster === "All" || w.cluster === state.cluster,
  );
  const selectedWallet = clusterRows.find((w) => w.id === wallet);
  return (
    <Shell
      slug="chainpulse"
      title="ChainPulse"
      subtitle="Market research, portfolio exposure and wallet activity."
      accent="#526bce"
      tabs={["Market", "Portfolio", "Wallets", "Token Calendar / Gas"]}
      view={state.view}
      onView={(v) => update({ view: v })}
      onReset={() => {
        reset();
        setEdit(null);
        setWallet(null);
      }}
      actions={
        <Button
          variant="secondary"
          onClick={() =>
            csv(
              state.view === "Portfolio"
                ? "chainpulse-holdings"
                : `chainpulse-${state.asset}-candles`,
              state.view === "Portfolio"
                ? positions.map((p) => ({ ...p }))
                : candles.map((c) => ({ asset: state.asset, ...c })),
            )
          }
        >
          Export {state.view === "Portfolio" ? "holdings" : "candles"}
        </Button>
      }
    >
      <Notice>Prices and ticks are simulated October fixtures.</Notice>
      <div className="product-filters">
        <Select
          label="Asset"
          value={state.asset}
          onChange={(asset) => update({ asset })}
          options={["ETH", "BTC"]}
        />
        <Select
          label="Time window"
          value={state.window}
          onChange={(window) => update({ window })}
          options={["20 candles", "8 candles"]}
        />
        <Button
          variant="secondary"
          onClick={() => update({ stream: !state.stream })}
        >
          {state.stream ? "Pause simulated ticks" : "Resume simulated ticks"}
        </Button>
        <span className="product-chip">
          {state.stream ? "Sample stream running" : "Sample stream paused"}
        </span>
      </div>
      {state.view === "Market" && (
        <>
          <Kpis
            items={[
              { label: `${state.asset} last close`, value: dollars(price) },
              {
                label: "Window high",
                value: dollars(Math.max(...candles.map((c) => c.high))),
              },
              {
                label: "Window low",
                value: dollars(Math.min(...candles.map((c) => c.low))),
              },
              {
                label: "Window volume",
                value: candles.reduce((s, c) => s + c.volume, 0).toFixed(0),
                note: `Sample ${state.asset} units`,
              },
            ]}
          />
          <div className="product-grid">
            <Card title={`${state.asset} / USD · 30-minute candles`}>
              <Candlesticks rows={candles} asset={state.asset} />
              <details>
                <summary>Read OHLC values</summary>
                <Table
                  caption="Exact fictional candle values"
                  heads={["Time", "Open", "High", "Low", "Close"]}
                >
                  {candles.map((c) => (
                    <tr key={c.time}>
                      <td>{c.time.slice(11)}</td>
                      <td>{c.open.toFixed(2)}</td>
                      <td>{c.high.toFixed(2)}</td>
                      <td>{c.low.toFixed(2)}</td>
                      <td>{c.close.toFixed(2)}</td>
                    </tr>
                  ))}
                </Table>
              </details>
            </Card>
            <Card title="Sample order depth">
              <Table
                caption="Visible sample bids and asks around current close"
                heads={["Side", "Price USD", "Quantity"]}
              >
                {depth(price).map((d, i) => (
                  <tr key={i}>
                    <td
                      style={{
                        color: d.side === "ask" ? "#c14b60" : "#278568",
                      }}
                    >
                      {d.side}
                    </td>
                    <td>{d.price.toFixed(2)}</td>
                    <td>{d.quantity.toFixed(2)}</td>
                  </tr>
                ))}
              </Table>
            </Card>
          </div>
        </>
      )}
      {state.view === "Portfolio" && (
        <>
          <Kpis
            items={[
              { label: "Portfolio value", value: dollars(total) },
              {
                label: "Cost basis",
                value: dollars(positions.reduce((s, p) => s + p.cost, 0)),
              },
              {
                label: "Unrealized P/L",
                value: dollars(positions.reduce((s, p) => s + p.pnl, 0)),
              },
              { label: "Sample holdings", value: positions.length },
            ]}
          />
          <div className="product-grid">
            <Card title="Positions">
              <Table
                caption="Positions valued at each asset’s latest sample close"
                heads={[
                  "Asset",
                  "Quantity",
                  "Average cost",
                  "Value",
                  "P/L",
                  "Action",
                ]}
              >
                {positions.map((p) => (
                  <tr key={p.asset}>
                    <td>{p.asset}</td>
                    <td>{p.quantity}</td>
                    <td>{dollars(p.averageCost)}</td>
                    <td>{dollars(p.value)}</td>
                    <td>{dollars(p.pnl)}</td>
                    <td>
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setEdit({ ...p });
                          setError("");
                        }}
                      >
                        Edit holding
                      </Button>
                    </td>
                  </tr>
                ))}
              </Table>
              <Button
                variant="secondary"
                onClick={() => {
                  setEdit({
                    asset: state.asset,
                    quantity: 0,
                    averageCost: price,
                  });
                  setError("");
                }}
              >
                Add / replace sample holding
              </Button>
            </Card>
            <Card title="Allocation">
              <Bars
                rows={positions.map((p) => ({
                  label: p.asset,
                  value: total ? (p.value / total) * 100 : 0,
                }))}
                format={(v) => `${v.toFixed(1)}%`}
              />
              <p>P/L = quantity × (latest sample price − average cost).</p>
            </Card>
          </div>
        </>
      )}
      {state.view === "Wallets" && (
        <>
          <div className="product-filters">
            <Select
              label="Research cluster"
              value={state.cluster}
              onChange={(cluster) => {
                update({ cluster });
                setWallet(null);
              }}
              options={["All", "Builders", "Treasuries"]}
            />
          </div>
          <div className="product-grid">
            <Card title="Cluster members">
              {clusterRows.map((w) => (
                <div className="product-record" key={w.id}>
                  <Button variant="secondary" onClick={() => setWallet(w.id)}>
                    {w.label}
                  </Button>
                  <p>
                    {w.cluster} · {w.balance} ETH sample balance
                  </p>
                </div>
              ))}
            </Card>
            <Card title="Wallet activity">
              {selectedWallet ? (
                <>
                  <h3>{selectedWallet.label}</h3>
                  {selectedWallet.activity.map((a) => (
                    <p key={a}>{a}</p>
                  ))}
                </>
              ) : (
                <Empty>Select a wallet in this cluster.</Empty>
              )}
            </Card>
          </div>
        </>
      )}
      {state.view === "Token Calendar / Gas" && (
        <div className="product-grid equal">
          <Card title={`${state.asset} research calendar`}>
            {events
              .filter((e) => e.asset === state.asset)
              .map((e) => (
                <div key={e.id} className="product-record">
                  <strong>
                    {e.date} · {e.kind}
                  </strong>
                  <p>{e.description}</p>
                  <Button
                    variant="secondary"
                    onClick={() =>
                      update({
                        bookmarks: state.bookmarks.includes(e.id)
                          ? state.bookmarks.filter((id) => id !== e.id)
                          : [...state.bookmarks, e.id],
                      })
                    }
                  >
                    {state.bookmarks.includes(e.id)
                      ? "Remove bookmark"
                      : "Bookmark event"}
                  </Button>
                </div>
              ))}
          </Card>
          <Card title="Sample network gas">
            <Select
              label="Network"
              value={state.network}
              onChange={(network) => update({ network })}
              options={["Ethereum", "Arbitrum"]}
            />
            <h3>Median {median(gasRows.map((g) => g.gwei)).toFixed(2)} gwei</h3>
            <p>
              {state.network === "Ethereum"
                ? "Research threshold: 20 gwei"
                : "Research threshold: 0.15 gwei"}{" "}
              ·{" "}
              {median(gasRows.map((g) => g.gwei)) >
              (state.network === "Ethereum" ? 20 : 0.15)
                ? "Above sample threshold"
                : "Below sample threshold"}
            </p>
            <Bars
              rows={gasRows.map((g) => ({
                label: g.time.slice(11),
                value: g.gwei,
              }))}
              format={(v) => `${v.toFixed(2)} gwei`}
            />
          </Card>
        </div>
      )}
      {edit && (
        <Dialog title="Sample portfolio holding" onClose={() => setEdit(null)}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (
                !Number.isFinite(edit.quantity) ||
                edit.quantity < 0 ||
                !Number.isFinite(edit.averageCost) ||
                edit.averageCost < 0
              ) {
                setError(
                  "Quantity and average cost must be nonnegative numbers.",
                );
                return;
              }
              setState((s) => saveHolding(s, edit));
              setEdit(null);
            }}
          >
            <Select
              label="Asset"
              value={edit.asset}
              onChange={(asset) => setEdit({ ...edit, asset })}
              options={["ETH", "BTC"]}
            />
            <Field
              label="Quantity"
              type="number"
              step="any"
              value={edit.quantity}
              onChange={(e) =>
                setEdit({ ...edit, quantity: Number(e.target.value) })
              }
            />
            <Field
              label="Average cost per unit (USD)"
              type="number"
              step="any"
              value={edit.averageCost}
              onChange={(e) =>
                setEdit({ ...edit, averageCost: Number(e.target.value) })
              }
            />
            {error && (
              <p role="alert" className="product-error">
                {error}
              </p>
            )}
            <Button type="submit">Save holding</Button>
          </form>
        </Dialog>
      )}
    </Shell>
  );
}
