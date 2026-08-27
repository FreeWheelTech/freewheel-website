# Interview Guide

This document tracks interview preparation topics and questions related to the technology stack utilized in the BYTE++ Food project.

## React Native
**Q: Why React Native?**
A: React Native allows sharing the vast majority of code between iOS and Android platforms, drastically reducing development time compared to native development (Swift/Kotlin) while still providing near-native performance. It also leverages our team's existing TypeScript and web development expertise.
## Expo
**Q: Why Expo?**
A: Expo simplifies the React Native development process by providing an out-of-the-box build system, over-the-air updates, robust routing (Expo Router), and a comprehensive ecosystem of tested native modules (EAS). It removes the need for managing Xcode and Android Studio directly during typical feature development.
## TypeScript
**Q: Why TypeScript?**
A: TypeScript provides static type checking, which catches errors at compile time rather than at runtime. It enhances developer experience with auto-completion, refactoring tools, and self-documenting code, which is essential for a large, production-oriented project spanning frontend and backend.

### 2. Architecture & Tooling

**Q: Why NestJS?**
A: NestJS enforces a highly structured, module-based architecture utilizing decorators and dependency injection. It makes scaling the backend API straightforward and keeps controllers, services, and modules neatly separated.

**Q: Why Fastify over Express?**
A: Fastify significantly outperforms Express by handling more requests per second with lower overhead, which is crucial for scalable APIs.

### 3. Database Foundation (Phase 2)

**Q: Why PostgreSQL?**
A: PostgreSQL provides robust ACID compliance, strong relational integrity, and advanced data types (like Decimal/Numeric), which are strictly required for reliable transactional operations in a food ordering system.

**Q: Why a Relational Database?**
A: BYTE++ Food deals with highly structured, inherently relational data. Orders map to Customers, Payments, Items, and Statuses. A normalized relational structure prevents data duplication and enforces consistency at the database level.

**Q: Why Prisma?**
A: Prisma provides a type-safe ORM that integrates seamlessly with TypeScript and NestJS. It allows for declarative schema definitions (`schema.prisma`) and handles predictable, auto-generated migrations.

**Q: How did you normalize the database?**
A: By extracting repeated data into independent entities. For example, rather than storing restaurant details inside every order, an `Order` merely holds a foreign key to `Restaurant`. User access data is isolated from customer-specific configurations (`CustomerProfile`), and Addons exist as dedicated table rows rather than comma-separated strings or loose JSON.

**Q: What is a primary key?**
A: A unique identifier for every record in a table. In our architecture, we use UUIDs (`String @id @default(uuid())`) to ensure globally unique identifiers that cannot be enumerated.

**Q: What is a foreign key?**
A: A field (or collection of fields) in one table that uniquely identifies a row of another table, enforcing referential integrity between models (e.g., `Order.restaurantId` pointing to `Restaurant.id`).

**Q: Why are indexes needed?**
A: They dramatically speed up read queries on columns that are frequently filtered or sorted by creating an auxiliary data structure.

**Q: Why not index every column?**
A: Indexes consume disk space and slow down write operations (INSERT/UPDATE/DELETE), as the index must be updated every time the table data changes. They should be targeted at common lookup paths.

**Q: Why store historical order price?**
A: The price of a `MenuItem` can change over time. If we rely solely on joining the live `MenuItem.price`, past orders would retroactively show the new price. The `historicalPrice` column on `OrderItem` locks the financial reality at the moment of purchase.

**Q: Why use transactions?**
A: Transactions allow us to group multiple database operations (e.g., creating an order, deducting stock, creating a payment record) into a single atomic unit. If any step fails, the entire transaction rolls back, preventing partial, corrupt states.

**Q: What is ACID?**
A: Atomicity, Consistency, Isolation, and Durability. The core guarantees provided by a robust relational engine like PostgreSQL, ensuring data integrity even in the face of crashes or concurrent access.

**Q: Why separate OrderItem from MenuItem?**
A: A `MenuItem` is the template describing what is being sold. An `OrderItem` represents the specific instance of that template purchased by a customer at a specific point in time, including selected quantity, historical price, and specific notes.

**Q: Why have OrderStatusHistory?**
A: It provides a chronological audit trail of exactly when an order transitioned between states (`PLACED` -> `PREPARING`), which is crucial for analytics, customer tracking, and resolving owner disputes.

**Q: How do you prevent duplicate data?**
A: By utilizing `UNIQUE` constraints (e.g. `User.email @unique`), compound unique constraints (e.g., ensuring a user is not assigned to the same restaurant staff multiple times via `@@unique([userId, restaurantId])`), and rigorous normalization.

