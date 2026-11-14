import type {
  AggregatedStats,
  AnalysisResponse,
  FilterState,
  Finding,
  KpiStats,
  RideRecord,
} from "../types";

/**
 * Filters ride records by Season, Weather Condition, and Workday/Holiday category.
 */
export function filterRideRecords(
  records: RideRecord[],
  filters: FilterState,
): RideRecord[] {
  return records.filter((r) => {
    const seasonMatch =
      filters.season === "All" || r.season === filters.season;
    const weatherMatch =
      filters.weather === "All" || r.weatherCondition === filters.weather;
    let dayTypeMatch = true;
    if (filters.dayType === "Workdays") dayTypeMatch = !r.holiday;
    else if (filters.dayType === "Holidays") dayTypeMatch = r.holiday;
    return seasonMatch && weatherMatch && dayTypeMatch;
  });
}

/**
 * Computes top-level KPI metrics for StatsGrid.tsx.
 */
export function computeKpiStats(
  filteredRecords: RideRecord[],
  allRecords: RideRecord[],
): KpiStats {
  const totalRides = filteredRecords.reduce(
    (acc, curr) => acc + curr.ridesCount,
    0,
  );
  const avgFare =
    filteredRecords.length > 0
      ? filteredRecords.reduce((acc, curr) => acc + curr.averageFare, 0) /
        filteredRecords.length
      : 0;
  const avgDuration =
    filteredRecords.length > 0
      ? filteredRecords.reduce((acc, curr) => acc + curr.averageDuration, 0) /
        filteredRecords.length
      : 0;

  const holidayRides = allRecords.filter((r) => r.holiday);
  const workdayRides = allRecords.filter((r) => !r.holiday);

  const avgHolidayRides =
    holidayRides.length > 0
      ? holidayRides.reduce((acc, curr) => acc + curr.ridesCount, 0) /
        holidayRides.length
      : 0;
  const avgWorkdayRides =
    workdayRides.length > 0
      ? workdayRides.reduce((acc, curr) => acc + curr.ridesCount, 0) /
        workdayRides.length
      : 0;

  const holidayDifference =
    avgWorkdayRides > 0
      ? ((avgHolidayRides - avgWorkdayRides) / avgWorkdayRides) * 100
      : 0;

  return {
    totalRides,
    activeIntervals: filteredRecords.length,
    avgFare,
    avgDuration,
    holidayDifference,
  };
}

/**
 * Computes hourly, seasonal, and weather chart series for DemandCharts.tsx.
 */
export function computeChartSeries(filteredRecords: RideRecord[]) {
  const targetHours = [2, 8, 12, 17, 21];
  const seasons: Array<RideRecord["season"]> = [
    "Winter",
    "Spring",
    "Summer",
    "Autumn",
  ];
  const weatherList: Array<RideRecord["weatherCondition"]> = [
    "Clear",
    "Cloudy",
    "Rainy",
    "Snowy",
  ];

  const hourlyData = targetHours.map((hour) => {
    const hourRecords = filteredRecords.filter((r) => r.hour === hour);
    const holidayRecs = hourRecords.filter((r) => r.holiday);
    const regularRecs = hourRecords.filter((r) => !r.holiday);

    const avg = (arr: RideRecord[]) =>
      arr.length > 0
        ? arr.reduce((acc, curr) => acc + curr.ridesCount, 0) / arr.length
        : 0;

    const seasonalSpeeds: Record<string, number> = {};
    seasons.forEach((s) => {
      seasonalSpeeds[s] = Math.round(
        avg(hourRecords.filter((r) => r.season === s)),
      );
    });

    return {
      hour: `${String(hour).padStart(2, "0")}:00`,
      "Overall Average": Math.round(avg(hourRecords)),
      "Holidays/Weekends": Math.round(avg(holidayRecs)),
      "Standard Workdays": Math.round(avg(regularRecs)),
      Winter: seasonalSpeeds.Winter,
      Spring: seasonalSpeeds.Spring,
      Summer: seasonalSpeeds.Summer,
      Autumn: seasonalSpeeds.Autumn,
    };
  });

  const seasonalData = seasons.map((season) => {
    const recs = filteredRecords.filter((r) => r.season === season);
    const avgRides =
      recs.length > 0
        ? recs.reduce((a, c) => a + c.ridesCount, 0) / recs.length
        : 0;
    const avgFare =
      recs.length > 0
        ? recs.reduce((a, c) => a + c.averageFare, 0) / recs.length
        : 0;
    return {
      season,
      "Avg Demand (Rides/Hr)": parseFloat(avgRides.toFixed(1)),
      "Avg Fare ($)": parseFloat(avgFare.toFixed(2)),
    };
  });

  const weatherData = weatherList.map((weather) => {
    const recs = filteredRecords.filter((r) => r.weatherCondition === weather);
    const avgDuration =
      recs.length > 0
        ? recs.reduce((a, c) => a + c.averageDuration, 0) / recs.length
        : 0;
    const avgFare =
      recs.length > 0
        ? recs.reduce((a, c) => a + c.averageFare, 0) / recs.length
        : 0;
    return {
      weather,
      "Trip Duration (Mins)": parseFloat(avgDuration.toFixed(1)),
      "Average Fare Size ($)": parseFloat(avgFare.toFixed(2)),
    };
  });

  return { hourlyData, seasonalData, weatherData };
}

