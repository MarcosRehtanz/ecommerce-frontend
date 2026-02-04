# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Dynnamo is a B2C e-commerce frontend built with Next.js 14 (App Router), Mantine v7, Zustand, and TanStack Query. It connects to a NestJS backend API.

## Commands

```bash
npm run dev        # Dev server on port 3001
npm run build      # Production build
npm run lint       # ESLint (Next.js config)
```

There are no test scripts configured.

## Architecture

### Routing & Rendering

- **Route Groups**: `(auth)` for login/register, `(shop)` for customer pages, `admin/` for admin panel
- **Server Components**: Pages use `async` functions with ISR (60s revalidate). Server-side fetches use `lib/api/server.ts` with React `cache()` for deduplication
- **Client Components**: Marked with `'use client'` for interactivity

### State Management (Two-Layer Pattern)

- **Server state**: TanStack Query with 60s default staleTime. All API hooks in `hooks/` wrap query/mutation calls with proper cache invalidation
- **Client state**: Zustand stores in `stores/` with localStorage persistence and hydration awareness (`_hasHydrated` flag)

### Cart Sync Strategy

Anonymous users have a local cart (Zustand `cartStore`). On login, the local cart merges with the server cart using MAX quantity strategy. `useUnifiedCart` provides a single interface regardless of auth state.

### Auth Flow

1. Tokens stored in Zustand `authStore` (persisted to localStorage)
2. Axios interceptor (`lib/api/axios.ts`) adds Bearer token to requests
3. On 401 with expired token → automatic refresh, queuing concurrent requests
4. On refresh failure → logout and redirect to `/login`
5. `AuthGuard` component waits for Zustand hydration before checking auth client-side

### API Layer

`lib/api/axios.ts` is the central Axios instance with auth interceptors. Each domain has its own API module in `lib/api/` and corresponding hook in `hooks/`. The pattern is: API module (raw fetch) → custom hook (TanStack Query wrapper) → component.

### Key Directories

- `src/app/` — Next.js App Router pages and layouts
- `src/components/` — Reusable UI components (auth, layout, home, providers, ui)
- `src/hooks/` — 12 custom hooks wrapping all API operations
- `src/lib/api/` — 12 Axios-based API modules + server-side fetch helpers
- `src/stores/` — Zustand stores (authStore, cartStore)
- `src/types/index.ts` — All TypeScript interfaces in one file

### UI & Forms

- **Components**: Mantine v7 component library
- **Forms**: React Hook Form + Zod validation via `@hookform/resolvers`
- **Notifications**: Mantine notifications for user feedback
- **Icons**: Tabler Icons React
- **Charts**: Recharts (admin dashboard)

### Environment Variables

All prefixed with `NEXT_PUBLIC_`:
- `NEXT_PUBLIC_API_URL` — Backend API base URL
- `NEXT_PUBLIC_APP_URL` — Frontend URL (used in metadata)
- `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY` — MercadoPago public key
- `NEXT_PUBLIC_MP_SANDBOX` — Payment sandbox mode toggle

### Path Alias

`@/*` maps to `./src/*` (configured in tsconfig.json).
