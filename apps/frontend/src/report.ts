import { COLUMN_LABELS, TASK_STATUSES, type Task, type TaskStatus } from "@repo/shared";

function formatTask(task: Task): string {
  const line = `- ${task.title}`;
  const description = task.description.trim();
  if (description.length === 0) {
    return line;
  }

  return `${line}\n\n  ${description}`;
}

function formatSection(status: TaskStatus, tasks: Task[]): string {
  const heading = `## ${COLUMN_LABELS[status]}`;
  const sectionTasks = tasks
    .filter((task) => task.status === status)
    .sort((left, right) => left.position - right.position);
  const body =
    sectionTasks.length === 0 ? "*No tasks*" : sectionTasks.map(formatTask).join("\n\n");

  return `${heading}\n\n${body}`;
}

export function buildTaskReport(tasks: Task[]): string {
  const sections = TASK_STATUSES.map((status) => formatSection(status, tasks));
  return `# Task Board\n\n${sections.join("\n\n")}\n`;
}