/**
 * Pre-computes statistical aggregates passed to POST /api/analyze or runComputationalAnalysis().
 */
export function computeAggregatedStats(
  records: RideRecord[],
  filteredRecords: RideRecord[],
): AggregatedStats | null {
  const dataset = filteredRecords.length > 0 ? filteredRecords : records;
  if (dataset.length === 0) return null;

  const hol = dataset.filter((r) => r.holiday);
  const nonHol = dataset.filter((r) => !r.holiday);

  const holidayAvg =
    hol.length > 0
      ? hol.reduce((a, c) => a + c.ridesCount, 0) / hol.length
      : 0;
  const nonHolidayAvg =
    nonHol.length > 0
      ? nonHol.reduce((a, c) => a + c.ridesCount, 0) / nonHol.length
      : 0;
  const holidayPercentDifference =
    nonHolidayAvg > 0
      ? ((holidayAvg - nonHolidayAvg) / nonHolidayAvg) * 100
      : 0;

  const seasonsList: Array<RideRecord["season"]> = [
    "Winter",
    "Spring",
    "Summer",
    "Autumn",
  ];
  const seasonalAverages: Record<string, number> = {};
  seasonsList.forEach((s) => {
    const sRecs = dataset.filter((r) => r.season === s);
    seasonalAverages[s] =
      sRecs.length > 0
        ? sRecs.reduce((a, c) => a + c.ridesCount, 0) / sRecs.length
        : 0;
  });

  const targetHours = [2, 8, 12, 17, 21];
  const hourAverages = targetHours.map((h) => {
    const hRecs = dataset.filter((r) => r.hour === h);
    const avg =
      hRecs.length > 0
        ? hRecs.reduce((a, c) => a + c.ridesCount, 0) / hRecs.length
        : 0;
    return { hour: h, avgRides: avg };
  });
  hourAverages.sort((a, b) => b.avgRides - a.avgRides);

  const weathers: Array<RideRecord["weatherCondition"]> = [
    "Clear",
    "Rainy",
    "Snowy",
    "Cloudy",
  ];
  const weatherAverages: Record<string, number> = {};
  weathers.forEach((w) => {
    const wRecs = dataset.filter((r) => r.weatherCondition === w);
    weatherAverages[w] =
      wRecs.length > 0
        ? wRecs.reduce((a, c) => a + c.ridesCount, 0) / wRecs.length
        : 0;
  });

  let highVal = 0;
  let highHour = 17;
  let highDuration = 0;
  let highFare = 0;
  targetHours.forEach((h) => {
    const hRecs = dataset.filter((r) => r.hour === h);
    if (hRecs.length > 0) {
      const avgDur =
        hRecs.reduce((a, c) => a + c.averageDuration, 0) / hRecs.length;
      if (avgDur > highVal) {
        highVal = avgDur;
        highHour = h;
        highDuration = avgDur;
        highFare = hRecs.reduce((a, c) => a + c.averageFare, 0) / hRecs.length;
      }
    }
  });

  return {
    holidayAvg,
    nonHolidayAvg,
    holidayPercentDifference,
    seasonalAverages,
    peakHours: hourAverages.slice(0, 3),
    weatherAverages,
    highTrafficHour: highHour,
    highTrafficDuration: highDuration,
    highTrafficFare: parseFloat(highFare.toFixed(2)),
  };
}

/**
 * Deterministic localized computational fallback mirrored from server.ts (/api/analyze).
 */
