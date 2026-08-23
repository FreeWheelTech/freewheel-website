# Database Schema

The database for BYTE++ Food is designed relationally using **PostgreSQL 18** and modeled via **Prisma ORM**.

## Entities and Descriptions

### 1. User Access & Control
- **User**: The central identity entity supporting Customers, Owners, and Admins. Passwords are intentionally hashed.
  - *Indexes*: `email` (Unique), `phone` (Unique, Nullable)
- **CustomerProfile**: Extends `User` for customer-specific interactions (cart, orders, reviews). 1:1 relationship with `User`.
- **Address**: A 1:N relationship with `CustomerProfile`. Stores multiple physical addresses per customer.
- **RestaurantStaff**: An M:N join table connecting `User` to `Restaurant`. Uses a unique compound index `[userId, restaurantId]` to prevent duplicate assignments.

### 2. Core Restaurant Data
- **Restaurant**: Core business entity (e.g., BYTE++ Café).
- **Category**: A menu grouping belonging to a `Restaurant`. Uses a unique compound constraint `[restaurantId, name]`.
- **MenuItem**: Items available for purchase.
  - *Fields*: `price` (Decimal type to avoid floating point math errors). `dietaryType` (Enum: `VEG`, `EGG`, `NON_VEG` preserving original menu constraints).
  - *Indexes*: `categoryId`, `availability`
- **MenuItemAddon**: Optional modifiers linking back to a `MenuItem` (e.g. "With Cheese").

### 3. Order Processing & History
- **Cart** & **CartItem**: Volatile storage for items pending checkout. Prices are not strictly preserved here as they are recalculated on order placement.
- **Order**: The immutable finalized purchase request. Links Customer, Restaurant, and Payment.
  - *Indexes*: `customerProfileId`, `restaurantId`, `status`, `createdAt`
- **OrderItem**: Items assigned to an order.
  - *Historical Pricing*: Includes a `historicalPrice` (Decimal) field. If a `MenuItem` price changes in the future, the `OrderItem` price remains fixed at the point of sale.
- **OrderStatusHistory**: Records timestamped state transitions (e.g. `PLACED` -> `ACCEPTED` -> `PREPARING`) for auditability.
- **Payment**: A 1:1 link to the `Order` tracking financial status (`PENDING`, `SUCCESS`, etc). 

## Cascade Decisions
- **`ON DELETE CASCADE`**: Used when a child entity makes no logical sense without the parent. For instance, if a `User` is deleted, their `CustomerProfile` is also deleted. If a `Restaurant` is deleted, its `Category` and `MenuItem` entries vanish.
- **`ON DELETE RESTRICT`**: Crucially used for `OrderItem` references to `MenuItem`. A `MenuItem` CANNOT be deleted if it exists on an historical `Order`. This preserves financial data integrity.

## Enums
- **Role**: `CUSTOMER`, `OWNER`, `ADMIN`
- **DietaryType**: `VEG`, `EGG`, `NON_VEG`
- **OrderStatus**: `PLACED`, `ACCEPTED`, `PREPARING`, `READY`, `COMPLETED`, `CANCELLED`, `REJECTED`
- **PaymentStatus**: `PENDING`, `SUCCESS`, `FAILED`, `REFUNDED`

## Monetary Representation
All prices, subtotals, and totals are represented using the `Decimal` data type in Prisma, which safely maps to PostgreSQL's numeric types. JavaScript `Number` (Float64) can introduce rounding errors (e.g. `0.1 + 0.2 = 0.30000000000000004`), which is unacceptable for a financial/ordering system.
