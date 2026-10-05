---
phase: 01-report-shape
reviewed: 2026-10-05T08:25:00Z
depth: standard
files_reviewed: 8
files_reviewed_list:
  - apps/frontend/src/report.ts
  - apps/frontend/src/report.test.ts
  - apps/frontend/src/App.tsx
  - apps/frontend/src/styles.css
  - apps/frontend/package.json
  - apps/frontend/vitest.config.ts
  - package.json
  - turbo.json
findings:
  critical: 0
  warning: 2
  info: 0
  total: 2
status: issues_found
---

# Phase 01: Code Review Report

**Reviewed:** 2026-10-05T08:25:00Z
**Depth:** standard
**Files Reviewed:** 8
**Status:** issues_found

## Summary

Reviewed the phase 1 Markdown report: `buildTaskReport`, the header download button, shared button styles, and the Vitest/Turbo wiring. The builder matches the phase contract: `# Task Board`, sections in `TASK_STATUSES` order, ascending `position`, a trimmed description as a following paragraph, and `*No tasks*` for an empty column. `id`, `createdAt`, and `updatedAt` are not interpolated. Export is wired to the on-screen `tasks` state and disabled while loading or saving.

No critical defect in that path. Two tests do not lock the behavior their names claim, so a broken builder can stay green.

## Warnings

### WR-01: Empty-column test passes when every section is empty

**File:** `apps/frontend/src/report.test.ts:79-91`
**Issue:** `keeps an empty column when the board still has a task` only checks that In Progress and Done contain `*No tasks*`. It never checks that To Do still contains `Sketch the board layout`. A builder that ignores its input and writes `*No tasks*` under all three headings still passes this test. The other cases use different fixtures, so they do not cover this board.
**Fix:**

```typescript
it("keeps an empty column when the board still has a task", () => {
  const report = buildTaskReport([
    task({
      title: "Sketch the board layout",
      description: "",
      status: "todo",
      position: 0,
    }),
  ]);

  expect(report).toContain("## To Do\n\n- Sketch the board layout");
  expect(report).not.toContain("## To Do\n\n*No tasks*");
  expect(report).toContain("## In Progress\n\n*No tasks*");
  expect(report).toContain("## Done\n\n*No tasks*");
});
```

### WR-02: Metadata assertion does not detect leaked ids and rejects ordinary titles

**File:** `apps/frontend/src/report.test.ts:11-16`
**Issue:** `task()` sets `id`, `createdAt`, and `updatedAt` to `""`, and the test at lines 104-109 then asserts the report text does not contain the substrings `id`, `createdAt`, and `updatedAt`. Empty field values mean a builder that appends `task.id` or the timestamps still passes. The bare substring `id` also matches normal title or description text (`Hide`, `valid`, `grid`, `width`), so a correct report fails as soon as a fixture uses one of those words.
**Fix:**

```typescript
function task(fields: {
  title: string;
  description: string;
  status: TaskStatus;
  position: number;
}): Task {
  return {
    id: "task-id-sentinel",
    createdAt: "created-at-sentinel",
    updatedAt: "updated-at-sentinel",
    ...fields,
  };
}

it("leaves id and timestamps out of the file", () => {
  const report = buildTaskReport(demoTasks);

  expect(report).not.toContain("task-id-sentinel");
  expect(report).not.toContain("created-at-sentinel");
  expect(report).not.toContain("updated-at-sentinel");
});
```

---

_Reviewed: 2026-10-05T08:25:00Z_
_Reviewer: gsd-code-reviewer_
_Depth: standard_
