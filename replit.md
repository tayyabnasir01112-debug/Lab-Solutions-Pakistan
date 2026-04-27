# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Artifacts

- **Science Centre Pakistan** (`artifacts/science-centre/`) — Enterprise marketing site at `/`. React + Vite + Wouter. B2B distributor of laboratory equipment and analytical instruments.
  - Pages: `/` (landing), `/products` (full catalogue with 8 brands × 8 categories filterable)
  - Shared components: `src/components/site-navbar.tsx`, `src/components/site-footer.tsx`
  - Solutions section (home `#solutions`) uses NgeneBio-inspired dual-pane interactive showcase: hover the vertical category list on the left to swap the large image card on the right (with floating semi-transparent white overlay card + dashed-circle accent arrow button).
  - No backend needed — static, presentation-first.
- **Mockup Sandbox** (`artifacts/mockup-sandbox/`) — Canvas design workspace at `/__mockup`.
- **API Server** (`artifacts/api-server/`) — Express backend at `/api`.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Science Centre Design System

- **Primary font**: Inter (body), Plus Jakarta Sans (headings)
- **Primary color**: hsl(204, 89%, 56%) — science blue (#2EA3F2)
- **Secondary color**: hsl(202, 97%, 44%) — deep blue (#038BDC)
- **Accent**: hsl(205, 88%, 80%) — light blue (#9FD3F8)
- **Background**: white / dark navy (#0D1628)
- **Images**: stored in `artifacts/science-centre/public/images/` — sc-hero.png, sc-instruments.png, sc-diagnostics.png

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
