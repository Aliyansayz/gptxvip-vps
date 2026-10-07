import { Card, Table, Bars } from "../shared";
import type { UsageRecord, Widget } from "./data";
import { metricTotal } from "./formulas";
export function WidgetView({
  widget,
  rows,
}: {
  widget: Widget;
  rows: UsageRecord[];
}) {
  const data = rows.filter((r) => r.metric === widget.metric);
  return (
    <Card title={widget.title}>
      {widget.type === "metric" ? (
        <>
          <strong style={{ fontSize: 40 }}>
            {metricTotal(data, widget.metric).toLocaleString()}
          </strong>
          <p>October 1–5 sample total</p>
        </>
      ) : widget.type === "trend" ? (
        <Bars rows={data.map((r) => ({ label: r.date, value: r.value }))} />
      ) : (
        <Table
          caption={`${widget.title} · selected tenant sample values`}
          heads={["Date", "Value"]}
        >
          {data.map((r) => (
            <tr key={r.id}>
              <td>{r.date}</td>
              <td>
                {r.metric === "revenue"
                  ? `$${r.value.toLocaleString()}`
                  : r.value.toLocaleString()}
              </td>
            </tr>
          ))}
        </Table>
      )}
    </Card>
  );
}
