import { Card, Badge } from "../shared";
import type { Creative } from "./data";
export function CreativeArt({ creative }: { creative: Creative }) {
  return (
    <Card>
      <div
        style={{
          minHeight: 210,
          borderRadius: 12,
          padding: 28,
          background:
            creative.format === "Social square"
              ? "#244c42"
              : creative.format === "Display banner"
                ? "#eee5ce"
                : "#17324c",
          color: creative.format === "Display banner" ? "#17324c" : "#fff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          overflow: "hidden",
        }}
      >
        <span style={{ letterSpacing: 3, fontSize: 12 }}>
          COMMON GOODS / 2026
        </span>
        <strong style={{ fontSize: 30, lineHeight: 1.15, maxWidth: 260 }}>
          {creative.title}
        </strong>
        <span style={{ fontSize: 13 }}>Discover the collection ↗</span>
      </div>
      <div className="product-record">
        <strong>{creative.format}</strong>
        <Badge>{creative.reviewStatus}</Badge>
        <p>{creative.reviewNote || "Awaiting sample creative review"}</p>
      </div>
    </Card>
  );
}
