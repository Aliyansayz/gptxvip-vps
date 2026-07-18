const fs = require('fs');
const path = require('path');
const dir = '/root/projects/gptxvip/src/devLushArea/devLushComponents/data';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));

let missing = [];

for (const file of files) {
  const content = JSON.parse(fs.readFileSync(path.join(dir, file)));
  content.forEach(chapter => {
    if (chapter.interactive_questions) {
      chapter.interactive_questions.forEach((q, idx) => {
        if (q.question === undefined || q.question === null || q.question === "") {
          missing.push({ file, chapter: chapter.id || chapter.course, q_title: q.title || idx, q: q });
        }
      });
    }
  });
}

console.log(JSON.stringify(missing, null, 2));
