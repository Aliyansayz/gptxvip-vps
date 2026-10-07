import type { ProductEvent } from "./data";
export function streamEvent(events: ProductEvent[]): ProductEvent {
  const i = events.length;
  return {
    id: `stream-${i + 1}`,
    userId: `sample-user-${i % 12}`,
    sessionId: `stream-session-${i % 12}`,
    timestamp: `2026-10-08T14:${String(i % 60).padStart(2, "0")}:00`,
    event: ["Visit", "Signup", "Activate"][i % 3],
    platform: ["Web", "iOS", "Android"][i % 3],
    channel: ["Organic", "Paid", "Referral"][i % 3],
  };
}