**Q: How do you represent money?**
A: Using Prisma's `Decimal` type which translates to Postgres `NUMERIC`. Floating point numbers (Floats/Doubles) can introduce rounding errors when performing math, which is unacceptable for prices.

**Q: What happens if a menu item is deleted after an order?**
A: We implemented `ON DELETE RESTRICT` for `MenuItem` to `OrderItem` relations. The database will physically prevent the deletion of a `MenuItem` if an `Order` still depends on it to maintain referential integrity.

**Q: What happens when a menu price changes?**
A: The live `MenuItem.price` is updated, which updates the UI. However, historical `OrderItem` rows retain their `historicalPrice` values.

**Q: What is a migration?**
A: A version-controlled, executable script (often SQL) that transitions a database schema from its current state to a new state safely.

**Q: PostgreSQL vs MongoDB for this project?**
A: MongoDB is a NoSQL document store with a flexible schema, but enforcing multi-document transactional consistency across complex relational boundaries (Orders, Users, Restaurants) is cumbersome. PostgreSQL natively provides the strict constraints and relational capabilities needed for e-commerce.

### 4. Menu Seeding & Data Validation (Phase 2B)

**Q: How did you import real-world menu data?**
A: We created a deterministic `seed.ts` script that acts as the single source of truth for the database initialization. It perfectly mirrors the physical BYTE++ Café PDF menu, iterating over defined arrays of categories and items, and inserting them programmatically via Prisma.

**Q: How did you validate the data?**
A: We implemented strict unit tests using Jest that clear the database and execute the seed. The tests specifically assert that exactly 11 categories and 61 items are created, that specific prices match the physical PDF (e.g., Ice Cream Butterscotch at ₹35), and that dietary red-markers on the PDF translate accurately to database enums.

**Q: How did you prevent duplicate seed records?**
A: The script uses an idempotent strategy. Instead of blind inserts, it uses `upsert` for the restaurant and `findFirst` checks for categories and menu items. If the record exists, it updates prices and availability; if not, it creates it. Running it 100 times results in the exact same database state as running it once.

**Q: Why use database seed scripts?**
A: Seed scripts ensure that every developer, staging environment, and CI/CD pipeline starts with a predictable, baseline database state. Relying on manual SQL inserts or UI clicks to populate a menu is error-prone, untrackable in version control, and impossible to automate.

**Q: How did you handle menu price changes?**
A: The database seed allows us to update `price` values in the script. Because the seed uses an update fallback for existing items, re-running the seed safely applies price changes to the live `MenuItem` rows without duplicating them.

**Q: Why are add-ons separate entities?**
A: Modeling "With Cheese" as a `MenuItemAddon` entity linked via a foreign key allows it to have its own price (₹10) and availability toggle. If it were just a string or boolean column, adding new add-ons later (e.g. "Extra Spicy") would require altering the core database schema.

**Q: How did you preserve historical order prices?**
A: While `MenuItem` holds the live price (which can be updated by a seed or owner), `OrderItem` contains a completely separate `historicalPrice` column. At checkout, the current price is copied into the `OrderItem`, locking it in forever regardless of future menu updates.

**Q: How did you test the seed process?**
A: We wrote an automated suite in `seed.spec.ts` that completely wipes the DB, runs the `seed.ts` file via a Node sub-process, and then runs Prisma queries to assert the exact expected row counts and properties. Crucially, tests are run sequentially (`--runInBand`) to avoid race conditions.

**Q: What would you do if the source menu contained conflicting data?**
A: The policy is to STOP and report discrepancies rather than silently guessing. For example, during parsing, the physical PDF showed a blank box where the "JUICES" category was expected, and had a price of ₹35 for Butterscotch ice cream instead of a previously discussed ₹45. These were flagged, reported, and aligned perfectly with the visual truth of the PDF.

## NestJS
**Q: Why NestJS?**
A: NestJS provides an opinionated, modular architecture that enforces dependency injection and separation of concerns. This structured approach prevents codebases from becoming messy (common in vanilla Express) and scales well as the application grows. It also integrates seamlessly with TypeScript.
## Fastify
**Q: Why Fastify?**
A: Fastify is used as the HTTP adapter for NestJS because it offers significantly higher performance and throughput compared to the default Express adapter, making it ideal for a highly scalable REST API.

## REST API
**Q: What is REST?**
A: REST (Representational State Transfer) is an architectural style for designing networked applications. It relies on stateless, client-server communication and uses standard HTTP methods (GET, POST, PUT, DELETE) to manipulate resources identified by URIs.

**Q: What is an API health endpoint?**
A: A health endpoint (e.g., `/api/v1/health`) is a simple, unauthenticated route that returns a basic success response (like a 200 OK) to confirm that the backend server is running and reachable. It is commonly used by load balancers and monitoring tools.

