import fs from 'fs';
import path from 'path';
import { TaskManager } from '../src/modules/exampleModule';
import { TaskStatus, TaskPriority, ITask } from '../src/interfaces/ITask';

/**
 * Recursively find all .md files in a directory, excluding the output files
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
      !file.toLowerCase().includes('plain_agents.md') &&
      !file.toLowerCase().includes('plain_selfheal.md')
    ) {
      fileList.push(fullPath);
    }
  });
  return fileList;
}

function formatTask(task: ITask): string {
  return `- **ID:** ${task.id} | **Priority:** ${TaskPriority[task.priority]} | **Status:** ${task.status} | **Created:** ${task.createdAt.toISOString()} | **Updated:** ${task.updatedAt.toISOString()} | **Data:** ${JSON.stringify(task.data)}`;
}

function aggregateDualMarkdown(): void {
  const projectRoot = path.resolve(__dirname, '..');
  const agentFile = path.join(projectRoot, 'plain_agents.md');
  const selfhealFile = path.join(projectRoot, 'plain_selfheal.md');

  const mdFiles = findMarkdownFiles(projectRoot);

  let agentContent = '# Agent Knowledge Base\n\n';
  let selfhealContent = '# Self-Healing Knowledge Base\n\n';

  mdFiles.forEach(filePath => {
    const relativePath = path.relative(projectRoot, filePath);
    const content = fs.readFileSync(filePath, 'utf-8');

    // Include all docs in agent knowledge base
    agentContent += `\n---\n## File: ${relativePath}\n---\n\n${content}\n`;

    // Include debug logs and error reports in self-healing base
    if (relativePath.toLowerCase().includes('debug.md') || relativePath.toLowerCase().includes('error') || relativePath.toLowerCase().includes('log')) {
      selfhealContent += `\n---\n## File: ${relativePath}\n---\n\n${content}\n`;
    }
  });

  const taskManager = new TaskManager();

  // Completed tasks
  const completedTasks = taskManager.getTasksByStatus(TaskStatus.COMPLETED);
  agentContent += `\n---\n## Completed Tasks\n---\n\n`;
  selfhealContent += `\n---\n## Completed Tasks\n---\n\n`;
  if (completedTasks.length === 0) {
    agentContent += '_No completed tasks found._\n';
    selfhealContent += '_No completed tasks found._\n';
  } else {
    completedTasks.forEach(task => {
      const formatted = formatTask(task);
      agentContent += formatted + '\n';
      selfhealContent += formatted + '\n';
    });
  }

  // Upcoming tasks (for agents only)
  const upcomingTasks = taskManager.getTasksByStatus(TaskStatus.PENDING);
  agentContent += `\n---\n## Upcoming Tasks\n---\n\n`;
  if (upcomingTasks.length === 0) {
    agentContent += '_No upcoming tasks found._\n';
  } else {
    upcomingTasks.forEach(task => {
      agentContent += formatTask(task) + '\n';
    });
  }

  fs.writeFileSync(agentFile, agentContent, 'utf-8');
  fs.writeFileSync(selfhealFile, selfhealContent, 'utf-8');

  console.log('Generated plain_agents.md and plain_selfheal.md');
}

aggregateDualMarkdown();