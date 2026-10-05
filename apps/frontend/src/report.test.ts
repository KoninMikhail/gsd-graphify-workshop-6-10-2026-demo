import type { Task, TaskStatus } from "@repo/shared";
import { describe, expect, it } from "vitest";
import { buildTaskReport } from "./report";

function task(fields: {
  title: string;
  description: string;
  status: TaskStatus;
  position: number;
}): Task {
  return {
    id: "",
    createdAt: "",
    updatedAt: "",
    ...fields,
  };
}

const demoTasks: Task[] = [
  task({
    title: "Sketch the board layout",
    description: "",
    status: "todo",
    position: 0,
  }),
  task({
    title: "Wire Fastify routes",
    description: "",
    status: "in_progress",
    position: 0,
  }),
  task({
    title: "Demo drag and drop",
    description: "",
    status: "done",
    position: 0,
  }),
];

const demoReport = `# Task Board

## To Do

- Sketch the board layout

## In Progress

- Wire Fastify routes

## Done

- Demo drag and drop
`;

describe("buildTaskReport", () => {
  it("writes the three demo tasks in column order", () => {
    const report = buildTaskReport(demoTasks);

    expect(report).toBe(demoReport);
    expect(report).toContain("# Task Board");
    expect(report).toContain("## To Do");
    expect(report).toContain("## In Progress");
    expect(report).toContain("## Done");
  });

  it("places a non-empty description under the list item", () => {
    const report = buildTaskReport([
      task({
        title: "Wire Fastify routes",
        description: "Routes live in index.ts.",
        status: "in_progress",
        position: 0,
      }),
    ]);

    expect(report).toContain("- Wire Fastify routes\n\n  Routes live in index.ts.");
  });

  it("keeps an empty column when the board still has a task", () => {
    const report = buildTaskReport([
      task({
        title: "Sketch the board layout",
        description: "",
        status: "todo",
        position: 0,
      }),
    ]);

    expect(report).toContain("## In Progress\n\n*No tasks*");
    expect(report).toContain("## Done\n\n*No tasks*");
  });

  it("orders tasks inside a section by position", () => {
    const report = buildTaskReport([
      task({ title: "Later card", description: "", status: "todo", position: 2 }),
      task({ title: "Earlier card", description: "", status: "todo", position: 0 }),
    ]);
    const section = report.split("## In Progress")[0] ?? "";

    expect(section.indexOf("- Earlier card")).toBeGreaterThan(-1);
    expect(section.indexOf("- Earlier card")).toBeLessThan(section.indexOf("- Later card"));
  });

  it("leaves id and timestamps out of the file", () => {
    const report = buildTaskReport(demoTasks);

    expect(report).not.toContain("id");
    expect(report).not.toContain("createdAt");
    expect(report).not.toContain("updatedAt");
  });
});
