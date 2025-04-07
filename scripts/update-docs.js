const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const SRC_DIR = path.join(PROJECT_ROOT, 'src');
const DOC_FILE = path.join(PROJECT_ROOT, 'document.md');

function extractDocAnchors(fileContent) {
  const lines = fileContent.split('\n');
  const anchors = [];
  let currentAnchor = null;

  for (const line of lines) {
    const docMatch = line.match(/\/\/\s*@doc:([\w\d_]+)/);
    if (docMatch) {
      if (currentAnchor) anchors.push(currentAnchor);
      currentAnchor = { name: docMatch[1], content: [] };
    } else if (currentAnchor) {
      if (line.trim().startsWith('//')) {
        currentAnchor.content.push(line.replace('//', '').trim());
      } else if (line.trim() === '') {
        continue;
      } else {
        anchors.push(currentAnchor);
        currentAnchor = null;
      }
    }
  }
  if (currentAnchor) anchors.push(currentAnchor);
  return anchors;
}

function scanDirectory(dir) {
  let anchors = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      anchors = anchors.concat(scanDirectory(fullPath));
    } else if (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      anchors = anchors.concat(extractDocAnchors(content));
    }
  }
  return anchors;
}

function updateDocumentation(anchors) {
  let docContent = fs.readFileSync(DOC_FILE, 'utf-8');

  for (const anchor of anchors) {
    const regex = new RegExp(`(###\\s+.*${anchor.name}[\\s\\S]*?)(<details>|---)`, 'm');
    const anchorText = `### ${anchor.name}\n// @doc:${anchor.name}\n${anchor.content.map(c => c).join('\n')}\n`;
    docContent = docContent.replace(regex, `${anchorText}$2`);
  }

  fs.writeFileSync(DOC_FILE, docContent, 'utf-8');
}

function main() {
  console.log('Scanning source files for doc anchors...');
  const anchors = scanDirectory(SRC_DIR);
  console.log(`Found ${anchors.length} anchors.`);

  console.log('Updating documentation...');
  updateDocumentation(anchors);
  console.log('Documentation updated successfully.');
}

main();