# Review Architecture (Phase 12)

## 1. Overview
The Review & Ratings system enables customers to rate and review their completed orders, and provides a consolidated view of these reviews to restaurant owners. The architecture ensures that a user can only review a restaurant if they have actually placed a successful order and received their food.

## 2. Data Model
A new `Review` model is introduced in the Prisma schema with the following structure:
- **Primary Keys/Relations**: `id`, `customerProfileId`, `restaurantId`, `orderId`
- **Fields**: `rating` (Int, 1-5), `comment` (String, optional, max 500 chars)
- **Timestamps**: `createdAt`, `updatedAt`

### Constraints & Integrity
A unique compound constraint is applied on `[customerProfileId, orderId]`. This enforces the business rule: **One Review per Order**. By moving this constraint to the database layer via `@@unique`, race conditions during review creation are natively prevented.

## 3. Rating Aggregation
Instead of calculating a restaurant's average rating dynamically via a SQL `AVG()` aggregation on every fetch (which becomes an N+1 or high-CPU operation as scale increases), the `Restaurant` model physically maintains two aggregate fields:
- `averageRating` (Decimal)
- `reviewCount` (Int)

### Maintenance via Prisma Transactions
Whenever a review is created, updated, or deleted, a strict `$transaction` executes two operations:
1. Modifies the `Review` table.
2. Atomically reads the previous aggregates, performs mathematically exact recalibrations based on the old rating vs new rating, and updates the `Restaurant` table.

## 4. Authorization & Eligibility
- **Eligibility**: The POST `/reviews` endpoint queries the `Order` table for a `COMPLETED` order matching the `customerProfileId`, `restaurantId`, and `orderId`. If not found, a `403 Forbidden` is returned.
- **Ownership (IDOR Protection)**: The `PATCH` and `DELETE` operations verify that the `customerProfileId` mapped to the JWT token strictly equals the `customerProfileId` stored on the review itself. Owners cannot modify these reviews.

## 5. Pagination
To prevent fetching thousands of reviews into device memory, the `GET /restaurants/:id/reviews` endpoint uses **Cursor-based Pagination**. We limit fetching to chunks of 20, returning a `nextCursor` to the mobile client allowing infinite scroll integration in TanStack Query via `useInfiniteQuery`.

## 6. Future Considerations (Moderation & Anti-Abuse)
- **Spam Detection**: Currently, comments are limited to 500 characters and trimmed of whitespace. A future iteration should integrate an LLM or ML classifier pipeline to auto-flag profanity.
- **Moderation Queue**: We currently don't expose moderation APIs, but the data model supports adding an `isFlagged` or `status` enum for admin-level takedowns.
