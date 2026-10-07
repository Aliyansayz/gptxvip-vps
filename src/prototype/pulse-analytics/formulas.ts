import type { ProductEvent, Cohort } from "./data";
export const filterEvents = (
  events: ProductEvent[],
  channel: string,
  platform: string,
  range: string,
) =>
  events.filter(
    (e) =>
      (channel === "All" || e.channel === channel) &&
      (platform === "All" || e.platform === platform) &&
      (range === "All dates" ||
        (range === "Oct 1–4"
          ? e.timestamp.slice(0, 10) >= "2026-10-01" && e.timestamp.slice(0, 10) <= "2026-10-04"
          : e.timestamp.slice(0, 10) >= "2026-10-05" && e.timestamp.slice(0, 10) <= "2026-10-08")),
  );
export const unique = (events: ProductEvent[]) =>
  new Set(events.map((e) => e.userId)).size;
export const funnel = (events: ProductEvent[], steps: string[]) => {
  const paths = Array.from(new Set(events.map((e) => e.userId))).map((user) =>
    events
      .filter((e) => e.userId === user)
      .sort((a, b) => a.timestamp.localeCompare(b.timestamp)),
  );
  return steps.map((label, i) => ({
    label,
    value: paths.filter((path) => {
      let step = 0;
      for (const event of path) if (event.event === steps[step]) step++;
      return step > i;
    }).length,
  }));
};
export const retention = (cohort: Cohort, events: ProductEvent[]) =>
  [0, 1, 2, 3, 4].map((day) => {
    const date = new Date(`${cohort.startPeriod}T00:00:00Z`);
    date.setUTCDate(date.getUTCDate() + day);
    const label = date.toISOString().slice(0, 10);
    return {
      label,
      value: unique(
        events.filter(
          (e) =>
            cohort.userIds.includes(e.userId) && e.timestamp.startsWith(label),
        ),
      ),
      denominator: cohort.userIds.length,
    };
  });
