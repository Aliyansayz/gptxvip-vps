import React from 'react';
import { SectionHeading } from './prose';
import { ConceptList, type Concept } from './ConceptList';
import { InTheField, MentalModel, PracticalTakeaway } from './callouts';
import { cn } from './cn';

/**
 * The supporting content of a chapter's theory pane: analogy, takeaway, case
 * study, and the critical-concept glossary.
 *
 * Field names match `AgenticRoleChapter.theory_content` exactly, so a caller can
 * spread the stored object straight in: `<TheoryPanel {...theory_content} />`.
 * Kept as a plain prop bag rather than taking the chapter itself so the same
 * panel renders software-manual and blog content, which have their own shapes.
 */
export interface TheoryContent {
  content: string;
  analogy?: string;
  practical_takeaway?: string;
  case_study?: string;
  critical_concepts?: Concept[];
}

interface TheoryPanelProps extends TheoryContent {
  /** Hide the heading when the caller already has a section title. */
  showHeading?: boolean;
  className?: string;
}

/**
 * Every field is optional and conditional — a chapter authored without an
 * analogy simply has no mental-model callout, rather than rendering an empty
 * labelled box. Sparse content is common in this dataset, so empty-state shells
 * would be very visible.
 *
 * `content` is intentionally not rendered here: it is the main body and belongs
 * to the caller, so it can be split into paragraphs at the caller's discretion.
 */
export const TheoryPanel: React.FC<TheoryPanelProps> = ({
  analogy,
  practical_takeaway,
  case_study,
  critical_concepts,
  showHeading = true,
  className,
}) => (
  <div className={cn('article-prose', className)}>
    {showHeading ? (
      <SectionHeading level={2} className="first:pt-0">
        How it works
      </SectionHeading>
    ) : null}

    {/* Order matches the theory pane: orient, then act, then evidence. */}
    {analogy ? <MentalModel analogy={analogy} /> : null}
    {practical_takeaway ? <PracticalTakeaway takeaway={practical_takeaway} /> : null}
    {case_study ? <InTheField caseStudy={case_study} /> : null}

    {critical_concepts && critical_concepts.length > 0 ? (
      <ConceptList concepts={critical_concepts} />
    ) : null}
  </div>
);

