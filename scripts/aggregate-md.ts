import fs from 'fs';
import path from 'path';
import { TaskManager } from '../src/modules/exampleModule';
import { TaskStatus, TaskPriority, ITask } from '../src/interfaces/ITask';

/**
 * Recursively find all .md files in a directory, excluding plain.md
 * @param dir Directory to search
 * @param fileList Accumulator for found files
 * @returns List of markdown file paths
 */
function findMarkdownFiles(dir: string, fileList: string[] = []): string[] {
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
 * Format a task as markdown bullet point
 */
function formatTask(task: ITask): string {
  return `- **ID:** ${task.id} | **Priority:** ${TaskPriority[task.priority]} | **Status:** ${task.status} | **Created:** ${task.createdAt.toISOString()} | **Updated:** ${task.updatedAt.toISOString()} | **Data:** ${JSON.stringify(task.data)}`;
}

/**
 * Aggregate all markdown files and task info into plain.md
 */
function aggregateMarkdown(): void {
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

  // Initialize or import your TaskManager instance
  const taskManager = new TaskManager();

  // Fetch completed tasks
  const completedTasks = taskManager.getTasksByStatus(TaskStatus.COMPLETED);
  aggregatedContent += `\n---\n## Completed Tasks\n---\n\n`;
  if (completedTasks.length === 0) {
    aggregatedContent += '_No completed tasks found._\n';
  } else {
    completedTasks.forEach(task => {
      aggregatedContent += formatTask(task) + '\n';
    });
  }

  // Fetch upcoming (pending) tasks
  const upcomingTasks = taskManager.getTasksByStatus(TaskStatus.PENDING);
  aggregatedContent += `\n---\n## Upcoming Tasks\n---\n\n`;
  if (upcomingTasks.length === 0) {
    aggregatedContent += '_No upcoming tasks found._\n';
  } else {
    upcomingTasks.forEach(task => {
      aggregatedContent += formatTask(task) + '\n';
    });
  }

  fs.writeFileSync(outputFile, aggregatedContent, 'utf-8');
  console.log(`Aggregated ${mdFiles.length} markdown files and ${completedTasks.length} completed tasks, ${upcomingTasks.length} upcoming tasks into plain.md`);
}

aggregateMarkdown();