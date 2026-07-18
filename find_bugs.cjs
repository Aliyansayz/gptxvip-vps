const fs = require('fs');
const path = require('path');
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx')) {
      const content = fs.readFileSync(file, 'utf8');
      if (content.includes('question.options') && !content.includes('question.question')) {
        results.push(file);
      }
    }
  });
  return results;
}
const issues = walk('/root/projects/gptxvip/src/devLushArea/devLushComponents/devLushTopics');
console.log('Files missing question rendering:', issues);