**Q: Why use /api/v1?**
A: API versioning (`/api/v1`) is a best practice that allows us to introduce breaking changes in the future (e.g., `/api/v2`) without immediately breaking older clients that still rely on the v1 structure.

**Q: What is the difference between 404 and 500?**
A: A 404 (Not Found) status code indicates that the client requested a resource or route that does not exist. A 500 (Internal Server Error) indicates that the server encountered an unexpected condition or crash that prevented it from fulfilling a valid request.
## 5. Authentication & Security (Phase 3)

**Q: Authentication vs authorization?**
A: Authentication verifies *who* the user is (e.g., logging in with email and password). Authorization verifies *what* the authenticated user is allowed to do (e.g., checking if the user has the OWNER role to modify a menu).

**Q: Why hash passwords?**
A: Storing plaintext passwords is a critical security vulnerability. If the database is compromised, attackers gain immediate access to all accounts. Hashing mathematically transforms the password into an irreversible string.

**Q: Why not encrypt passwords?**
A: Encryption is two-way; it can be decrypted if the key is compromised. Hashing is one-way. We don't need to know the original password; we only need to verify that a new login attempt produces the exact same hash.

**Q: Why use access and refresh tokens?**
A: A short-lived access token (e.g., 15 minutes) minimizes the window of opportunity if the token is stolen. A long-lived refresh token allows the application to silently obtain new access tokens, providing a seamless user experience without sacrificing security.

**Q: Why should access tokens expire?**
A: Because JWT access tokens are stateless; the server does not typically check the database for every single request to see if the token is valid, it only checks the cryptographic signature. Expiration ensures stolen tokens become useless quickly.

**Q: Where should mobile tokens be stored?**
A: In secure, encrypted device storage (like `expo-secure-store` or iOS Keychain/Android Keystore). Never in plain `AsyncStorage` or unencrypted local storage.

**Q: How does RBAC work?**
A: Role-Based Access Control limits endpoint execution based on the user's role. Our NestJS backend uses a `RolesGuard` to check the `role` field on the user's JWT payload against the `@Roles()` decorator applied to a route.

**Q: Why can't the frontend enforce authorization?**
A: The frontend is entirely in the user's control and can be manipulated or bypassed. Hiding an "Edit Menu" button does not prevent a malicious user from sending a direct HTTP request to the API. Only the backend can enforce true authorization.

**Q: What happens when a token expires?**
A: Our Axios interceptor catches the `401 Unauthorized` response. It automatically sends the refresh token to the `/refresh` endpoint, obtains a new access token, securely stores it, and transparently retries the original failed request.

**Q: How does logout work?**
A: The mobile app deletes the tokens from secure storage, and crucially, sends a request to the backend to mark the refresh token as `revoked` in the database, preventing it from ever being used again.

**Q: How do you prevent password hashes from being exposed?**
A: By explicitly omitting the `passwordHash` field from all User objects before they are returned from the Controller endpoints (e.g., via destructuring `const { passwordHash, ...safeUser } = user`).

**Q: How did you test authentication?**
A: We wrote Jest unit tests for the `AuthService` that explicitly test password hashing, credential verification, and token payload generation, mocking the database interactions to ensure business logic correctness.

**Q: How did you test unauthorized access?**
A: We tested that a user with a `CUSTOMER` role is actively rejected by the `owner-app` login screen, and we use `@Roles` guards on the backend to reject non-matching roles with `403 Forbidden`.

**Q: What happens if the backend is unavailable?**
A: The mobile app's Axios interceptors will fail to connect and will catch the network error. We implemented `try/catch` blocks in the UI to present a meaningful alert (e.g., "Login Failed") rather than silently failing or crashing.

## 6. Menu Module & UI State (Phase 4)

**Q: Why use REST APIs?**
A: REST provides a standardized way for our mobile apps (clients) to interact with the database (server) using predictable HTTP methods and URLs, separating frontend logic from backend infrastructure.

**Q: Why separate frontend and backend?**
A: Separation of concerns allows us to build multiple frontends (Customer app, Owner app, Web dashboard) that all consume the single source of truth (the NestJS backend). It also increases security by keeping database credentials strictly on the server.

**Q: Why use TanStack Query?**
A: Managing asynchronous data fetching manually using `useEffect` and `useState` is verbose and error-prone. TanStack Query automatically handles caching, loading states, error states, and background refetching, drastically simplifying UI logic.

**Q: What is server state?**
A: State that physically lives on the backend database (like menu prices or availability). It is asynchronous and can change without the frontend knowing.

**Q: What is caching?**
A: Storing the result of an expensive operation (like fetching the entire menu) in local memory so subsequent requests for that data can be served instantly without hitting the network.

