import Fastify from "fastify";
import cors from "@fastify/cors";
import type { CreateTaskInput, ReorderTasksInput, UpdateTaskInput } from "@repo/shared";
import {
  createTask,
  deleteTask,
  getTask,
  listTasks,
  reorderTasks,
  resetToDemo,
  seedIfEmpty,
  updateTask,
} from "./db.js";

const PORT = Number(process.env.PORT ?? 3001);
const HOST = process.env.HOST ?? "0.0.0.0";

seedIfEmpty();

const app = Fastify({ logger: true });

await app.register(cors, {
  origin: true,
});

app.get("/health", async () => ({ ok: true }));

app.get("/tasks", async () => listTasks());

app.post("/tasks/reset", async () => resetToDemo());

app.put<{ Body: ReorderTasksInput }>("/tasks/reorder", async (request, reply) => {
  try {
    const items = request.body?.items ?? [];
    if (!Array.isArray(items) || items.length === 0) {
      return reply.code(400).send({ error: "items array is required" });
    }
    return reorderTasks(items);
  } catch (error) {
    return reply.code(400).send({
      error: error instanceof Error ? error.message : "Invalid reorder payload",
    });
  }
});

app.get<{ Params: { id: string } }>("/tasks/:id", async (request, reply) => {
  const task = getTask(request.params.id);
  if (!task) {
    return reply.code(404).send({ error: "Task not found" });
  }
  return task;
});

app.post<{ Body: CreateTaskInput }>("/tasks", async (request, reply) => {
  try {
    const task = createTask(request.body ?? { title: "" });
    return reply.code(201).send(task);
  } catch (error) {
    return reply.code(400).send({
      error: error instanceof Error ? error.message : "Invalid task",
    });
  }
});

app.patch<{ Params: { id: string }; Body: UpdateTaskInput }>(
  "/tasks/:id",
  async (request, reply) => {
    try {
      const task = updateTask(request.params.id, request.body ?? {});
      if (!task) {
        return reply.code(404).send({ error: "Task not found" });
      }
      return task;
    } catch (error) {
      return reply.code(400).send({
        error: error instanceof Error ? error.message : "Invalid task",
      });
    }
  },
);

app.delete<{ Params: { id: string } }>("/tasks/:id", async (request, reply) => {
  const deleted = deleteTask(request.params.id);
  if (!deleted) {
    return reply.code(404).send({ error: "Task not found" });
  }
  return reply.code(204).send();
});

try {
  await app.listen({ port: PORT, host: HOST });
} catch (error) {
  app.log.error(error);
  process.exit(1);
}
