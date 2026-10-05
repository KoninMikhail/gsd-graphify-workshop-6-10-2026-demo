# Product context

Продукт — одна страница **Task Board** (`apps/frontend/index.html`, заголовок «Task Board», `lang="en"`). Подзаголовок в шапке: карточки перетаскиваются между колонками, изменения уходят в Fastify и SQLite.

Ролей и входа в систему нет. Любой, кто открыл dev-сервер, работает с одной общей базой на машине, где запущен backend.

## Колонки

Три статуса из `@repo/shared`, подписи на английском:

| `status` | `COLUMN_LABELS` |
| --- | --- |
| `todo` | To Do |
| `in_progress` | In Progress |
| `done` | Done |

## Действия на доске

Реализовано в `apps/frontend/src/App.tsx`:

- загрузка списка при открытии;
- форма «Add a task…» — создаёт задачу только с заголовком (статус по умолчанию `todo`);
- перетаскивание внутри колонки и между колонками (`@dnd-kit`, `PointerSensor`, порог 6 px);
- удаление карточки;
- кнопка **Reset demo** — три исходные задачи;
- баннеры загрузки, сохранения и ошибки.

Редактирования заголовка и описания на доске нет. Клиентская функция `updateTask` в `apps/frontend/src/api.ts` есть, вызовов из UI нет. Серверный `PATCH /tasks/:id` при этом работает.

Пустой заголовок в форме не отправляется. Описание на карточке показывается, только если оно непустое.

## Демо-набор

Если таблица пустая при старте backend, или после reset, создаются три задачи без описания:

1. Sketch the board layout — `todo`
2. Wire Fastify routes — `in_progress`
3. Demo drag and drop — `done`

См. [domain-context.md](./domain-context.md) и [domains.md](./domains.md).
