# Каталог функций хранилища

Файл: `apps/backend/src/db.ts`. Ниже только реальные экспорты. Внутренние `mapRow`, `assertStatus`, `nextPosition`, `seedDemoTasks` наружу не отдаются.

Импорты в `apps/backend/src/index.ts`: `createTask`, `deleteTask`, `getTask`, `listTasks`, `reorderTasks`, `resetToDemo`, `seedIfEmpty`, `updateTask`. `seedIfEmpty()` вызывается при загрузке модуля, до регистрации маршрутов.

| Экспорт | Сигнатура | Поведение |
| --- | --- | --- |
| `listTasks` | `() => Task[]` | Все строки. Порядок: статус `todo`, затем `in_progress`, затем `done`; внутри статуса `position ASC`, затем `created_at ASC` |
| `getTask` | `(id: string) => Task \| undefined` | Одна строка по `id`. Нет строки — `undefined` |
| `createTask` | `(input: CreateTaskInput) => Task` | Пишет строку. Пустой `title` после `trim` — ошибка `"Title is required"`. Статус по умолчанию `"todo"`. Чужой статус — `"Invalid status: …"`. `position` — `MAX(position) + 1` внутри статуса; если строк нет, `COALESCE` даёт `0` |
| `updateTask` | `(id, input: UpdateTaskInput) => Task \| undefined` | Нет строки — `undefined`. Иначе обновляет переданные поля, `updated_at` ставится заново. Пустой `title` — `"Title is required"`. Чужой статус — `"Invalid status: …"` |
| `deleteTask` | `(id: string) => boolean` | `true`, если `changes > 0` |
| `reorderTasks` | `(items) => Task[]` | Транзакция `BEGIN` / `COMMIT`. Для каждого элемента проверяет статус и наличие строки, затем пишет `status`, `position`, `updated_at`. Нет строки — `"Task not found: <id>"`, откат `ROLLBACK`. Успех — полный `listTasks()` |
| `seedIfEmpty` | `() => void` | Если `COUNT(*) > 0`, выходит. Иначе вставляет три демо-задачи |
| `resetToDemo` | `() => Task[]` | `DELETE FROM tasks`, затем три демо-задачи, возвращает `listTasks()` |

Демо-задачи (`DEMO_TASKS`):

| title | status |
| --- | --- |
| Sketch the board layout | `todo` |
| Wire Fastify routes | `in_progress` |
| Demo drag and drop | `done` |

Описания у демо-задач нет: `createTask` пишет пустую строку.
