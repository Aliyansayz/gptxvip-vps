import { JourneyStatusMap } from "./types";

export const getStatusFromProgress = (progress: number, mapping?: JourneyStatusMap[]): string => {
  if (!mapping) return "Planning";
  
  for (const m of mapping) {
    if (progress <= m.max) {
      return m.text;
    }
  }
  return "Launched!";
};
