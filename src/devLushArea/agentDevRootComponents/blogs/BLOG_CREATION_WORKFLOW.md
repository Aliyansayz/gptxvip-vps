# devLush Blog Creation Workflow

This document outlines the standard operating procedure for creating authentic, highly-engaging "devLush" style blogs. 
The goal is to demystify complex technical concepts (like AI agents, system design, or legal tech) by anchoring them in layman-friendly, real-world case studies while providing a premium reading experience through interactive components.

## The Cycle of Creation

Creating a blog is a seamless two-step cycle:
1. **The Data Layer:** Structuring the narrative as a rich JSON payload.
2. **The Visual Layer:** Building the bespoke interactive React components (TSX) referenced in the JSON.

---

### Step 1: The Data Layer (JSON)
*Location: `blogs/data/`*

Every blog starts as a JSON file. This isn't just plain text; it's a component-driven schema meant to power a dynamic rendering engine.

# BLOG PROMPT TO USE 

```
You are an expert Technical Writer and Developer Advocate. Your goal is to write a comprehensive, accurate, and highly readable technical blog post about [INSERT TECHNICAL TOPIC/PROBLEM].

Your tone should be authoritative, objective, and accessible. You write in the active voice, keep sentences concise (aiming for 15-20 words on average), and prioritize clarity over complex vocabulary.

Target Audience: [e.g., Junior Frontend Developers / Senior Cloud Architects / Data Scientists]
Prerequisite Knowledge: [e.g., Basic understanding of React hooks / Familiarity with Docker / None]
Primary Goal: [e.g., Teach how to implement X / Compare tool X with tool Y / Solve error Z]

Write the technical blog post following this strict 6-phase structure:

Phase 1: The Problem Statement & Hook

Start directly with the technical problem, pain point, or inefficiency that this post solves. Do not use generic, fluffy introductions (e.g., avoid "In today's fast-paced digital world...").

Clearly state what the reader will achieve or build by the end of this article.

List the exact prerequisites (tools, versions, or prior knowledge) required to follow along.

Phase 2: The Mental Model (High-Level Architecture)

Explain how the technology or solution works conceptually before diving into the code.

Use a clear, technical analogy or describe the data flow/architecture.

Define any highly specific jargon or acronyms that will be used heavily in the post.

Phase 3: Step-by-Step Implementation (The Mechanics)

Break down the solution into logical, sequential steps using H3 (###) subheadings.

Code Snippet Rules:

Provide clean, well-formatted code blocks with the correct Markdown syntax highlighting (e.g., python, javascript).

Do not just dump large blocks of code. Break code into digestible chunks.

Crucial: Follow every code block with a plain-English explanation of what the code is doing and why it was written that way.

Highlight common pitfalls, "gotchas," or expected errors readers might face in callout blocks (e.g., using blockquotes > **Warning:**).

Phase 4: Trade-offs and Considerations

No technical solution is perfect. Honestly evaluate the drawbacks of this approach.

Discuss performance impacts, security considerations, or scalability limits.

Briefly compare this approach to at least one alternative method or tool.

Phase 5: Testing & Validation

Explain how the reader can verify that their implementation actually worked (e.g., running a specific test command, checking a console log, or viewing a network request).

Provide the expected output of the successful implementation.

Phase 6: Conclusion & Next Steps

Provide a 2-3 sentence technical summary of what was accomplished.

List 2-3 actionable "Next Steps" (e.g., optimizing the code, deploying to production, or exploring a related advanced topic).

Provide placeholders for further reading and a link to a GitHub repository if applicable.

Formatting & Style Constraints:

Use Markdown extensively: bolding for UI elements/files, inline code blocks (like this) for variables/commands, and bullet points for readability.

Write strictly in the active voice (e.g., "The server handles the request" instead of "The request is handled by the server").

Use the second-person imperative mood for instructions (e.g., "Run the following command," "Configure the database").

Avoid fluff, repetitive transitions, and robotic conclusions.


```



**Key Ingredients for Authenticity:**
*   **The Layman Hook:** Start the summary and introduction by stating the problem in human terms. (e.g., Instead of "Optimizing high-dimensional vector similarity", use "Finding a needle in a haystack of a million legal contracts in under a second.")
*   **Real-World Case Study:** Base the narrative around a practical application. Invent a realistic scenario if necessary (e.g., "TechCorp analyzing a 100-page vendor agreement to find a missing liability cap").
*   **Rich Formatting:** Use the schema's `domain_technical` or `domain_legal` styling to highlight jargon. Provide inline definitions so the reader never feels lost.
*   **Contextual Callouts:** Use `callout` blocks for history (how it used to be done) or news (why it matters today).
*   **Precautionary Tales:** Use `alert` blocks to show deep expertise. What happens when the AI hallucinated a court case? Highlighting worst-case scenarios proves authenticity.

*Reference: See `blogs/data/legal-agent.json` for a standard structure.*

---

### Step 2: The Visual Layer (TSX)
*Location: `blogs/components/visuals/[blog-id]/`*

A devLush blog is an experience. For every `visual_element` defined in the JSON, we create a corresponding React component using Tailwind CSS, `framer-motion`, and `lucide-react` icons.

**Design Philosophy:**
*   **Dark & Premium:** Default to dark themes (`bg-slate-950`) with vibrant, glowing accents (indigo, emerald, teal).
*   **Interactive Context:** Don't just show an image. If it's a document viewer, make the clauses highlight on hover. If it's an architecture diagram, animate the data flowing through it.
*   **Glassmorphism & Shadows:** Use deep shadows (`shadow-2xl`, `shadow-indigo-500/20`) and subtle borders to create depth.
*   **Micro-interactions:** Use `framer-motion` for spring animations, presence transitions, and pulsing indicators.

**Workflow:**
1. Read the `prompt` in the JSON's `visual_element`.
2. Create a new directory in `visuals/` named exactly after the blog's `id` (e.g., `visuals/legal-agent/`).
3. Create the `.tsx` components defined by the `name` property in the JSON schema.
4. Export them and ensure they are ready to be dynamically imported by the blog renderer.

---

By adhering to this cycle, we ensure that every piece of content published under the devLush banner bridges the gap between high-level engineering and accessible, engaging storytelling.
