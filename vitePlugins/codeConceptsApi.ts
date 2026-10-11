import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import type { Plugin } from "vite";

type TopicPayload = {
  course: string;
  chapter_title: string;
  tags: string[];
  critical_concepts: unknown[];
  interactive_questions: unknown[];
};

type TopicEndpoint = TopicPayload & { id: string };

const API_PREFIX = "/api/code-concepts/topics";

function readTopics(publicDir: string) {
  const conceptsDir = join(publicDir, "code_concepts");
  if (!existsSync(conceptsDir)) return [] as TopicEndpoint[];

  return readdirSync(conceptsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && /^[A-Za-z0-9_-]+$/.test(entry.name))
    .sort((a, b) => a.name.localeCompare(b.name))
    .flatMap(({ name: id }) => {
      const topicDir = join(conceptsDir, id);
      const files = readdirSync(topicDir)
        .filter((fileName) => fileName.endsWith(".json"))
        .sort((a, b) => a === "index.json" ? -1 : b === "index.json" ? 1 : a.localeCompare(b));
      const payload: TopicPayload = {
        course: "",
        chapter_title: "",
        tags: [],
        critical_concepts: [],
        interactive_questions: [],
      };

      for (const fileName of files) {
        try {
          const fileData = JSON.parse(readFileSync(join(topicDir, fileName), "utf8")) as Partial<TopicPayload>;
          payload.course ||= typeof fileData.course === "string" ? fileData.course : "";
          payload.chapter_title ||= typeof fileData.chapter_title === "string" ? fileData.chapter_title : "";
          if (Array.isArray(fileData.tags)) payload.tags.push(...fileData.tags.filter((tag): tag is string => typeof tag === "string"));
          if (Array.isArray(fileData.critical_concepts)) payload.critical_concepts.push(...fileData.critical_concepts);
          if (Array.isArray(fileData.interactive_questions)) payload.interactive_questions.push(...fileData.interactive_questions);
        } catch {
          // Ignore malformed files so a single damaged topic cannot hide other topics.
        }
      }

      if (!payload.course && !payload.chapter_title && !payload.critical_concepts.length && !payload.interactive_questions.length) return [];
      return [{ ...payload, tags: [...new Set(payload.tags)], id }];
    });
}

function makeCatalog(topics: TopicEndpoint[]) {
  return {
    topics: topics.map((topic) => ({
      id: topic.id,
      title: topic.course || topic.id,
      description: topic.chapter_title,
      endpoint: `${API_PREFIX}/${encodeURIComponent(topic.id)}.json`,
      lessonCount: topic.interactive_questions.length,
      conceptCount: topic.critical_concepts.length,
      tags: topic.tags,
    })),
  };
}

function sendJson(response: import("node:http").ServerResponse, status: number, data: unknown, headOnly = false) {
  response.statusCode = status;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("Cache-Control", "public, max-age=300");
  response.end(headOnly ? undefined : JSON.stringify(data));
}

export function codeConceptsApi(): Plugin {
  let publicDir = join(process.cwd(), "public");
  let isBuild = false;

  return {
    name: "code-concepts-topic-api",
    configResolved(config) {
      publicDir = config.publicDir;
      isBuild = config.command === "build";
    },
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        if (request.method !== "GET" && request.method !== "HEAD") return next();
        const pathname = new URL(request.url || "/", "http://localhost").pathname;
        if (pathname !== `${API_PREFIX}/index.json` && !pathname.startsWith(`${API_PREFIX}/`)) return next();

        const topics = readTopics(publicDir);
        if (pathname === `${API_PREFIX}/index.json`) {
          return sendJson(response, 200, makeCatalog(topics), request.method === "HEAD");
        }

        const match = pathname.match(new RegExp(`^${API_PREFIX}/([A-Za-z0-9_-]+)\\.json$`));
        const topicId = match?.[1];
        const topic = topicId ? topics.find((item) => item.id === topicId) : undefined;
        return topic
          ? sendJson(response, 200, topic, request.method === "HEAD")
          : sendJson(response, 404, { error: "Code Concepts topic not found." }, request.method === "HEAD");
      });
    },
    buildStart() {
      if (!isBuild) return;
      const topics = readTopics(publicDir);
      this.emitFile({
        type: "asset",
        fileName: "api/code-concepts/topics/index.json",
        source: JSON.stringify(makeCatalog(topics), null, 2),
      });
      for (const topic of topics) {
        this.emitFile({
          type: "asset",
          fileName: `api/code-concepts/topics/${topic.id}.json`,
          source: JSON.stringify(topic, null, 2),
        });
      }
    },
  };
}
