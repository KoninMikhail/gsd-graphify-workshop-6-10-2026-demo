import type { HTMLAttributes } from "react";
import type { Task } from "@repo/shared";

type TaskCardProps = {
  task: Task;
  onDelete?: (id: string) => void;
  overlay?: boolean;
  dragHandleProps?: HTMLAttributes<HTMLButtonElement>;
};

export function TaskCard({ task, onDelete, overlay = false, dragHandleProps }: TaskCardProps) {
  return (
    <article className={`task ${overlay ? "task-overlay" : ""}`}>
      <div className="task-main">
        <button type="button" className="drag-handle" aria-label={`Drag ${task.title}`} {...dragHandleProps}>
          ::
        </button>
        <div>
          <h3>{task.title}</h3>
          {task.description ? <p>{task.description}</p> : null}
        </div>
      </div>
      {onDelete ? (
        <button type="button" className="danger" onClick={() => onDelete(task.id)} aria-label={`Delete ${task.title}`}>
          Delete
        </button>
      ) : null}
    </article>
  );
}