**Q: How does cache invalidation work?**
A: When an owner updates an item's availability, the mutation explicitly tells TanStack Query that the `['owner-menu']` cache is now "stale". TanStack automatically discards the old data and fetches the new data, instantly reflecting the change on the screen.

**Q: Why FlatList instead of ScrollView?**
A: A `<ScrollView>` renders every single child component immediately, which consumes massive memory for a 60+ item menu. `<FlatList>` only renders the items currently visible on the screen, recycling views as the user scrolls, resulting in smooth 60fps performance.

**Q: How does pagination work?**
A: The backend limits the number of results returned (e.g., 20 per page) and accepts `skip`/`take` parameters. The frontend requests pages iteratively as the user scrolls, minimizing database strain and network payload.

**Q: How did you prevent unauthorized owners from modifying another restaurant?**
A: We implemented IDOR protection by querying the `RestaurantStaff` join table. Even if an owner is authenticated and passes RBAC, the `verifyOwner` method explicitly checks if `userId` is mapped to `restaurantId` before allowing any mutations.

**Q: What is IDOR?**
A: Insecure Direct Object Reference. A vulnerability where a user manipulates an ID (e.g. changing `restaurantId=1` to `restaurantId=2` in the URL) to access or modify data belonging to someone else.

**Q: How does backend authorization differ from UI hiding?**
A: Hiding a button in the UI only prevents the user from clicking it, but a malicious user can intercept the network traffic and forge the HTTP request. Backend authorization explicitly checks credentials against business rules before executing any database write.

**Q: How do you handle API errors?**
A: We use `try/catch` on the backend to translate database exceptions into standardized HTTP error codes (400, 404, 403). On the frontend, TanStack Query catches these and sets the `isError` state, which we use to render a "Retry" UI instead of crashing the app.

**Q: How do you handle loading and empty states?**
A: We monitor the `isLoading` and `data` properties from TanStack Query. If loading, we display a spinner (`ActivityIndicator`). If `data.length === 0`, we render a `ListEmptyComponent` within our `FlatList`.

**Q: How do you prevent unnecessary API requests?**
A: By setting an appropriate `staleTime` in TanStack Query (e.g., 60 seconds). Switching rapidly between menu categories serves the data from cache rather than spamming the backend.

**Q: Where is the source of truth for menu prices?**
A: The PostgreSQL database. We never calculate totals or define authoritative prices purely in JavaScript on the mobile app, as this can be easily exploited by malicious clients.

## 7. Production Cart System (Phase 6)

