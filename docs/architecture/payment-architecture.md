# Payment Integration Architecture

## 1. Provider Choice
We selected **Stripe (Test Mode)** for this project iteration. 
*Reasoning*: Stripe's React Native SDK (`@stripe/stripe-react-native`) is natively bundled with Expo Go. This allows us to securely implement a full, native payment flow using a Payment Sheet without needing to eject the Expo project into a custom development build (which is required by Razorpay's React Native SDK). Stripe fully supports India, INR, and webhooks in test mode.

## 2. Payment Flow
1. Customer reviews order summary and taps "Pay Now".
2. Mobile calls `POST /orders` to lock in the immutable order with prices (if not already created).
3. Mobile calls `POST /payments/create` with `orderId`.
4. Backend retrieves the Order, checks authorization, and calculates the amount natively.
5. Backend creates a Stripe `PaymentIntent` and returns a `clientSecret`.
6. Mobile invokes `useStripe().initPaymentSheet` and `presentPaymentSheet`.
7. Customer completes payment inside Stripe's secure sandbox UI.
8. On success, Mobile calls `POST /payments/verify`.
9. Backend updates order to `CONFIRMED` and payment to `SUCCESS`.

## 3. Order/Payment Relationship
- An `Order` has exactly one `Payment` (1:1 relationship).
- An order is strictly created in a `PENDING` state. It is ONLY upgraded to `CONFIRMED` after the backend verifies the `PaymentIntent` via Stripe's REST API or receives an authenticated Webhook.

## 4. Verification
The mobile app's success callback is considered **untrusted**. The backend `verifyPayment` endpoint queries Stripe directly using `stripe.paymentIntents.retrieve()` to guarantee that the `PaymentIntent` status is genuinely `succeeded` before updating the database.

## 5. Webhook Architecture
A webhook endpoint (`POST /payments/webhook`) listens for `payment_intent.succeeded` and `payment_intent.payment_failed` events. 
- **Signature Verification**: We use `stripe.webhooks.constructEvent` with `STRIPE_WEBHOOK_SECRET` to cryptographically guarantee the payload came from Stripe.

## 6. Idempotency
- When processing successful payments, the database transaction checks if `payment.status === 'SUCCESS'`. If it is, the process halts. This guarantees that duplicate webhooks or double mobile verify calls do not result in corrupted states or multiple order status changes.

## 7. Security Implementation
- **Zero-Trust Pricing**: The API strictly forbids the client from passing a payment `amount`. The server independently reads `order.total` from the database.
- **Secret Isolation**: `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` exist solely on the Node.js backend. The mobile app only possesses `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
- **IDOR Prevention**: Both `createPayment` and `verifyPayment` verify that `req.user.id` maps directly to `order.customerProfileId`.

## 8. Failure Handling & Retries
If the customer cancels the payment sheet or the card is declined:
- The `Order` remains `PENDING`.
- The customer is redirected to the `Order Details` screen.
- A "Complete Payment" button is displayed for `PENDING` orders, allowing the customer to retry the payment without re-adding items to the cart or generating duplicate orders.
