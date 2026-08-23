# Notification Architecture

## Overview
Phase 10 connects the Customer and Owner applications using real-time order status updates and in-app notifications. The solution prioritizes reliability, offline resilience, and architectural simplicity.

## Real-Time Strategy: Polling via TanStack Query
We evaluated WebSockets, Server-Sent Events (SSE), and Push Notifications. We selected **Polling (TanStack Query `refetchInterval`)** for the MVP architecture.

### Why Polling?
1. **Simplicity**: Polling utilizes the existing standard REST endpoints (e.g. `GET /notifications`). It requires no new backend infrastructure, no Redis Pub/Sub adapter, and no WebSocket gateway configurations.
2. **Offline Resilience**: Mobile apps frequently drop connections (entering elevators, switching from Wi-Fi to 4G). WebSockets require complex reconnection logic and missed-message syncing. TanStack Query automatically refetches data immediately upon regaining network focus, intrinsically handling state recovery.
3. **Idempotency**: Fetching the state every 10 seconds guarantees the client eventually reaches consistency, bypassing issues with duplicated or missed transient push events.

## Database & Transaction Consistency
Notifications are explicitly tied to the `OrderStatus` and `PaymentStatus` state machines.

### The Problem
If a status update succeeds but the notification record fails to insert, the user is left in the dark.

### The Solution: Transactional Atomicity
We embed the `Notification.create()` call directly inside the Prisma `$transaction` that handles the state transition. 
- In `OrdersService.updateOrderStatus()`, the `orderStatusHistory` and `notification` are created atomically with the `order.update()`.
- In `PaymentsService.handlePaymentSuccess()`, if the payment successfully validates via Stripe webhook, a `NEW_ORDER` notification is dispatched to all `RestaurantStaff` inside the payment success transaction.

## Recipient Authorization (IDOR Protection)
- **Customers**: Can only query notifications where `userId === req.user.id`. The API inherently strips cross-customer leakage.
- **Owners**: The webhook handler queries the `RestaurantStaff` mapping table by `restaurantId` to securely dynamically target notifications only to authorized staff.

## Duplicate Prevention
- Notifications are only fired upon a *successful* status transition. Because the state machine strictly rejects identical updates (e.g., `COMPLETED` -> `COMPLETED` throws an error), duplicate notification records cannot be created even if the client double-clicks an action.
- Webhook duplicates are caught by the idempotent check `if (currentPayment.status === 'SUCCESS') return;`.

## Scalability Considerations
While polling works effectively at current scale, a production application scaling to millions of users would transition to:
1. **Push Notifications (Expo EAS / Firebase)**: Moving the polling overhead off the server.
2. **Outbox Pattern**: Instead of inserting `Notification` rows and blocking the main API response, the transaction would write to an `EventOutbox` table. A background worker (or Debezium CDC) would read the outbox and dispatch notifications asynchronously via Kafka/RabbitMQ.