1. **Why is the backend the source of truth for prices?**
   Because the frontend operates in an untrusted client environment (the user's device). A malicious user could intercept the API request and send a payload like `{"price": 0.01}`. The backend must always query the database for the authoritative price.

2. **How do you prevent price manipulation?**
   The `CartController` DTO (`AddCartItemDto`) intentionally does NOT accept a `price` or `lineTotal` field. The `CartService` independently fetches the `MenuItem` and `MenuItemAddon` prices from PostgreSQL.

3. **How does the cart work?**
   The cart uses a relational database model. A `CustomerProfile` has one `Cart`. The `Cart` has many `CartItem`s. Each `CartItem` links to a `MenuItem` and optionally multiple `CartItemAddon`s. The NestJS API calculates and formats this data into a structured JSON response for the mobile app.

4. **How do you model add-ons?**
   Add-ons are modeled using a many-to-many join table (`CartItemAddon`) between `CartItem` and `MenuItemAddon`. This allows a single cart item to have multiple specific add-ons attached to it cleanly.

5. **How do you prevent duplicate cart selections?**
   When adding an item, the backend checks existing cart items for the same `menuItemId`. If found, it sorts and compares the arrays of selected `addonIds`. If the arrays match perfectly, it increments the `quantity` of the existing `CartItem` instead of creating a new row.

6. **What is IDOR?**
   Insecure Direct Object Reference. It occurs when an application provides direct access to objects based on user-supplied input (like an ID in the URL) without properly verifying authorization.

7. **How did you prevent one customer accessing another customer's cart?**
   The cart endpoints (`GET /cart`, `POST /cart/items`) do not accept a `customerId` in the request body or URL. They extract the `userId` directly from the validated JWT token provided by the `JwtAuthGuard`. It is impossible for a user to request another user's cart because the API ignores client-supplied IDs.

8. **Why use TanStack Query?**
   It eliminates the boilerplate of `useEffect` and `useState` for API calls, automatically handles loading/error/success states, caches data, and manages background refetching (like updating the cart badge automatically when the cart mutates).

9. **How do you synchronize server state?**
   By calling `refetch()` or using TanStack Query's `invalidateQueries(['cart'])` after a successful mutation (like adding or removing an item). This triggers a fresh fetch from the backend, keeping the UI perfectly in sync.

10. **How do you handle unavailable menu items?**
    The NestJS backend checks `menuItem.availability` before adding. If false, it throws a `BadRequestException`. The frontend catches this and displays a friendly error message using React Native `Alert`.

11. **How do you handle concurrent updates?**
    By using Prisma's atomic updates (e.g., incrementing quantities) and database-level constraints. Critical operations (like creating an item and its add-ons) are wrapped in a `$transaction` to ensure atomicity.

12. **Where are database transactions necessary?**
    When creating a new cart item that has add-ons. We must insert the `CartItem` and multiple `CartItemAddon` rows together. If the add-on insert fails, the cart item insert must roll back to prevent orphaned data.

13. **Why can a cart contain only one restaurant?**
    To simplify the checkout and order routing logic. A single order goes to a single restaurant kitchen. If a cart had mixed items, we would have to split payments, split delivery logic, and split order status tracking. We enforce this by storing `restaurantId` on the `Cart` table.

14. **How do you handle API errors?**
    The backend throws standard HTTP exceptions (`404 NotFound`, `409 Conflict`). The mobile app's Axios instance and TanStack Query catch these, and we present a user-friendly message rather than a raw JSON error or stack trace.

15. **What happens when the customer's token expires?**
    Our Axios interceptor detects the `401 Unauthorized` response, automatically pauses the failed request, securely uses the `refreshToken` to get a new `accessToken` from the backend, updates local storage, and seamlessly retries the original request without bothering the user.

## 8. Checkout and Order Creation (Phase 7)

1. **What is the difference between a cart and an order?**
   A cart is a mutable, temporary collection of items a customer intends to purchase, reflecting live menu prices. An order is an immutable, permanent record of a completed transaction that preserves the exact state and prices at the moment of checkout.

2. **Why do orders need price snapshots?**
   Because menu prices change over time. If a customer buys a Chicken Roll for ₹89 today, and the restaurant changes the price to ₹99 tomorrow, the historical receipt must still show ₹89. Snapshots guarantee financial accuracy.

3. **Why shouldn't the client submit the order total?**
   The client environment is untrusted. A malicious user could submit a fake total (e.g., ₹0.01). The backend must recalculate everything from the trusted database source during checkout.

4. **Why use a database transaction?**
   Checkout involves creating an `Order`, multiple `OrderItem`s, multiple `OrderItemAddon`s, and deleting the `CartItem`s. If any step fails (e.g., database constraint error), the entire transaction rolls back, preventing orphaned records or a deleted cart without a completed order.

5. **What happens if order creation fails halfway?**
   The transaction rolls back. The customer's cart remains completely intact, and no partial order is saved to the database.

6. **How do you prevent duplicate orders?**
   Our current idempotency strategy relies on the atomic transaction. When an order is placed, the cart is cleared in the same transaction. If the frontend double-submits, the second request will find an empty cart and instantly fail with a `400 Bad Request`.

7. **What is idempotency?**
   The property of an operation that can be applied multiple times without changing the result beyond the initial application. In checkout, it ensures a user isn't charged twice for accidental double-clicks.

8. **How do you prevent customers accessing other orders?**
   The `GET /orders` and `GET /orders/:id` endpoints extract the customer's identity solely from the JWT token (`req.user.id`). They append this ID to the database queries, strictly isolating data access.

9. **How do you enforce restaurant-level authorization?**
   In `GET /owner/orders`, the system looks up the `RestaurantStaff` assignment for the authenticated owner's `userId`. It then filters orders by that exact `restaurantId`, ensuring Owner A can never see Restaurant B's incoming orders.

10. **How does the order state machine work?**
    Orders begin in the `PENDING` state. We use an enum (`OrderStatus`) and an `OrderStatusHistory` table to track every transition (e.g., PENDING -> CONFIRMED -> PREPARING -> READY). This strict enum prevents invalid states.

11. **Why is historical order data immutable?**
    For auditing, analytics, and customer trust. Modifying past orders breaks accounting records and user expectations.

12. **What happens if a menu item is deleted after an order?**
    Because we use `nameSnapshot` and `priceSnapshot`, the order still displays the correct item name and price. The foreign key `menuItemId` uses `onDelete: Restrict` or similar safeguards to prevent breaking the reference, or we use soft-deletes (`availability = false`) instead of hard deletes.

13. **How does the backend recalculate prices?**
    It iterates through every cart item, fetches the active `MenuItem` and `MenuItemAddon` prices from the database, sums them up, and multiplies by quantity to arrive at the final `subtotal` and `lineTotal`.

14. **How did you test order security?**
    We wrote backend unit tests simulating a client submitting fake totals (our test confirms the server ignores them and calculates 198 instead of a fake value). We also enforce IDOR protection via the JWT guard.

15. **How does the cart become an order?**
    The backend reads the Cart, validates availability, calculates totals, opens a Prisma transaction, creates the Order schema structures with snapshots, deletes the Cart items, and finally commits the transaction.

## 9. Payment Integration (Phase 8)

1. **Why shouldn't payment secrets be in a mobile app?**
   Mobile binaries can be decompiled. If a `STRIPE_SECRET_KEY` is embedded in the React Native code, malicious actors can extract it and issue unauthorized API calls (e.g., initiating massive refunds).

2. **Why can't the client determine the payment amount?**
   The client environment is untrusted. A malicious user could intercept the network request and change `amount: 50000` to `amount: 100`. The backend must independently calculate the total from trusted database snapshots.

3. **How do you verify payment?**
   We do not trust the mobile app's success callback. The mobile app calls a backend `verify` endpoint, which securely queries the Stripe API (`paymentIntents.retrieve`). Only if Stripe's backend confirms `status === 'succeeded'` do we update the database.

4. **What is a webhook?**
   An HTTP callback. Stripe sends a POST request to our backend asynchronously when a payment succeeds or fails, ensuring we get the status even if the mobile app loses connectivity immediately after paying.

5. **How do you verify webhook authenticity?**
   Stripe signs the webhook payload using a secret (`STRIPE_WEBHOOK_SECRET`). We use the raw, unparsed request body and the `stripe-signature` header to cryptographically verify the payload wasn't forged by an attacker.

6. **What is idempotency?**
   The property that an operation can be applied multiple times without altering the result beyond the first application.

7. **How do you handle duplicate webhooks?**
   Our webhook handler wraps the database update in a transaction. It first checks if `Payment.status === 'SUCCESS'`. If it is, it ignores the webhook, ensuring we don't accidentally update the order multiple times.

8. **What happens if payment succeeds but the app loses internet connectivity?**
   The mobile app won't be able to call the `verify` endpoint. However, Stripe's backend will automatically send a webhook to our server, which will successfully upgrade the order to `CONFIRMED`. When the user opens the app later, the order will reflect the paid status.

9. **How do you handle payment retries?**
   If a payment fails or is cancelled, the `Order` remains in a `PENDING` state. We render a "Complete Payment" button on the Order Details screen, which initializes a new payment attempt for the exact same order without duplicating the cart.

10. **How do you prevent payment amount manipulation?**
    The `POST /payments/create` endpoint takes an `orderId` but NO amount parameter. It looks up the `Order` in the database and explicitly uses `order.total`.

11. **What is the difference between order status and payment status?**
    `PaymentStatus` tracks the financial transaction (CREATED, AUTHORIZED, SUCCESS, FAILED). `OrderStatus` tracks the fulfillment lifecycle (PENDING, CONFIRMED, PREPARING, READY). An order is only `CONFIRMED` when its payment reaches `SUCCESS`.

12. **Why should payment verification happen on the backend?**
    Because the frontend can be manipulated. If verification happened on the frontend, an attacker could fake a "payment succeeded" signal to the backend. The backend must communicate directly with Stripe to verify.

13. **How do you handle payment provider downtime?**
    If Stripe goes down, the `createPayment` intent fails gracefully. The order remains `PENDING`, the user sees a "Payment Error", and they can safely retry later using the "Complete Payment" button on the order details screen without losing their cart.

## 10. Owner Order Management & Workflows (Phase 9)

1. **How does owner authorization work?**
   Through Role-Based Access Control (RBAC). The NestJS `@Roles('OWNER', 'ADMIN')` guard explicitly denies endpoints to customers. We then extract the authenticated `userId` from the JWT.

2. **How do you ensure owners only see their restaurant's orders?**
   We enforce Insecure Direct Object Reference (IDOR) protection. The backend queries the `RestaurantStaff` mapping table with the authenticated `userId` to find the authorized `restaurantId`. It then applies a `where: { restaurantId: staff.restaurantId }` filter on all order queries.

3. **What is RBAC?**
   Role-Based Access Control. It restricts system access based on the roles assigned to users within an organization. For example, `OWNER` can modify orders, but `CUSTOMER` cannot.

4. **What is IDOR?**
   Insecure Direct Object Reference. A vulnerability where a user can access or modify data belonging to others by simply changing an identifier (like `orderId`). We prevent this by verifying the `restaurantId` matches the owner's authorization context.

5. **How does the order state machine work?**
   The backend defines an explicit, strict mapping of valid status transitions (e.g., `CONFIRMED` can only transition to `PREPARING` or `CANCELLED`). If an invalid transition is requested (like `COMPLETED` -> `PREPARING`), the API throws a `400 BadRequestException`.

6. **Why does the backend enforce status transitions?**
   Frontend UI buttons can be hidden, but a malicious client could still send an HTTP request with `{"status": "PREPARING"}` for a completed order. The backend must enforce the business rules as the final source of truth.

7. **How do you handle concurrent status updates?**
   We use Prisma's `$transaction` to ensure atomic updates. The transaction fetches the current status, validates the transition, updates the order, and creates an `OrderStatusHistory` record. If two devices attempt conflicting updates simultaneously, the database lock ensures only one succeeds.

8. **How do you prevent an owner from marking an unpaid order as paid?**
   The payment status (`SUCCESS`, `PENDING`) is derived strictly from the backend's Stripe verification system. The owner UI does not have an endpoint or button to manually manipulate the `PaymentStatus`.

9. **Why use immutable order snapshots?**
   If an owner updates a menu item price today, we must not retroactively alter the total of an order placed yesterday. `Order` and `OrderItem` store `historicalPrice` and `nameSnapshot` to preserve the financial reality at checkout.

10. **How do you handle large order lists?**
    By utilizing `FlatList` in React Native for memory-efficient viewport rendering, and (in production) implementing cursor-based or offset-based pagination in the backend to limit query payload size.

11. **Why use pagination?**
    Fetching thousands of completed orders into mobile memory will crash the app and overload the database. Pagination breaks the data into manageable chunks.

12. **Why did you choose polling/React Query/WebSockets?**
    We chose React Query polling (`refetchInterval: 10000`) because it is the simplest, most reliable approach already supported by our architecture. It requires no new infrastructure (like WebSocket servers or Redis pub/sub) while providing near real-time updates for the MVP.

13. **How would you implement real-time notifications later?**
    By integrating Expo Push Notifications or Firebase Cloud Messaging. The backend would fire a push notification payload immediately after a successful order `$transaction`.

14. **Why is audit history useful?**
    The `OrderStatusHistory` table records `previousStatus`, `newStatus`, `changedById`, and `timestamp`. It resolves disputes (e.g., "When was the order marked ready?") and provides data for analytics (e.g., "How long does food preparation take on average?").

15. **How would you scale this system to many restaurants?**
    The multi-tenant architecture is already in place via `restaurantId` foreign keys. To scale, we would implement database indexing on `restaurantId`, use read-replicas, and introduce caching (Redis) for frequently accessed, read-heavy data.

## 11. Notifications & Real-Time Updates (Phase 10)

1. **How do customer and owner apps receive order updates?**
   Both applications utilize TanStack Query's polling mechanism (`refetchInterval`). The customer app polls the specific order endpoint, while the owner app polls the dashboard endpoint.

2. **Why did you choose polling/WebSockets/SSE?**
   We chose polling (specifically TanStack Query background refetching) because it is the simplest reliable mechanism. It seamlessly handles offline-to-online recovery, doesn't require maintaining a stateful WebSocket server, and uses our existing REST architecture.

3. **What are the advantages and disadvantages?**
   Advantages: Zero infrastructure changes, automatic offline recovery, idempotent, heavily cached by TanStack. Disadvantages: Higher latency (e.g. up to 10 seconds), and slightly more server load than an idle WebSocket connection.

4. **How do you prevent duplicate notifications?**
   We embed notification creation deep within the state-machine transaction. Since the state machine strictly rejects identical sequential updates (e.g., `READY` -> `READY` throws), the notification record is never mistakenly duplicated.

5. **How do you handle offline clients?**
   TanStack Query continues returning the cached data while offline. Upon detecting network reconnection (or window refocus), it automatically triggers a background refetch, instantly syncing the client with the server's definitive state without requiring complex retry logic.

6. **What happens when a real-time connection drops?**
   Because we use stateless HTTP polling rather than WebSockets, there is no persistent "connection" to drop. The client merely fails the current fetch request, logs the error, and automatically retries on the next interval.

7. **How do you secure notifications?**
   By relying exclusively on `req.user.id` from the JWT. The `GET /notifications` endpoint strictly filters `where: { userId: req.user.id }`. The client never supplies the target ID in the request body.

8. **How do you prevent cross-restaurant notifications?**
   When a new order payment succeeds, the backend queries the `RestaurantStaff` mapping table by `order.restaurantId`. It strictly generates notifications only for the `userId`s returned by that query, effectively applying IDOR protection natively.

9. **Why should notification creation happen after a valid status transition?**
   If a notification is sent *before* or outside the transaction of the status update, an error in the transition (like a database constraint violation) would result in a "ghost notification" informing the user of an event that actually rolled back.

10. **What is an event-driven architecture?**
    An architecture where state changes (events) are broadcasted to decouple services. For example, an Order Service emitting an `OrderConfirmed` event, which a totally separate Notification Service consumes.

11. **What is the outbox pattern?**
    A pattern to ensure guaranteed event delivery. Instead of calling an external notification API directly during a transaction, you insert an `Event` record into an `Outbox` table *within* the same transaction. A background worker reliably reads the outbox and dispatches the events.

12. **When would you use a message queue?**
    When systems need asynchronous processing, decoupling, or load buffering. For instance, sending millions of push notifications would crash the main API server. We'd drop the jobs into RabbitMQ/SQS for background workers to process at a controlled rate.

13. **How would you scale notifications to millions of users?**
    By transitioning from polling to Push Notifications (FCM/APNs) to drastically reduce backend load. We would also implement the Outbox Pattern with a message broker (Kafka/RabbitMQ) and a dedicated Notification Microservice.

14. **How would push notifications work in production?**
    The mobile app generates a device-specific push token and sends it to our backend. The backend stores it securely (e.g., in a `UserDevice` table). When an event occurs, the backend sends a payload to a provider like Firebase (FCM) or Expo Push Services, which physically wakes the target device and displays the alert.

## Redis
[To be populated in later phases]

## Data Engineering
[To be populated in later phases]

### Phase 11: Search, Discovery & Filtering

1. **Why is downloading the entire database to the client and filtering locally a bad idea?**
   It doesn't scale. As the restaurant menu grows, it wastes bandwidth, slows down the app, crashes low-memory devices, and exposes data that a user might not be authorized to download.
2. **What is pagination and why is it mandatory?**
   Pagination breaks large datasets into smaller chunks (pages). It is mandatory to prevent unbounded database queries that consume excessive memory and network resources.
3. **What is Offset-based pagination?**
   It uses `LIMIT` and `OFFSET` (or `skip` and `take`). The database skips the first N rows and returns the next chunk.
4. **Why is Offset pagination problematic for real-time feeds?**
   If an item is inserted or deleted while a user is paginating, the offsets shift, causing the user to either see duplicate items or miss items entirely on the next page.
5. **What is Cursor-based pagination?**
   It uses a unique pointer (like an ID or timestamp) from the last item seen, and asks the database for items *after* that cursor.
6. **Why is Cursor-based pagination preferred here?**
   It handles data shifts perfectly. No matter how many items are added before the cursor, the next page strictly continues from the last known item.
7. **How does `take: limit + 1` help in cursor pagination?**
   We fetch one extra item beyond what the client asked for. If we find it, we know there's a next page and use its ID as the `nextCursor`. We then pop it off and return the requested limit.
8. **Why do we need B-tree indexes for searching?**
   Sequential scans across millions of rows are slow. B-tree indexes create an ordered data structure that makes exact matches and range queries extremely fast.
9. **How does PostgreSQL handle `ilike` queries with standard B-tree indexes?**
   Standard B-tree indexes cannot optimize leading wildcard searches (e.g., `ilike '%chicken%'`). For true full-text search, a GIN index with `pg_trgm` or `tsvector` is required.
10. **Why must the backend validate search parameters?**
    To prevent malicious payloads, such as negative prices, massive limit sizes (causing DoS), or arbitrary string injections into order-by clauses.
11. **What is debouncing in the frontend?**
    Delaying the execution of a function (like a search API call) until a certain amount of time (e.g., 500ms) has passed since the last event (keystroke).
12. **Why is debouncing critical for search inputs?**
    It prevents spamming the backend with a network request for every single letter typed, saving server resources and ensuring UI fluidity.
13. **How does `useInfiniteQuery` in TanStack Query work?**
    It manages the state for infinite scrolling feeds, automatically keeping track of `pageParams` and concatenating pages of data into a unified array.
14. **Why not invent dummy restaurant data for the search tests?**
    Tests should verify the actual system mechanics against the structured schema. Inventing data often leads to tests that pass locally but fail against real constraints.
15. **What is IDOR and how does it relate to search?**
    Insecure Direct Object Reference. If a user can search and find an internal draft menu item ID, they shouldn't be able to fetch it unless `availability=true` or they own the restaurant.
16. **Why should we enforce a maximum `limit` size on the backend?**
    If the API accepts any limit, a malicious actor could send `limit=1000000` to intentionally crash the database or exhaust application memory.
17. **How do you handle sorting securely in an API?**
    Never map query strings directly to database columns. Instead, validate the input against a strict allowlist (e.g., `@IsIn(['price_asc'])`) and map it manually to a Prisma `orderBy` instruction.
