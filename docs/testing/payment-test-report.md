# Payment Test Report

## 1. Unit & Security Tests (Backend)
- **Amount Manipulation Prevention (`createPayment`)**: Passed. Mocked the client requesting a payment, verified that the `stripe.paymentIntents.create` call strictly used the `50000` paise value derived securely from the mocked database `Order.total`.
- **IDOR / Unauthorized Access**: Passed. Intercepted a request where user A attempts to pay for user B's order. Backend threw a `BadRequestException` immediately.
- **Webhook Signature Verification**: Passed. Simulating a webhook event with an invalid signature string threw an expected `BadRequestException`.
- **Idempotency Strategy**: Passed. Simulating duplicate webhooks sequentially resulted in only one database update transaction. The second call recognized `status === 'SUCCESS'` and terminated gracefully without altering the DB.
- **Duplicate Payment Prevention**: Passed. Verified that calling `createPayment` on an already paid order results in a `BadRequestException`.

## 2. Integration Tests (Mobile UI)
- **Stripe Provider Initialization**: Passed. Native Expo Go `StripeProvider` successfully wraps the component tree.
- **Checkout Display**: Passed. The UI accurately calculates and displays the totals natively before initialization.
- **Payment Sheet Sequence**: Passed. The mock tests verified the sequence of `initPaymentSheet` followed immediately by `presentPaymentSheet`.
- **Completion States**: Passed. 
  - On cancellation, user receives an alert and is redirected to order details with a retry mechanism.
  - On success, user is redirected to a confirmation page with `SUCCESS` state rendered prominently.
