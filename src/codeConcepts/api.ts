import { CodeConceptsPayload } from "../types";

export interface CodeConceptsTopicPayload extends CodeConceptsPayload {
  id: string;
  tags?: string[];
}

export const getCodeConceptTopicEndpoint = (topicId: string) =>
  `/api/code-concepts/topics/${encodeURIComponent(topicId)}.json`;

export async function fetchCodeConceptTopic(topicId: string): Promise<CodeConceptsTopicPayload> {
  const response = await fetch(getCodeConceptTopicEndpoint(topicId));
  if (!response.ok) throw new Error(`Could not load ${topicId} topic (${response.status})`);

  const payload: unknown = await response.json();
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new Error(`The ${topicId} topic response is invalid`);
  }

  const topic = payload as Partial<CodeConceptsTopicPayload>;
  if (!Array.isArray(topic.interactive_questions) || !Array.isArray(topic.critical_concepts)) {
    throw new Error(`The ${topicId} topic response is incomplete`);
  }

  return {
    ...topic,
    id: topicId,
    course: typeof topic.course === "string" ? topic.course : topicId,
    chapter_title: typeof topic.chapter_title === "string" ? topic.chapter_title : "",
    tags: Array.isArray(topic.tags) ? topic.tags.filter((tag): tag is string => typeof tag === "string") : [],
    critical_concepts: topic.critical_concepts,
    interactive_questions: topic.interactive_questions,
  } as CodeConceptsTopicPayload;
}
