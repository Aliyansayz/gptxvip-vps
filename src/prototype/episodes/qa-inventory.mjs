/** Lightweight independent inventory. Run from repository root. */
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import { createHash } from 'node:crypto';

const root = process.cwd();
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const source = read('src/devLushArea/agentMarketplace/data/templates.ts');
const compiled = ts.transpile(source.replace(/^import .*$/mg, '').replace(/^export /mg, ''), { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.None });
const templates = new Function(`${compiled}; return templates;`)();
const registry = read('src/prototype/registry.ts');
const ast = ts.createSourceFile('registry.ts', registry, ts.ScriptTarget.Latest, true);
let mappings = {};
function walk(node) {
  if (ts.isVariableDeclaration(node) && node.name.getText(ast) === 'prototypes' && node.initializer && ts.isObjectLiteralExpression(node.initializer)) {
    for (const property of node.initializer.properties) {
      const id = property.name.getText(ast).replace(/^['"]|['"]$/g, '');
      const text = property.getText(ast);
      mappings[id] = { screenshot: text.match(/screenshot:\s*['"]([^'"]+)/)?.[1], component: text.match(/import\(['"]([^'"]+)/)?.[1] };
    }
  }
  ts.forEachChild(node, walk);
}
walk(ast);
const rows = templates.map(template => {
  const mapping = mappings[template.prototype];
  const module = mapping?.component && path.resolve(root, 'src/prototype', `${mapping.component}.tsx`);
  return {
    slug: template.slug, id: template.prototype || null,
    registered: !!mapping,
    moduleExists: !!module && fs.existsSync(module),
    screenshotExists: !!mapping?.screenshot && fs.existsSync(path.join(root, 'public', mapping.screenshot)),
    screenshotHash: mapping?.screenshot && fs.existsSync(path.join(root, 'public', mapping.screenshot)) ? createHash('sha256').update(fs.readFileSync(path.join(root, 'public', mapping.screenshot))).digest('hex') : null,
    frameworks: template.frameworks, pages: template.pages, components: template.components,
    features: template.features,
  };
});
const unusedIds = Object.keys(mappings).filter(id => !templates.some(template => template.prototype === id));
const duplicateIds = rows.filter((row, index) => row.id && rows.findIndex(other => other.id === row.id) !== index).map(row => row.id);
const duplicateScreenshots = rows.filter((row,index)=>row.screenshotHash && rows.findIndex(other=>other.screenshotHash===row.screenshotHash)!==index).map(row=>row.slug);
console.log(JSON.stringify({ catalogCount: rows.length, registryCount: Object.keys(mappings).length, unusedIds, duplicateIds, duplicateScreenshots, rows }, null, 2));
if (rows.some(row => !row.registered || !row.moduleExists || !row.screenshotExists || row.pages!==undefined || row.components!==undefined || row.frameworks.some(name=>!['React','Tailwind CSS'].includes(name))) || unusedIds.length || duplicateIds.length || duplicateScreenshots.length) process.exitCode = 1;
