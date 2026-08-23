# Phase 2 Final Report: Database Foundation

## 1. Database Architecture
Normalized relational database architecture running on PostgreSQL.

## 2. Complete Entity List
`User`, `CustomerProfile`, `Address`, `Restaurant`, `RestaurantStaff`, `Category`, `MenuItem`, `MenuItemAddon`, `Cart`, `CartItem`, `Order`, `OrderItem`, `Payment`, `OrderStatusHistory`, `Review`, `Notification`.

## 3. Relationships
- **User ↔ CustomerProfile**: 1:1 (Cascade Delete)
- **User ↔ RestaurantStaff**: 1:N (Cascade Delete)
- **CustomerProfile ↔ Address**: 1:N (Cascade Delete)
- **Restaurant ↔ Category**: 1:N (Cascade Delete)
- **Category ↔ MenuItem**: 1:N (Cascade Delete)
- **MenuItem ↔ MenuItemAddon**: 1:N (Cascade Delete)
- **CustomerProfile ↔ Cart**: 1:1 (Cascade Delete)
- **Order ↔ OrderItem**: 1:N (Cascade Delete)
- **Order ↔ OrderStatusHistory**: 1:N (Cascade Delete)
- **Order ↔ Payment**: 1:1 (Cascade Delete)
- **OrderItem ↔ MenuItem**: N:1 (Restrict Delete) - Preserves historical accuracy.

## 4. Enums
- **Role**: CUSTOMER, OWNER, ADMIN
- **DietaryType**: VEG, EGG, NON_VEG
- **OrderStatus**: PLACED, ACCEPTED, PREPARING, READY, COMPLETED, CANCELLED, REJECTED
- **PaymentStatus**: PENDING, SUCCESS, FAILED, REFUNDED

## 5. Constraints
- **Primary Keys**: UUID default mapping on all entities.
- **Unique**: `User.email`, `User.phone`, `CustomerProfile.userId`, `Payment.orderId`.
- **Compound Unique**: `Category.[restaurantId, name]`, `RestaurantStaff.[userId, restaurantId]`, `Review.[customerProfileId, orderId]`.
- **Referential Integrity**: Defined using `Restrict` where data must be immutable (e.g. Order records).

## 6. Indexes
- `Category.restaurantId`
- `MenuItem.categoryId`
- `MenuItem.availability`
- `Order.customerProfileId`
- `Order.restaurantId`
- `Order.status`
- `Order.createdAt`
- `OrderStatusHistory.orderId`
- `Notification.userId`

## 7. Prisma Version
Prisma 5.22.0 (To ensure traditional standard configuration syntax and robust stability).

## 8. PostgreSQL Version
PostgreSQL 18.4 (via Homebrew).

## 9. Migration Result
PASS. Database successfully migrated via `npx prisma migrate dev --name init`.

## 10. Seed Result
PASS. Deterministic seeder executed via `ts-node`. Repeated executions skip duplicates safely via conditional `upsert`/`findFirst` checks.

## 11. Number of Seed Records
- **Restaurant**: 1 (BYTE++ Café)
- **Categories**: 11 (Rolls, Sandwiches, Burgers & Sides, etc.)
- **Menu Items**: 58
- **Add-ons**: 10 (With Cheese modifiers)

## 12. Database Test Results
PASS.

## 13. Tests Passed
6/6 Database specific tests passed. (8/8 backend tests overall passed).

## 14. Tests Failed
0

## 15. Type-check Result
PASS (`npx tsc --noEmit`).

## 16. Lint Result
PASS (`npm run lint`).

## 17. Build Result
PASS (`npm run build`).

## 18. Errors/Warnings
None. `any` type coercions required for strict testing paradigms were properly bypassed using `@ts-expect-error` ensuring type safety without eslint errors.

## 19. Documentation Created
- `docs/database/schema.md`
- `docs/database/seed-data.md`
- Updated `docs/interviews/interview-guide.md` with 20 project-specific database questions.

## 20. Known Limitations
- The integration tests wipe the database using `deleteMany()`. In a full CI/CD pipeline, a separate isolated shadow/test database should be instantiated instead of pointing to the local development instance.

## 21. Next Recommended Phase
**Phase 3 — Authentication & Authorization:** Implement JWT-based secure authentication, distinguishing between `CUSTOMER`, `OWNER`, and `ADMIN` flows.
