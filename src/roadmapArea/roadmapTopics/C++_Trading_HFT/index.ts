import { Database } from "lucide-react";
import cppTradingHFTLabRaw from "../../dataSource/cpp_trading_hft.json";
import cppTradingHFTReadingRaw from "../../readingDataSource/cpp_trading_hft.json";

// We extract the first object from the JSON arrays
const labTopic = cppTradingHFTLabRaw[0];
const readingTopic = cppTradingHFTReadingRaw[0];

// Interleave the labs and readings dynamically
const chapters: any[] = [];
const labChapters = labTopic.chapters;
const readingChapters = readingTopic.chapters;
const maxLength = Math.max(labChapters.length, readingChapters.length);

for (let i = 0; i < maxLength; i++) {
  if (i < labChapters.length) {
    chapters.push(labChapters[i]);
  }
  if (i < readingChapters.length) {
    chapters.push(readingChapters[i]);
  }
}

export const cppTradingHFTData = {
  id: labTopic.id,
  title: labTopic.title,
  icon: Database,
  longDescription: labTopic.longDescription,
  chapters,
};

