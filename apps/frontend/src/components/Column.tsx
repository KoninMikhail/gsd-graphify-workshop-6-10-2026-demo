import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { Task, TaskStatus } from "@repo/shared";
import { SortableTask } from "./SortableTask";

type ColumnProps = {
  status: TaskStatus;
  title: string;
  tasks: Task[];
  onDelete: (id: string) => void;
};

export function Column({ status, title, tasks, onDelete }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <section className={`column ${isOver ? "column-over" : ""}`} ref={setNodeRef}>
      <header className="column-header">
        <h2>{title}</h2>
        <span>{tasks.length}</span>
      </header>
      <SortableContext items={tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
        <div className="column-list">
          {tasks.map((task) => (
            <SortableTask key={task.id} task={task} onDelete={onDelete} />
          ))}
        </div>
      </SortableContext>
    </section>
  );
}
