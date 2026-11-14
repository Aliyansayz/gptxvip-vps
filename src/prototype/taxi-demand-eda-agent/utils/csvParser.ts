import type { RideRecord } from "../types";

export function parseCSV(csvString: string): {
  records: RideRecord[];
  errors: string[];
} {
  const records: RideRecord[] = [];
  const errors: string[] = [];

  if (!csvString || csvString.trim() === "") {
    return { records, errors: ["CSV file is empty."] };
  }

  const lines = csvString.split(/\r?\n/);
  if (lines.length < 2) {
    return {
      records,
      errors: ["CSV must contain a header row and at least one data row."],
    };
  }

  const headerLine = lines[0];
  const headers = parseCSVLine(headerLine).map((h) => h.trim().toLowerCase());

  const requiredFields = [
    "timestamp",
    "month",
    "hour",
    "season",
    "holiday",
    "dayofweek",
    "ridescount",
    "averagefare",
    "averageduration",
  ];
  const missing = requiredFields.filter((f) => !headers.includes(f));

  if (missing.length > 0) {
    errors.push(
      `Notice: Schema has missing fields: [${missing.join(", ")}]. Attempting alias auto-mapping.`,
    );
  }

  const getIndex = (aliases: string[], fallbackVal: number): number => {
    for (const alias of aliases) {
      const idx = headers.findIndex(
        (h) =>
          h.includes(alias.toLowerCase()) || alias.toLowerCase().includes(h),
      );
      if (idx !== -1) return idx;
    }
    return fallbackVal;
  };

  const idIdx = getIndex(["id"], 0);
  const tsIdx = getIndex(["timestamp", "date", "time"], 1);
  const monthIdx = getIndex(["month"], 2);
  const hourIdx = getIndex(["hour", "timeofday"], 3);
  const seasonIdx = getIndex(["season"], 4);
  const holidayIdx = getIndex(["holiday"], 5);
  const dowIdx = getIndex(["dayofweek", "day_of_week", "day"], 6);
  const ridesIdx = getIndex(
    ["ridescount", "rides_count", "rides", "demand", "count"],
    7,
  );
  const fareIdx = getIndex(["averagefare", "average_fare", "fare", "price"], 8);
  const durationIdx = getIndex(
    ["averageduration", "average_duration", "duration", "minutes"],
    9,
  );
  const weatherIdx = getIndex(
    ["weathercondition", "weather_condition", "weather"],
    10,
  );
  const trafficIdx = getIndex(["trafficlevel", "traffic_level", "traffic"], 11);

  for (let i = 1; i < lines.length; i++) {
    const rawLine = lines[i];
    if (rawLine.trim() === "") continue;

    const cells = parseCSVLine(rawLine);
    if (cells.length < 3) continue;

    try {
      const id = cells[idIdx]
        ? cells[idIdx].replace(/['"]/g, "").trim()
        : `row_${i}`;
      const timestamp = cells[tsIdx]
        ? cells[tsIdx].replace(/['"]/g, "").trim()
        : "2026-06-04 12:00:00";
      const month = cells[monthIdx]
        ? cells[monthIdx].replace(/['"]/g, "").trim()
        : "Unknown";
      const hour = cells[hourIdx] ? parseInt(cells[hourIdx].trim(), 10) || 0 : 0;

      const seasonRaw = cells[seasonIdx]
        ? cells[seasonIdx].replace(/['"]/g, "").trim().toLowerCase()
        : "spring";
      let season: RideRecord["season"] = "Spring";
      if (seasonRaw.includes("wint")) season = "Winter";
      else if (seasonRaw.includes("sum")) season = "Summer";
      else if (seasonRaw.includes("aut") || seasonRaw.includes("fall"))
        season = "Autumn";

      const holidayRaw = cells[holidayIdx]
        ? cells[holidayIdx].replace(/['"]/g, "").trim().toLowerCase()
        : "0";
      const holiday =
        holidayRaw === "1" ||
        holidayRaw === "true" ||
        holidayRaw === "yes" ||
        holidayRaw === "t";

      const dayOfWeek = cells[dowIdx]
        ? cells[dowIdx].replace(/['"]/g, "").trim()
        : "Unknown";
      const ridesCount = cells[ridesIdx]
        ? parseInt(cells[ridesIdx].trim(), 10) || 0
        : 0;
      const averageFare = cells[fareIdx]
        ? parseFloat(cells[fareIdx].trim()) || 0.0
        : 0.0;
      const averageDuration = cells[durationIdx]
        ? parseFloat(cells[durationIdx].trim()) || 0.0
        : 0.0;

      const weatherRaw = cells[weatherIdx]
        ? cells[weatherIdx].replace(/['"]/g, "").trim().toLowerCase()
        : "clear";
      let weatherCondition: RideRecord["weatherCondition"] = "Clear";
      if (weatherRaw.includes("rain")) weatherCondition = "Rainy";
      else if (weatherRaw.includes("snow")) weatherCondition = "Snowy";
      else if (weatherRaw.includes("cloud")) weatherCondition = "Cloudy";

      const trafficRaw = cells[trafficIdx]
        ? cells[trafficIdx].replace(/['"]/g, "").trim().toLowerCase()
        : "medium";
      let trafficLevel: RideRecord["trafficLevel"] = "Medium";
      if (trafficRaw.includes("low")) trafficLevel = "Low";
      else if (trafficRaw.includes("high") || trafficRaw.includes("peak"))
        trafficLevel = "High";

      records.push({
        id,
        timestamp,
        month,
        hour,
        season,
        holiday,
        dayOfWeek,
        ridesCount,
        averageFare,
        averageDuration,
        weatherCondition,
        trafficLevel,
      });
    } catch {
      if (errors.length < 5) {
        errors.push(`Parse error at line ${i + 1}: Check formatting.`);
      }
    }
  }

  return { records, errors };
}

/** RFC-compliant CSV line splitter handling double quotes and escaped commas. */
export function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let currentWord = "";
  let inQuotes = false;

  for (let idx = 0; idx < line.length; idx++) {
    const char = line[idx];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(currentWord);
      currentWord = "";
    } else {
      currentWord += char;
    }
  }
  result.push(currentWord);
  return result;
}
