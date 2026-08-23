# Search Architecture & Pagination Strategy

This document outlines the architecture for the Phase 11 search, discovery, and filtering features in BYTE++ Food.

## 1. Overview
The primary goal is to provide a fast, robust search experience across both Restaurants and Menu Items without downloading the entire dataset to the client. The system implements server-side filtering, sorting, and cursor-based pagination.

## 2. Database Layer (PostgreSQL & Prisma)

To maintain sub-millisecond query performance as the application scales, targeted B-tree indexes have been deployed on highly queried text and enum fields.

**Schema Additions:**
```prisma
model Restaurant {
  @@index([name])
}

model MenuItem {
  @@index([name])
  @@index([price])
  @@index([dietaryType])
}
```

## 3. Backend API (NestJS)

Search logic has been encapsulated in the following REST endpoints:

- `GET /api/v1/restaurants`: Fetches active restaurants.
  - Query Params: `q` (string), `limit` (int), `cursor` (string)
- `GET /api/v1/restaurants/:id/menu`: Fetches menu items scoped to a restaurant.
  - Query Params: `q`, `category`, `minPrice`, `maxPrice`, `dietaryType`, `availability`, `sort`, `limit`, `cursor`.
- `GET /api/v1/menu/search`: Global search across all restaurants.
  - Query Params: Same as above.

**Pagination Strategy:**
We utilize **Cursor-Based Pagination** (`limit` + `cursor`) instead of Offset-Based (`page` + `limit`).
- **Why?** Cursor pagination provides stable views. If new menu items are added while a user is scrolling, offset pagination skips or duplicates items. Cursor pagination explicitly requests items *after* the last known ID, eliminating these artifacts.
- **Implementation:** The backend queries `limit + 1` items to detect if there is a next page. If true, it returns `nextCursor: items.pop().id`.

## 4. Frontend Mobile Client (React Native + Expo)

The search features are powered by TanStack Query's infinite data fetching capabilities (`useInfiniteQuery`).

### `useDebounce` Hook
Search requests are extremely heavy on databases. To prevent keystroke-spam, the frontend uses a `useDebounce` hook that delays state updates by 500ms.

### `SearchScreen` UI
- An accessible interface that implements real-time querying against `GET /api/v1/menu/search`.
- Uses a `Modal` to cleanly group advanced filters (`minPrice`, `maxPrice`, `dietaryType`, `sort`).
- Renders an `ActivityIndicator` as a footer to lazily load the next page via `onEndReached`.
