# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

The app lives in `factoryflow/` — a Next.js 16 + React 19 factory management dashboard called **FactoryFlow**. All development work happens inside that directory.

```
factoryflow/
  app/
    api/          # Next.js Route Handlers (REST API)
    components/   # Reusable UI components
    lib/db.ts     # Singleton Prisma client
    (pages)/      # bills/, inventory/, tickets/ — page routes
  prisma/
    schema.prisma # PostgreSQL schema (Bill, Inventory, Ticket)
```

## Commands

Run all commands from `factoryflow/`:

```bash
npm run dev      # Start dev server (uses webpack explicitly)
npm run build    # Production build (uses webpack explicitly)
npm run lint     # ESLint
```

Database:
```bash
npx prisma migrate dev   # Apply migrations + regenerate client
npx prisma generate      # Regenerate client after schema changes
npx prisma studio        # GUI to inspect database
```

Requires `DATABASE_URL` env var pointing to a PostgreSQL instance.

## Architecture

**Data models** (`prisma/schema.prisma`): `Bill`, `Inventory`, `Ticket`. Status fields are plain strings — no enums enforced at the DB level.

**API layer** (`app/api/`): Next.js Route Handlers. Currently only `bills` has a full REST API (`GET/POST` at `/api/bills`, `GET/PATCH/DELETE` at `/api/bills/[id]`). The `[id]` route uses `new PrismaClient()` directly (inconsistent with the singleton in `lib/db.ts` — prefer the singleton when adding new routes).

**Kanban system**: The generic `KanbanBoard<T>` component (`app/components/kanban/KanbanBoard.tsx`) accepts typed columns and a `renderCard` render prop. It uses `@hello-pangea/dnd` for drag-and-drop. Dropping a card calls `onStatusChange(id, newStatus)` if provided, otherwise falls back to a direct `PATCH /api/bills/:id`. Bills use optimistic UI updates on drag; tickets do not yet have a status-change API.

**Form system**: `FormWrapper` (`app/components/forms/base/FormWrapper.tsx`) is a generic controlled form that injects `form` state and `handleChange` into children via `React.cloneElement`. Field components (e.g. `BillFields`) receive these as props. `BillForm` wraps `FormWrapper` + `BillFields` and is used by both the add and edit pages.

**Page pattern**: All pages are `"use client"` components that fetch from the API routes on mount. There are no React Server Components fetching data directly — all data flows through the client-side fetch → API Route Handler → Prisma pattern.

**Bill statuses**: `unpaid` | `processing` | `paid` | `overdue` (defined as `STATUSES` array in `app/bills/page.tsx`).

**Ticket statuses**: `open` | `in progress` | `closed` (defined in `app/tickets/page.tsx`). No ticket API routes exist yet.

**Inventory**: The page file exists but is currently empty — not yet implemented.
