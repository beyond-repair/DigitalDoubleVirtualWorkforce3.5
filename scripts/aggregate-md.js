const fs = require('fs');
const path = require('path');

/**
 * Recursively find all .md files in a directory, excluding plain.md
 * @param {string} dir - Directory to search
 * @param {string[]} fileList - Accumulator for found files
 * @returns {string[]} List of markdown file paths
 */
function findMarkdownFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      findMarkdownFiles(fullPath, fileList);
    } else if (
      file.endsWith('.md') &&
      !file.toLowerCase().includes('plain.md')
    ) {
      fileList.push(fullPath);
    }
  });
  return fileList;
}

/**
 * Aggregate all markdown files into plain.md
 */
function aggregateMarkdown() {
  const projectRoot = path.resolve(__dirname, '..');
  const outputFile = path.join(projectRoot, 'plain.md');

  const mdFiles = findMarkdownFiles(projectRoot);

  let aggregatedContent = '# Project Documentation Aggregate\n\n';

  mdFiles.forEach(filePath => {
    const relativePath = path.relative(projectRoot, filePath);
    aggregatedContent += `\n---\n## File: ${relativePath}\n---\n\n`;
    const content = fs.readFileSync(filePath, 'utf-8');
    aggregatedContent += content + '\n';
  });

  fs.writeFileSync(outputFile, aggregatedContent, 'utf-8');
  console.log(`Aggregated ${mdFiles.length} markdown files into plain.md`);
}

aggregateMarkdown();