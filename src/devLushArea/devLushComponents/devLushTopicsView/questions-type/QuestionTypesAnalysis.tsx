import React from 'react';
import Markdown from 'react-markdown';

// We can import the markdown file directly as a raw string if Vite is configured for it, 
// or just embed it. Since we know the content, embedding it is safer.
const markdownContent = `
# Analysis of Question Types in Lab Simulations

This document elaborates on the various interactive question types identified across several key biological and medical simulations.

## 1. List of Available Question Types

Based on the inspection of **Developmental Biology**, **Build a DNA Strand**, **Dose-Response Simulation**, **Recognize Pathological Patterns**, and **Ecosystem Balance Simulation**, the following question types are available:

| Type | Description | Key Labs Using It |
| :--- | :--- | :--- |
| **Slider** | Users interact with a time or variable slider to observe changes in a biological system. | Developmental Biology: Chapter 1 |
| **Interactive-Visual** | Complex visual interactions where users manipulate variables (e.g., transcription factors, stressors) to trigger specific outcomes. | Developmental Biology: Chapters 2 & 3, Recognize Pathological Patterns |
| **Build** | A construction-based activity where users assemble biological structures piece by piece. | Build a DNA Strand |
| **Dose-Response** | A specialized simulation where users adjust dosage to find a specific "Therapeutic Window" while avoiding toxicity. | Dose-Response Simulation |
| **Simulation** | A multi-variable system where users must find a stable equilibrium state. | Ecosystem Balance Simulation |
| **Drag-and-Drop-Sequence** | Users must order steps of a process (e.g., ADME, Pathogenesis) chronologically. | Pharmacology, Pathology |
| **Identify** | Visual identification task where users click on specific regions or cells based on morphological cues. | Pathology (Tissue Analysis) |
| **Punnett** | A specialized genetic tool for predicting offspring genotypes and phenotypes. | Mendelian Genetics |
| **Select** | Standard multiple-choice questions used for conceptual checks. | Pathology, Genetics |
| **Pyramid** | A hierarchical ordering task, typically used for energy or trophic levels. | Ecosystem Balance Simulation (Energy Pyramid) |

---

## 2. Prompts for Each Question Type

Below are the prompts used to trigger or guide these specific question types in the lab data:

### Slider (Developmental Biology: Chapter 1: Embryonic Development)
> "Use the time slider to observe development. Find the stage where the embryo becomes a hollow ball with an inner cell mass."

### Interactive-Visual (Developmental Biology: Chapter 2: Cell Division & Growth, Chapter 3: Genetic Expression, and Recognize Pathological Patterns)
> "Compare standard cell division (with growth) to embryonic cleavage. What distinguishes cleavage from adult cell division?"
> "Activate transcription factors to differentiate a stem cell. Configure gene expression to create a NEURON."
> "Cells adapt to stress. Apply different stressors to see how a layer of tissue responds. A weightlifter's muscles grow larger due to increased workload. This is an example of:"

### Build (Build a DNA Strand)
> "An unzipped DNA strand is shown. Your task is to build the complementary strand by selecting the correct base pairs."

### Dose-Response (Dose-Response Simulation)
> "Adjust the dosage to find the THERAPEUTIC WINDOW (50-80% effect without toxicity). Set the dosage to achieve a therapeutic effect without toxicity."

### Simulation (Ecosystem Balance Simulation)
> "A stable ecosystem requires a delicate balance between producers, herbivores, and carnivores. Too many predators or too few producers can lead to a collapse. Adjust the populations to create a stable ecosystem that runs for 10 generations."

### Drag-and-Drop-Sequence (Pathogenesis)
> "Pathogenesis describes the sequence of events in response to an injurious agent. Arrange the steps of lung cancer development from smoking in the correct order."

### Identify (Tissue Sample Analysis)
> "Examine this tissue sample. Click on all ABNORMAL cells. Identify abnormal cells based on visual cues."

### Punnett (Mendelian Genetics)
> "Brown eyes (B) are dominant to blue eyes (b). Predict the outcome of a cross between two heterozygous parents (Bb). What percentage of offspring are predicted to have the dominant phenotype (Brown eyes)?"

### Select (Signs of Inflammation)
> "Inflammation is a key pathological process. Which cellular change indicates INFLAMMATION?"

### Pyramid (Energy Pyramid)
> "The flow of energy in an ecosystem can be visualized as a pyramid. Each level up has significantly less energy than the one below it. Build the energy pyramid from the bottom up."

---

## 3. Conclusive Summary

The current suite of simulations utilizes a diverse array of interactive modalities that move beyond simple multiple-choice testing. By incorporating **Build**, **Slider**, and **Simulation** types, the platform encourages active learning and experimental discovery. 
- **Thematic Consistency**: Each lab uses question types that are logically tied to the subject matter (e.g., Punnett squares for genetics, dose-response curves for pharmacology).
- **Gamification**: Types like "Build" and "Simulation" provide immediate visual feedback, making the learning process feel more like a game than a test.
- **Scaffolding**: The use of "Theory" sections with analogies and applications provides necessary context before and after the interaction.

---

## 4. Improvement Feedback

While the current question types are effective, the following improvements could enhance the educational impact:

1. **Cross-Type Integration**: Currently, question types are somewhat isolated. For example, a **Dose-Response** simulation could lead into an **Identify** task where users see the cellular effects of the chosen dose.
2. **Dynamic Difficulty**: Implement "Adaptive Questioning" where the complexity of a **Simulation** or **Build** task increases based on the user's previous performance.
3. **Collaborative Simulations**: For types like **Ecosystem Balance**, allowing multiple users to control different trophic levels simultaneously could teach complex systems thinking more effectively.
4. **Enhanced Visual Feedback for "Identify"**: In the **Identify** type, providing real-time "heatmaps" or highlighting features as the user hovers could help train the eye for pathology more effectively than a simple click-to-select.
5. **Standardization of "Interactive-Visual"**: This type is currently a "catch-all." Breaking it down into more specific sub-types (e.g., "Pathway-Activation", "Stressor-Response") would help in data tracking and analytics.
`;

const QuestionTypesAnalysis: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
      <div className="markdown-body">
        <Markdown>{markdownContent}</Markdown>
      </div>
    </div>
  );
};

export default QuestionTypesAnalysis;
