# Graph Report - gsd-graphify-workshop-6-10-2026-demo  (2026-10-05)

## Corpus Check
- Corpus is ~13,430 words - fits in a single context window. You may not need a graph.

## Summary
- 305 nodes · 325 edges · 60 communities (20 shown, 40 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.88)
- Token cost: 66,329 input · 15,741 output

## Community Hubs (Navigation)
- Kanban Board UI
- SQLite Task Store
- Backend Package Manifest
- Frontend Package Manifest
- Shared Package Manifest
- Root Workspace Manifest
- Turborepo Task Config
- Base TypeScript Config
- React TypeScript Config
- Node TypeScript Config
- Shared Task Types
- Frontend API Client
- Backend TypeScript Config
- Frontend UI Dependencies
- Shared TypeScript Config
- Frontend App TypeScript Config
- Architecture Memory Bank
- TypeScript Config Package
- Security and Policies
- Tooling and Workspaces
- ADR Skill Docs
- Local Setup Docs
- API Contract Docs
- API Reference Index
- Routes and HTTP Errors
- Search and Testing Docs
- Frontend Backend Packages
- Frontend HTML Entry
- Pull Request Skill
- Common Issues Doc
- Development Workflow Doc
- Local Infra Options
- Onboarding Checklist
- Error Handling Doc
- Events and Realtime Doc
- Persistence Doc
- Schedulers Doc
- CI Scripts Doc
- Graphify Tooling Doc
- API Domains Doc
- Tasks Domain Doc
- Entities Catalog
- Environment Config Doc
- Reading Guide
- Services Catalog
- Observability Doc
- Operations Overview
- Runbooks Index
- Domain Context
- Domains Overview
- Ecosystem Context
- Infrastructure Context
- Product Context
- Project Brief
- Tech Stack Doc
- Workflow Doc
- Shared Package Name
- SQLite Database File

