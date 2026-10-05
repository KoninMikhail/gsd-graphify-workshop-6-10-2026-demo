# Наблюдаемость

Отдельного стека метрик, трассировки и алертинга в репозитории нет. Есть только лог процесса бэкенда.

## Лог Fastify

В `apps/backend/src/index.ts` сервер создаётся с включённым логгером:

```ts
const app = Fastify({ logger: true });
```

Если `listen` не удаётся, ошибка пишется в этот лог и процесс завершается с кодом 1:

```ts
try {
  await app.listen({ port: PORT, host: HOST });
} catch (error) {
  app.log.error(error);
  process.exit(1);
}
```

`PORT` берётся из `process.env.PORT`, иначе `3001`. `HOST` — из `process.env.HOST`, иначе `0.0.0.0`.

Других настроек логирования в коде нет.
