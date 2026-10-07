import { Card, Badge } from "../shared";
export function Onboarding({
  items,
}: {
  items: { label: string; done: boolean }[];
}) {
  return (
    <Card title="Make this workspace yours">
      <p>
        {items.filter((i) => i.done).length} of {items.length} steps complete
      </p>
      {items.map((i, n) => (
        <div
          key={i.label}
          className="product-record"
          style={{ display: "flex", justifyContent: "space-between", gap: 16 }}
        >
          <strong>
            {n + 1}. {i.label}
          </strong>
          <Badge status={i.done ? "success" : "neutral"}>
            {i.done ? "Complete" : "To do"}
          </Badge>
        </div>
      ))}
    </Card>
  );
}
