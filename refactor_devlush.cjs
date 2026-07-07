const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const srcDir = path.join(__dirname, 'src');
const devLushAreaDir = path.join(srcDir, 'devLushArea');

// Create the target directory
if (!fs.existsSync(devLushAreaDir)) {
  fs.mkdirSync(devLushAreaDir, { recursive: true });
}

// Items to move
const itemsToMove = [
  'agentDevRootComponents'
];

// Perform moves
for (const item of itemsToMove) {
  const srcPath = path.join(srcDir, item);
  const destPath = path.join(devLushAreaDir, path.basename(item));
  if (fs.existsSync(srcPath)) {
    console.log(`Moving ${srcPath} to ${destPath}`);
    execSync(`mv "${srcPath}" "${destPath}"`);
  } else {
    console.warn(`Could not find ${srcPath} to move.`);
  }
}

// Helper to recursively find files
function findFiles(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      findFiles(fullPath, files);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx') || fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
      files.push(fullPath);
    }
  }
  return files;
}

const allFiles = findFiles(srcDir);

const mappings = [
  { old: 'agentDevRootComponents', new: 'devLushArea/agentDevRootComponents' }
];

for (const filePath of allFiles) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Find all import statements
  const importRegex = /(import\s+.*?\s+from\s+['"])(.*?)(['"])/g;
  const dynamicImportRegex = /(import\(['"])(.*?)(['"]\))/g;
  const requireRegex = /(require\(['"])(.*?)(['"]\))/g;

  function replacer(match, p1, p2, p3) {
    let importPath = p2;
    if (!importPath.startsWith('.')) return match; // Not relative

    let oldFileDir = path.dirname(filePath);
    if (oldFileDir.includes('/devLushArea')) {
        // Find if this specific directory was moved
        // It could be nested inside something that was moved
        let relToSrc = path.relative(srcDir, oldFileDir).split(path.sep).join('/');
        if (relToSrc.startsWith('devLushArea/')) {
            let possibleOldRelToSrc = relToSrc.replace('devLushArea/', '');
            // check if possibleOldRelToSrc matches our moved folders or is inside them
            const isMovedDir = itemsToMove.some(m => possibleOldRelToSrc === m || possibleOldRelToSrc.startsWith(m + '/'));
            if (isMovedDir) {
                oldFileDir = path.join(srcDir, possibleOldRelToSrc);
            }
        }
    }

    const oldTargetAbsPath = path.resolve(oldFileDir, importPath);

    let newTargetAbsPath = oldTargetAbsPath;
    let matched = false;

    for (const map of mappings) {
        const oldRootAbs = path.join(srcDir, map.old);
        const newRootAbs = path.join(srcDir, map.new);
        
        // Remove .tsx/.ts etc for matching
        const targetWithoutExt = oldTargetAbsPath.replace(/\.(tsx|ts|js|jsx)$/, '');
        const rootWithoutExt = oldRootAbs.replace(/\.(tsx|ts|js|jsx)$/, '');

        if (targetWithoutExt === rootWithoutExt || oldTargetAbsPath.startsWith(oldRootAbs + '/')) {
            newTargetAbsPath = oldTargetAbsPath.replace(oldRootAbs, newRootAbs);
            // Handle edge case if it was an exact match without extension
            if (targetWithoutExt === rootWithoutExt && oldTargetAbsPath !== oldRootAbs) {
                newTargetAbsPath = oldTargetAbsPath.replace(targetWithoutExt, newRootAbs.replace(/\.(tsx|ts|js|jsx)$/, ''));
            }
            matched = true;
            break;
        }
    }

    if (matched) {
        let newRelPath = path.relative(path.dirname(filePath), newTargetAbsPath);
        if (!newRelPath.startsWith('.')) {
            newRelPath = './' + newRelPath;
        }
        newRelPath = newRelPath.split(path.sep).join('/');
        return p1 + newRelPath + p3;
    }

    // if not matched but current file moved
    if (!matched && filePath.includes('/devLushArea/')) {
        let newRelPath = path.relative(path.dirname(filePath), oldTargetAbsPath);
        if (!newRelPath.startsWith('.')) {
            newRelPath = './' + newRelPath;
        }
        newRelPath = newRelPath.split(path.sep).join('/');
        return p1 + newRelPath + p3;
    }

    return match;
  }

  content = content.replace(importRegex, replacer);
  content = content.replace(dynamicImportRegex, replacer);
  content = content.replace(requireRegex, replacer);

  if (content !== originalContent) {
    console.log(`Updated imports in ${filePath}`);
    fs.writeFileSync(filePath, content, 'utf8');
  }
}

console.log('Refactoring complete.');
