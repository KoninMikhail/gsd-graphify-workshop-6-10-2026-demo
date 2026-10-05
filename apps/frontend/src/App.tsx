import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  COLUMN_LABELS,
  TASK_STATUSES,
  type Task,
  type TaskStatus,
} from "@repo/shared";
import * as api from "./api";
import { Column } from "./components/Column";
import { TaskCard } from "./components/TaskCard";
import { downloadTaskReport } from "./report";

function groupByStatus(tasks: Task[]): Record<TaskStatus, Task[]> {
  const grouped: Record<TaskStatus, Task[]> = {
    todo: [],
    in_progress: [],
    done: [],
  };

  for (const status of TASK_STATUSES) {
    grouped[status] = tasks
      .filter((task) => task.status === status)
      .sort((a, b) => a.position - b.position);
  }

  return grouped;
}

function flattenBoard(board: Record<TaskStatus, Task[]>): Task[] {
  return TASK_STATUSES.flatMap((status) =>
    board[status].map((task, index) => ({
      ...task,
      status,
      position: index,
    })),
  );
}

function findContainer(
  board: Record<TaskStatus, Task[]>,
  id: string,
): TaskStatus | undefined {
  if (TASK_STATUSES.includes(id as TaskStatus)) {
    return id as TaskStatus;
  }

  return TASK_STATUSES.find((status) => board[status].some((task) => task.id === id));
}

export function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const board = useMemo(() => groupByStatus(tasks), [tasks]);
  const activeTask = useMemo(
    () => tasks.find((task) => task.id === activeId) ?? null,
    [tasks, activeId],
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
  );

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await api.fetchTasks();
        if (!cancelled) {
          setTasks(data);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load tasks");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  async function persistBoard(nextBoard: Record<TaskStatus, Task[]>) {
    const flattened = flattenBoard(nextBoard);
    setTasks(flattened);
    setSaving(true);
    setError(null);

    try {
      const saved = await api.reorderTasks({
        items: flattened.map((task) => ({
          id: task.id,
          status: task.status,
          position: task.position,
        })),
      });
      setTasks(saved);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save board");
      const fresh = await api.fetchTasks();
      setTasks(fresh);
    } finally {
      setSaving(false);
    }
  }

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextTitle = title.trim();
    if (!nextTitle) {
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const created = await api.createTask({ title: nextTitle });
      setTasks((current) => [...current, created]);
      setTitle("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create task");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    const previous = tasks;
    setTasks((current) => current.filter((task) => task.id !== id));
    setSaving(true);
    setError(null);

    try {
      await api.deleteTask(id);
    } catch (err) {
      setTasks(previous);
      setError(err instanceof Error ? err.message : "Failed to delete task");
    } finally {
      setSaving(false);
    }
  }

  async function handleResetDemo() {
    setSaving(true);
    setError(null);

    try {
      const demoTasks = await api.resetToDemo();
      setTasks(demoTasks);
      setTitle("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset demo data");
    } finally {
      setSaving(false);
    }
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) {
      return;
    }

    const activeContainer = findContainer(board, String(active.id));
    const overContainer = findContainer(board, String(over.id));

    if (!activeContainer || !overContainer || activeContainer === overContainer) {
      return;
    }

    setTasks((current) => {
      const next = groupByStatus(current);
      const activeIndex = next[activeContainer].findIndex((task) => task.id === active.id);
      if (activeIndex < 0) {
        return current;
      }

      const [moved] = next[activeContainer].splice(activeIndex, 1);
      const overIndex = next[overContainer].findIndex((task) => task.id === over.id);
      const insertIndex = overIndex >= 0 ? overIndex : next[overContainer].length;

      next[overContainer].splice(insertIndex, 0, {
        ...moved,
        status: overContainer,
      });

      return flattenBoard(next);
    });
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);

    if (!over) {
      return;
    }

    const activeContainer = findContainer(board, String(active.id));
    const overContainer = findContainer(board, String(over.id));

    if (!activeContainer || !overContainer) {
      return;
    }

    const next = groupByStatus(tasks);
    const activeIndex = next[activeContainer].findIndex((task) => task.id === active.id);
    const overIndex = next[overContainer].findIndex((task) => task.id === over.id);

    if (activeIndex < 0) {
      return;
    }

    if (activeContainer === overContainer) {
      next[activeContainer] = arrayMove(
        next[activeContainer],
        activeIndex,
        overIndex >= 0 ? overIndex : activeIndex,
      );
    }

    await persistBoard(next);
  }

  return (
    <div className="page">
      <header className="header">
        <div>
          <p className="eyebrow">Workshop board</p>
          <h1>Task Board</h1>
          <p className="lede">Drag cards between columns. Changes sync to Fastify + SQLite.</p>
        </div>
        <div className="toolbar">
          <form className="composer" onSubmit={handleCreate}>
            <input
              aria-label="New task title"
              placeholder="Add a task…"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              disabled={loading || saving}
            />
            <button type="submit" disabled={loading || saving || !title.trim()}>
              Add
            </button>
          </form>
          <button
            type="button"
            className="reset"
            onClick={() => {
              void handleResetDemo();
            }}
            disabled={loading || saving}
          >
            Reset demo
          </button>
          <button
            type="button"
            className="export"
            onClick={() => {
              downloadTaskReport(tasks);
            }}
            disabled={loading || saving}
          >
            Export markdown
          </button>
        </div>
      </header>

      {error ? <p className="banner error">{error}</p> : null}
      {saving ? <p className="banner muted">Saving…</p> : null}

      {loading ? (
        <p className="banner muted">Loading board…</p>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={(event) => {
            void handleDragEnd(event);
          }}
        >
          <div className="board">
            {TASK_STATUSES.map((status) => (
              <Column
                key={status}
                status={status}
                title={COLUMN_LABELS[status]}
                tasks={board[status]}
                onDelete={handleDelete}
              />
            ))}
          </div>
          <DragOverlay>
            {activeTask ? <TaskCard task={activeTask} overlay /> : null}
          </DragOverlay>
        </DndContext>
      )}
    </div>
  );
}
