# Code Concepts topic API

The app serves merged course content through read-only JSON endpoints. These work in the Vite development server and are emitted as static JSON files during production builds.

## Endpoints

| Method | Endpoint | Response |
| --- | --- | --- |
| `GET` | `/api/code-concepts/topics/index.json` | Topic catalog with title, description, lesson count, tags, and each topic's endpoint |
| `GET` | `/api/code-concepts/topics/{topicId}.json` | One merged topic payload, including `course`, `chapter_title`, `tags`, `critical_concepts`, and `interactive_questions` |

Topic IDs match the Code Concepts category IDs, such as `python`, `HFT`, and `algo_trading`. The app uses the same topic endpoint for the lesson catalog and search results. The original files under `/code_concepts/{topicId}/` remain available as source curriculum assets.

Example:

```js
const response = await fetch('/api/code-concepts/topics/algo_trading.json');
const algoTrading = await response.json();
```
