import { LabData } from "../../../types";
import { SavedTheory } from "../TheoryCollectionContext";
import devLushChaptersRaw from "../../devLushComponents/data/index";

export const bioFiles = [
  "cellular-biology",
  "genetics",
  "ecology",
  "pathology",
  "pharmacology",
  "physiology",
  "developmental-biology",
  "neuroscience",
  "genetic-engineering",
  "immunology",
  "microbiology",
  "proteomics",
];
export const medFiles = [
  "med-overview",
  "cardiology",
  "myocardial-infarction",
  "clinical-chemistry",
  "clinical-lab",
  "hematology",
  "point-of-care",
  "physiology",
  "toxicology",
  "anatomy",
];
export const devLushFiles = [
  "offensiveAi",
  "ecommerce",
  "accounting",
  "finance",
  "agentTypes",
  "webBugBounty",
  "systemDesign",
  "reinforcementLearning",
  "devtools",
  "healthcare",
  "legal",
  "supplychain",
  "helpdesk",
];

export const fetchLabsData = async (
  type: "bio" | "med" | "devLush",
  filesToFetch?: string[],
): Promise<{ fileName: string; labs: any[] }[]> => {
  if (type === "devLush") {
    // For DevLush, we just group the data from devLushChaptersRaw by a mock "fileName" based on category/topic, 
    // or just return all in one chunk if no specific files requested.
    const files = filesToFetch || devLushFiles;
    
    return files.map(file => {
      // Very naive mock grouping to match the structure
      // In reality, devLushChaptersRaw doesn't easily map to these files directly by name
      // but we can return the whole set as one big "file" or just pass devLushChaptersRaw.
      return { fileName: file, labs: devLushChaptersRaw };
    });
  }

  const files = filesToFetch || (type === "bio" ? bioFiles : medFiles);
  const basePath = type === "bio" ? "/bio_topics" : "/med_topics";

  const results = await Promise.all(
    files.map(async (file) => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        const res = await fetch(`${basePath}/${file}.json`, { signal: controller.signal });
        clearTimeout(timeoutId);
        if (!res.ok) return { fileName: file, labs: [] };
        const text = await res.text();
        const data: LabData[] = text ? JSON.parse(text) : [];
        return { fileName: file, labs: Array.isArray(data) ? data : [] };
      } catch (e) {
        console.error(`Failed to fetch ${file}.json`, e);
        return { fileName: file, labs: [] };
      }
    }),
  );

  return results;
};

export const extractTheoriesFromLabs = (
  labs: any[],
  courseType: "bio" | "med" | "devLush",
): Omit<SavedTheory, "id" | "savedAt">[] => {
  const theories: Omit<SavedTheory, "id" | "savedAt">[] = [];

  labs.forEach((lab) => {
    if (!lab.interactive_questions) return;
    if (Array.isArray(lab.interactive_questions)) {
      lab.interactive_questions.forEach((exercise: any) => {
        if (exercise.theory) {
          theories.push({
            labId: lab.labComponentId || "unknown",
            chapterTitle: lab.chapter_title || "Unknown Chapter",
            exerciseTitle: exercise.title || exercise.concept_tested || "Concept",
            courseType,
            theory: exercise.theory,
          });
        }
      });
    }
  });

  return theories;
};
