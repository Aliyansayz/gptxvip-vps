import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: "What does a guide actually document?",
    answer:
      "Each guide covers one product end to end — its modules, the data it holds, and the operations that change that data. Coverage is deliberately focused: a guide answers \"how do I run this day to day\", not \"what could this ever be used for\".",
  },
  {
    question: "How is a guide structured?",
    answer:
      "Six stages, in order: intake, the working steps for each, then a completion check. You can read straight through or jump to the one stage you need, because the stages are independently addressable rather than one long narrative.",
  },
  {
    question: "What is the difference between a product guide and a field handbook?",
    answer:
      "A product guide is the reference for a system. Its field handbook is the workflow layer — the same system expressed as a sequence of decisions you make while doing the work. Every guide ships both.",
  },
  {
    question: "What does COVER PREVIEW mean on a guide?",
    answer:
      "The scope is decided and the cover exists, but the chapters are not written yet. It is there so you can see what is coming and judge whether it is worth waiting for.",
  },
  {
    question: "Are the illustrated pages interactive?",
    answer:
      "Where a guide has illustrated pages they are pannable and zoomable, showing the real interface rather than a mock-up. Guides without them use a text handbook of the same workflow, and are labelled ILLUSTRATED HANDBOOK or TEXT HANDBOOK in the header.",
  },
  {
    question: "Can I work from these offline?",
    answer:
      "Yes. Everything here is static documentation served from this site — no account, no runtime dependency. Open it once and it behaves the same with or without a connection.",
  },
];

export default function GuideFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="manual-faq" aria-labelledby="manual-faq-heading">
      <div className="manual-faq-heading">
        <div>
          <span className="eyebrow">04 / FAQ — GUIDE SYSTEM</span>
          <h2 id="manual-faq-heading">About these guides</h2>
        </div>
        <p>What each guide covers, how workflows are organized, and how teams use them in daily operations.</p>
      </div>

      <div className="manual-faq-list">
        {faqs.map((faq, index) => {
          const open = openIndex === index;
          return (
            <div key={faq.question} className={`manual-faq-item${open ? " is-open" : ""}`}>
              <button
                type="button"
                className="manual-faq-trigger"
                aria-expanded={open}
                aria-controls={`manual-faq-panel-${index}`}
                id={`manual-faq-trigger-${index}`}
                onClick={() => setOpenIndex(open ? null : index)}
              >
                <span className="faq-num">{String(index + 1).padStart(2, "0")}.</span>
                <span className="faq-q">{faq.question}</span>
                <ChevronDown size={18} aria-hidden="true" />
              </button>
              <div
                className="manual-faq-content"
                id={`manual-faq-panel-${index}`}
                role="region"
                aria-labelledby={`manual-faq-trigger-${index}`}
              >
                <div>
                  <p>{faq.answer}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