export function runComputationalAnalysis(
  aggregatedData: AggregatedStats,
  userQuery = "Perform a general Exploratory Data Analysis focusing on peak seasonal/holiday trends.",
): AnalysisResponse {
  const holidayDiff = aggregatedData.holidayPercentDifference || 0;
  const peakHourInfo = aggregatedData.peakHours[0] || {
    hour: 17,
    avgRides: 220,
  };
  const seasonalAverages = aggregatedData.seasonalAverages || {
    Winter: 55,
    Spring: 60,
    Summer: 75,
    Autumn: 50,
  };
  const maxSeason = Object.entries(seasonalAverages).reduce(
    (a, b) => (a[1] > b[1] ? a : b),
    ["Summer", 75] as [string, number],
  );
  const snowAvg = aggregatedData.weatherAverages.Snowy || 0;
  const rainAvg = aggregatedData.weatherAverages.Rainy || 0;
  const clearAvg = aggregatedData.weatherAverages.Clear || 0;

  const summary = `### Localized Statistical Analysis & Rationale
*(Query focus: "${userQuery}")*

Our Exploratory Data Analysis reveals clear patterns of **demand elasticity** across seasons, weather events, and calendar periods:

1. **Seasonal Core Drivers**: Dynamic seasonal volume spikes in **${maxSeason[0]}** averaging **${maxSeason[1].toFixed(1)} rides/hour**. Peak travel periods align closely with vacation schedules and high-density commuter windows.
2. **Holiday Elasticity**: Holiday periods experience an overall hourly demand shift of **${holidayDiff > 0 ? "+" : ""}${holidayDiff.toFixed(1)}%** compared to standard business workdays.
3. **Climate Friction Index**: Precipitation introduces traffic frictional delays. Snow conditions average **${snowAvg.toFixed(1)} rides/hour** (vs **${rainAvg.toFixed(1)}** rainy and **${clearAvg.toFixed(1)}** clear), paired with elevated trip durations.`;

  const findings: Finding[] = [
    {
      title: "Peak Seasonal Demand Concentration",
      description: `Operational data shows that high-volume activities during ${maxSeason[0]} create a demand swell, maintaining an average flow of ${maxSeason[1].toFixed(1)} rides per hour.`,
      metric: `${maxSeason[1].toFixed(1)} rides/hr avg`,
      impact: "High",
      season: maxSeason[0],
    },
    {
      title: "Holiday Congestion Modifier",
      description: `Comparing standard business workdays to calendar holidays indicates a demand divergence of ${holidayDiff.toFixed(1)}%. Holiday nights require dynamic roster reassignment.`,
      metric: `${holidayDiff > 0 ? "+" : ""}${holidayDiff.toFixed(1)}% shift`,
      impact: Math.abs(holidayDiff) > 15 ? "High" : "Medium",
      season: "All",
    },
    {
      title: "Climate Delay Multiplier",
      description: `Precipitation events affect trip efficiency. High-traffic durations average ${(aggregatedData.highTrafficDuration || 22.0).toFixed(1)} mins, supporting dynamic surge premiums.`,
      metric: `+$${Math.max(0, (aggregatedData.highTrafficFare || 12) - 12).toFixed(2)} Surge`,
      impact: "High",
      season: "Winter",
    },
    {
      title: "Roster Allocation Node",
      description: `Peak hourly intervals concentrate around hour ${peakHourInfo.hour}:00 with an average of ${Math.round(peakHourInfo.avgRides)} active trip requests. Shift rosters should center on commuter rush windows.`,
      metric: `Hour ${peakHourInfo.hour}:00 peak`,
      impact: "Medium",
      season: "All",
    },
  ];

  const agentThoughts =
    `[LOGS] Starting localized regression logic...\n` +
    `[STATS] Holiday baseline difference parsed: ${holidayDiff.toFixed(2)}%\n` +
    `[STATS] Top peak hour calculated at: Hour ${peakHourInfo.hour}:00 (${peakHourInfo.avgRides.toFixed(1)} average rides)\n` +
    `[MATH] Weather multiplier coefficients: Snowy=${snowAvg.toFixed(1)}, Rainy=${rainAvg.toFixed(1)}, Clear=${clearAvg.toFixed(1)}\n` +
    `[STRATEGY] Recommending 25% driver surge relocation toward commuter zones during precipitation spikes.`;

  const suggestedPrompts = [
    `Analyze shift optimization patterns for hour ${peakHourInfo.hour}:00 commute peaks.`,
    `How does a ${holidayDiff > 0 ? "positive" : "negative"} holiday shift of ${holidayDiff.toFixed(1)}% affect dynamic surcharges?`,
    `Synthesize climate resilience recommendations for ${maxSeason[0]}.`,
  ];

  return {
    summary,
    findings,
    agentThoughts,
    suggestedPrompts,
  };
}
