import { LabData } from "../../../../types";
import { SavedTheory } from "../../../agentDevRootComponents/TheoryCollectionContext";
import devLushChaptersRaw from "../../data/index";

export const fetchDevLushLabsData = async () => {
  return devLushChaptersRaw;
};

export const extractTheoriesFromDevLush = (
  labs: any[]
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
            courseType: "devLush",
            theory: exercise.theory,
          });
        }
      });
    }
  });

  return theories;
};
