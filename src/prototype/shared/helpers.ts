export const money = (minorUnits: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(minorUnits / 100);
export const sum = <T>(rows: T[], value: (row: T) => number) =>
  rows.reduce((total, row) => total + value(row), 0);
export const uid = (rows: { id: string }[], prefix = "record") =>
  `${prefix}-${Math.max(0, ...rows.map((row) => Number(row.id.split("-").pop()) || 0)) + 1}`;

export function csv(name: string, rows: object[]) {
  const keys = [...new Set(rows.flatMap((row) => Object.keys(row)))];
  const quote = (value: unknown) =>
    `"${String(value ?? "").replaceAll('"', '""')}"`;
  const text = [
    "Browser demo sample data",
    keys.map(quote).join(","),
    ...rows.map((row) =>
      keys.map((key) => quote((row as Record<string, unknown>)[key])).join(","),
    ),
  ].join("\r\n");
  const url = URL.createObjectURL(
    new Blob([text], { type: "text/csv;charset=utf-8" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = `${name}.csv`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 500);
}
export function printReport(title: string, rows: object[]) {
  const escape = (value: unknown) =>
    String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  const popup = window.open("", "_blank");
  if (!popup) return;
  const keys = [...new Set(rows.flatMap((row) => Object.keys(row)))];
  popup.document.write(
    `<html><head><title>${escape(title)}</title><style>body{font:14px system-ui;padding:30px;color:#172033}table{border-collapse:collapse;width:100%}td,th{padding:10px;border:1px solid #ccd3df;text-align:left}</style></head><body><h1>${escape(title)}</h1><p>Fictional browser demo sample data</p><table><thead><tr>${keys.map((key) => `<th>${escape(key)}</th>`).join("")}</tr></thead><tbody>${rows.map((row) => `<tr>${keys.map((key) => `<td>${escape((row as Record<string, unknown>)[key])}</td>`).join("")}</tr>`).join("")}</tbody></table></body></html>`,
  );
  popup.document.close();
  popup.print();
}
