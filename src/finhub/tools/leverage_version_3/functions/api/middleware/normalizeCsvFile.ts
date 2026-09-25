export type Candle = {
    datetime: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
};

export function normalizeCSV(csvText: string): string {
    const lines = csvText
        .trim()
        .split(/\r?\n/)
        .filter(line => line.trim());

    if (lines.length < 2) {
        throw new Error("CSV has no data");
    }

    // Detect delimiter
    const header = lines[0];
    const delimiter = header.includes("\t") ? "\t" : ",";

    const headers = header
        .split(delimiter)
        .map(h => h.trim().replace(/[<>]/g, "").toLowerCase());

    // Detect style
    const isStyle1 =
        headers.includes("date") &&
        headers.includes("time") &&
        headers.includes("open") &&
        headers.includes("tickvol");

    const isStyle2 =
        headers.includes("date") &&
        headers.includes("open") &&
        headers.includes("volume") &&
        !headers.includes("datetime");

    const isNormal =
        headers.includes("datetime") &&
        headers.includes("open") &&
        headers.includes("volume");

    const getIndex = (name: string) => headers.indexOf(name);

    const candles: Candle[] = [];

    for (let i = 1; i < lines.length; i++) {
        const cols = lines[i]
            .split(delimiter)
            .map(c => c.trim());

        if (cols.length !== headers.length) continue;

        let datetime = "";
        let volume = 0;

        if (isStyle1) {
            // <DATE> <TIME> <OPEN> <HIGH> <LOW> <CLOSE> <TICKVOL> ...
            datetime =
                cols[getIndex("date")] +
                " " +
                cols[getIndex("time")];

            volume = Number(cols[getIndex("tickvol")]);
        }
        else if (isStyle2) {
            // DATE, OPEN, HIGH, LOW, CLOSE, VOLUME
            datetime = cols[getIndex("date")];
            volume = Number(cols[getIndex("volume")]);
        }
        else if (isNormal) {
            // datetime, open, high, low, close, volume
            datetime = cols[getIndex("datetime")];
            volume = Number(cols[getIndex("volume")]);
        }
        else {
            throw new Error("Unknown CSV format");
        }

        candles.push({
            datetime,
            open: Number(cols[getIndex("open")]),
            high: Number(cols[getIndex("high")]),
            low: Number(cols[getIndex("low")]),
            close: Number(cols[getIndex("close")]),
            volume
        });
    }

    // Output normalized CSV
    const output = [
        "datetime,open,high,low,close,volume",
        ...candles.map(c =>
            [
                c.datetime,
                c.open,
                c.high,
                c.low,
                c.close,
                c.volume
            ].join(",")
        )
    ];

    return output.join("\n");
}
