import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";
import { DatabaseSync } from "node:sqlite";
import type { CreateTaskInput, Task, TaskStatus, UpdateTaskInput } from "@repo/shared";
import { TASK_STATUSES } from "@repo/shared";

type TaskRow = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  position: number;
  created_at: string;
  updated_at: string;
};

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, "..", "data", "tasks.db");

mkdirSync(dirname(dbPath), { recursive: true });

const db = new DatabaseSync(dbPath);
db.exec("PRAGMA journal_mode = WAL;");
db.exec("PRAGMA foreign_keys = ON;");

db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL CHECK (status IN ('todo', 'in_progress', 'done')),
    position INTEGER NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
`);

function mapRow(row: TaskRow): Task {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    status: row.status,
    position: row.position,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function assertStatus(status: string): asserts status is TaskStatus {
  if (!TASK_STATUSES.includes(status as TaskStatus)) {
    throw new Error(`Invalid status: ${status}`);
  }
}

export function listTasks(): Task[] {
  const rows = db
    .prepare(
      `SELECT id, title, description, status, position, created_at, updated_at
       FROM tasks
       ORDER BY
         CASE status
           WHEN 'todo' THEN 0
           WHEN 'in_progress' THEN 1
           WHEN 'done' THEN 2
         END,
         position ASC,
         created_at ASC`,
    )
    .all() as TaskRow[];

  return rows.map(mapRow);
}

export function getTask(id: string): Task | undefined {
  const row = db
    .prepare(
      `SELECT id, title, description, status, position, created_at, updated_at
       FROM tasks WHERE id = ?`,
    )
    .get(id) as TaskRow | undefined;

  return row ? mapRow(row) : undefined;
}

function nextPosition(status: TaskStatus): number {
  const result = db
    .prepare(`SELECT COALESCE(MAX(position), -1) + 1 AS next_position FROM tasks WHERE status = ?`)
    .get(status) as { next_position: number };

  return result.next_position;
}

export function createTask(input: CreateTaskInput): Task {
  const title = input.title.trim();
  if (!title) {
    throw new Error("Title is required");
  }

  const status = input.status ?? "todo";
  assertStatus(status);

  const now = new Date().toISOString();
  const task: Task = {
    id: randomUUID(),
    title,
    description: (input.description ?? "").trim(),
    status,
    position: nextPosition(status),
    createdAt: now,
    updatedAt: now,
  };

  db.prepare(
    `INSERT INTO tasks (id, title, description, status, position, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    task.id,
    task.title,
    task.description,
    task.status,
    task.position,
    task.createdAt,
    task.updatedAt,
  );

  return task;
}

export function updateTask(id: string, input: UpdateTaskInput): Task | undefined {
  const existing = getTask(id);
  if (!existing) {
    return undefined;
  }

  const next: Task = {
    ...existing,
    title: input.title !== undefined ? input.title.trim() : existing.title,
    description:
      input.description !== undefined ? input.description.trim() : existing.description,
    status: input.status ?? existing.status,
    position: input.position ?? existing.position,
    updatedAt: new Date().toISOString(),
  };

  if (!next.title) {
    throw new Error("Title is required");
  }

  assertStatus(next.status);

  db.prepare(
    `UPDATE tasks
     SET title = ?,
         description = ?,
         status = ?,
         position = ?,
         updated_at = ?
     WHERE id = ?`,
  ).run(next.title, next.description, next.status, next.position, next.updatedAt, next.id);

  return next;
}

export function deleteTask(id: string): boolean {
  const result = db.prepare(`DELETE FROM tasks WHERE id = ?`).run(id);
  return Number(result.changes) > 0;
}

export function reorderTasks(
  items: Array<{ id: string; status: TaskStatus; position: number }>,
): Task[] {
  const update = db.prepare(
    `UPDATE tasks
     SET status = ?, position = ?, updated_at = ?
     WHERE id = ?`,
  );

  db.exec("BEGIN");
  try {
    const now = new Date().toISOString();

    for (const item of items) {
      assertStatus(item.status);
      const existing = getTask(item.id);
      if (!existing) {
        throw new Error(`Task not found: ${item.id}`);
      }

      update.run(item.status, item.position, now, item.id);
    }

    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }

  return listTasks();
}

const DEMO_TASKS: CreateTaskInput[] = [
  { title: "Sketch the board layout", status: "todo" },
  { title: "Wire Fastify routes", status: "in_progress" },
  { title: "Demo drag and drop", status: "done" },
];

function seedDemoTasks(): Task[] {
  for (const task of DEMO_TASKS) {
    createTask(task);
  }
  return listTasks();
}

export function seedIfEmpty(): void {
  const count = db.prepare(`SELECT COUNT(*) AS count FROM tasks`).get() as { count: number };
  if (count.count > 0) {
    return;
  }

  seedDemoTasks();
}

export function resetToDemo(): Task[] {
  db.exec("DELETE FROM tasks;");
  return seedDemoTasks();
}
