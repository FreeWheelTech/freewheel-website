# Database Seed Data (Phase 2B Update)

The database is seeded using a highly robust and idempotent TypeScript script (`prisma/seed.ts`). This guarantees identical initialization when booting the application in new environments.

## Source Menu Identity
The strict source of truth for the database menu is the provided PDF `Black Yellow Restaurant Food Menu (7).pdf`.

- **Restaurant Name:** BYTE++ Café
- **Address:** 5th Floor, Uniworld-2, Bangalore
- **Category Count:** 11 Categories
- **Menu Item Count:** 61 Items
- **Add-on Count:** 1 Add-on template ("With Cheese" at ₹10) assigned to 10 specific menu items.

## Discrepancies & Typographical Fidelity
During the implementation of Phase 2B, the database was aligned precisely with the PDF source, which included:
1. Identifying and propagating the typographical error `"EGG SPEACIAL (2PC)"` verbatim.
2. Identifying an empty text layer (blank golden box) on page 3 and safely categorizing its adjacent elements as `JUICES`.
3. Overriding prior inaccurate price specifications (e.g. Ice Cream Butterscotch is seeded as `₹35`, not `₹45`).

## Idempotency Strategy
The seed utilizes a programmatic uniqueness check strategy:
1. `prisma.restaurant.upsert()` is used to ensure the cafe is only created once.
2. `prisma.category.findFirst()` ensures that if a category with the same name already exists in the cafe, it skips creation.
3. Menu items perform a `findFirst` lookup. If found, they are **updated** with the PDF source truth (prices/dietary classifications). If not, they are **created**.
4. Duplicate `npm run seed` executions dynamically detect the existing records and will mutate 0 new rows.

## Price Representation
Following the schema, prices are committed natively as `Decimal` instances. This enforces database-level precision without falling prey to Javascript's Float64 limits.

## Dietary/Red-Marker Handling
The PDF utilizes a red dot emoji `🔴` next to items indicating non-vegetarian/egg contents. The seed script correctly strips this visual marker from the display name string (`name`) and instead maps it purely to the `DietaryType` enum (`EGG` or `NON_VEG`). This guarantees that UI frontends can render custom iconography based on a strictly typed backend constraint, rather than parsing unicode emojis.