## God Nodes (most connected - your core abstractions)
1. `App()` - 13 edges
2. `compilerOptions` - 10 edges
3. `compilerOptions` - 8 edges
4. `request()` - 7 edges
5. `compilerOptions` - 7 edges
6. `scripts` - 6 edges
7. `scripts` - 6 edges
8. `listTasks()` - 5 edges
9. `getTask()` - 5 edges
10. `createTask()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `Skill: Create ADR` --references--> `ADR Index`  [EXTRACTED]
  .cursor/skills/create-adr/SKILL.md → docs/adr/README.md
- `App()` --calls--> `Column()`  [EXTRACTED]
  apps/frontend/src/App.tsx → apps/frontend/src/components/Column.tsx
- `App()` --calls--> `TaskCard()`  [EXTRACTED]
  apps/frontend/src/App.tsx → apps/frontend/src/components/TaskCard.tsx
- `Column()` --calls--> `SortableTask()`  [EXTRACTED]
  apps/frontend/src/components/Column.tsx → apps/frontend/src/components/SortableTask.tsx
- `SortableTask()` --calls--> `TaskCard()`  [EXTRACTED]
  apps/frontend/src/components/SortableTask.tsx → apps/frontend/src/components/TaskCard.tsx

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Monorepo Workspaces** — apps_frontend, apps_backend, packages_shared [EXTRACTED 1.00]

## Communities (60 total, 40 thin omitted)

### Community 0 - "Kanban Board UI"
Cohesion: 0.12
Nodes (18): App(), handleDragEnd(), handleDragOver(), persistBoard(), findContainer(), flattenBoard(), groupByStatus(), Column() (+10 more)

### Community 1 - "SQLite Task Store"
Cohesion: 0.12
Nodes (19): assertStatus(), createTask(), db, dbPath, deleteTask(), DEMO_TASKS, __dirname, getTask() (+11 more)

### Community 2 - "Backend Package Manifest"
Cohesion: 0.07
Nodes (26): dependencies, fastify, @fastify/cors, @repo/shared, devDependencies, @repo/typescript-config, tsx, @types/node (+18 more)

### Community 3 - "Frontend Package Manifest"
Cohesion: 0.08
Nodes (25): devDependencies, @repo/typescript-config, @types/react, @types/react-dom, typescript, vite, @vitejs/plugin-react, @repo/shared (+17 more)

### Community 4 - "Shared Package Manifest"
Cohesion: 0.12
Nodes (15): devDependencies, @repo/typescript-config, typescript, exports, @repo/typescript-config, typescript, name, private (+7 more)

### Community 5 - "Root Workspace Manifest"
Cohesion: 0.13
Nodes (14): devDependencies, turbo, typescript, typescript, name, packageManager, private, scripts (+6 more)

### Community 6 - "Turborepo Task Config"
Cohesion: 0.15
Nodes (12): dependsOn, outputs, cache, persistent, dependsOn, $schema, tasks, build (+4 more)

### Community 7 - "Base TypeScript Config"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, declarationMap, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, moduleResolution, skipLibCheck (+3 more)

### Community 8 - "React TypeScript Config"
Cohesion: 0.17
Nodes (11): compilerOptions, allowImportingTsExtensions, jsx, lib, module, moduleResolution, noEmit, target (+3 more)

### Community 9 - "Node TypeScript Config"
Cohesion: 0.18
Nodes (10): compilerOptions, lib, module, moduleResolution, outDir, rootDir, target, extends (+2 more)

### Community 10 - "Shared Task Types"
Cohesion: 0.22
Nodes (8): COLUMN_LABELS, CreateTaskInput, ReorderTasksInput, Task, TASK_STATUSES, TaskStatus, UpdateTaskInput, WORKSHOP_NAME

### Community 11 - "Frontend API Client"
Cohesion: 0.46
Nodes (7): createTask(), deleteTask(), fetchTasks(), reorderTasks(), request(), resetToDemo(), updateTask()

### Community 12 - "Backend TypeScript Config"
Cohesion: 0.29
Nodes (6): compilerOptions, outDir, rootDir, extends, include, @repo/typescript-config/node.json

### Community 13 - "Frontend UI Dependencies"
Cohesion: 0.29
Nodes (7): dependencies, @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities, react, react-dom, @repo/shared

### Community 14 - "Shared TypeScript Config"
Cohesion: 0.29
Nodes (6): compilerOptions, outDir, rootDir, extends, include, @repo/typescript-config/node.json

### Community 15 - "Frontend App TypeScript Config"
Cohesion: 0.33
Nodes (5): compilerOptions, types, extends, include, @repo/typescript-config/react.json

### Community 16 - "Architecture Memory Bank"
Cohesion: 0.40
Nodes (5): System Architecture, Codebase Map, Data Flow, Memory Bank Index, Documentation Root

### Community 17 - "TypeScript Config Package"
Cohesion: 0.40
Nodes (4): files, name, private, version

### Community 19 - "Security and Policies"
Cohesion: 0.67
Nodes (3): Authentication and Security, Cross-cutting Policies, Integrations

### Community 20 - "Tooling and Workspaces"
Cohesion: 0.67
Nodes (3): Tooling Overview, npm workspaces, Turborepo

## Knowledge Gaps
- **198 isolated node(s):** `name`, `version`, `private`, `type`, `build` (+193 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 211 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **40 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@fastify/cors` connect `Backend Package Manifest` to `SQLite Task Store`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Why does `fastify` connect `Backend Package Manifest` to `SQLite Task Store`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Why does `@dnd-kit/sortable` connect `Kanban Board UI` to `Frontend Package Manifest`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _198 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Kanban Board UI` be split into smaller, more focused modules?**
  _Cohesion score 0.11742424242424243 - nodes in this community are weakly interconnected._
- **Should `SQLite Task Store` be split into smaller, more focused modules?**
  _Cohesion score 0.11954022988505747 - nodes in this community are weakly interconnected._
- **Should `Backend Package Manifest` be split into smaller, more focused modules?**
  _Cohesion score 0.07407407407407407 - nodes in this community are weakly interconnected._