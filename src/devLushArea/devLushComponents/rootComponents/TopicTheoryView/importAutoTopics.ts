import type { SavedTheory } from "../../../agentDevRootComponents/TheoryCollectionContext";
import devLushChaptersRaw from "../../data/index";

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

export const fetchDevLushLabsData = async (): Promise<ImportableLab[]> => {
  return devLushChaptersRaw as unknown as ImportableLab[];
};

export const extractTheoriesFromDevLush = (
  labs: ImportableLab[]
): Omit<SavedTheory, "id" | "savedAt">[] => {
  const theories: Omit<SavedTheory, "id" | "savedAt">[] = [];

  labs.forEach((lab) => {
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
