import type { SavedTheory } from "../TheoryCollectionContext";
import { devLushTopicFiles } from "../../devLushComponents/data";

type DevLushTopicFile = keyof typeof devLushTopicFiles;
interface ImportableExercise {
  title?: string;
  concept_tested?: string;
  theory?: SavedTheory["theory"];
}
interface ImportableLab {
  labComponentId?: string;
  chapter_title?: string;
  interactive_questions?: ImportableExercise[];
}

const topicFiles = devLushTopicFiles as unknown as Record<string, ImportableLab[]>;

export const devLushFiles = Object.keys(devLushTopicFiles) as DevLushTopicFile[];

export const fetchLabsData = async (
  filesToFetch?: string[],
): Promise<{ fileName: string; labs: ImportableLab[] }[]> => {
  const files = filesToFetch || devLushFiles;
  return files.flatMap((fileName) => {
    const labs = topicFiles[fileName];
    return labs ? [{ fileName, labs }] : [];
  });
};

export const extractTheoriesFromLabs = (
  labs: ImportableLab[],
): Omit<SavedTheory, "id" | "savedAt">[] => {
  const theories: Omit<SavedTheory, "id" | "savedAt">[] = [];

  labs.forEach((lab) => {
    if (!lab.interactive_questions) return;
    if (Array.isArray(lab.interactive_questions)) {
      lab.interactive_questions.forEach((exercise) => {
        if (exercise.theory) {
          theories.push({
            labId: lab.labComponentId || "unknown",
            chapterTitle: lab.chapter_title || "Unknown Chapter",
            exerciseTitle: exercise.title || exercise.concept_tested || "Concept",
            courseType: "devLush",
            theory: exercise.theory,
          });
        }
      });
    }
  });

  return theories;
};
