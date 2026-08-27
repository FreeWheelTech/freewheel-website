# Menu Module Architecture

## 1. Backend Architecture
The backend is powered by NestJS and Prisma ORM connecting to PostgreSQL.
- **MenuModule & RestaurantsModule**: These are deliberately decoupled to allow scaling restaurants independently of their specific menus.
- **Authorization (IDOR Protection)**: When an Owner accesses a protected route (`OwnerMenuController`), the system extracts their JWT `sub` (User ID). The `verifyOwner` private method in `MenuService` queries the `RestaurantStaff` table to ensure that `userId` has an explicit assignment to `restaurantId`. If no record exists, a `403 Forbidden` is thrown.
- **Data Filtering**: The Customer `GET /menu` endpoint supports query parameters (`category`, `search`, `availability`) which are dynamically parsed into Prisma's `where` clause, avoiding full table scans and pushing the filtering logic down to the database level.

## 2. Frontend Data Fetching (TanStack Query)
To solve complex state management for menus, both mobile applications utilize `@tanstack/react-query`.
- **Server State**: TanStack Query separates "server state" (menu items) from "client UI state" (selected category tab, search input string).
- **Caching**: Queries are configured with a `staleTime` of 60 seconds. This allows a user to flip between categories without triggering continuous backend HTTP requests, providing a snappy experience.
- **Cache Invalidation**: When an Owner toggles a menu item's availability, the `useMutation` hook fires. `onSuccess`, we call `queryClient.invalidateQueries(['owner-menu'])`, immediately dropping the stale cache and fetching the fresh data. This guarantees real-time synchronization between actions and the UI.

## 3. Performance Considerations
- **FlatList vs ScrollView**: The Customer Home screen uses a horizontal `<FlatList>` for categories and a vertical `<FlatList>` for menu items. A standard `<ScrollView>` renders all children immediately, crashing on long lists. `<FlatList>` lazily renders only items that are visible on the screen.
