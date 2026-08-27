# MANDATORY TESTING POLICY

Testing is a FIRST-CLASS requirement of this project.

NO FEATURE, MODULE, API, DATABASE CHANGE, OR MOBILE
SCREEN IS CONSIDERED COMPLETE UNTIL IT HAS BEEN TESTED.

For EVERY implementation task, you MUST:

1. Understand the expected behavior.
2. Identify possible failure conditions.
3. Create appropriate test cases.
4. Implement the feature.
5. Run the tests.
6. Fix all failures.
7. Run regression tests.
8. Run type checking.
9. Run linting.
10. Run the production build/check where applicable.
11. Report the final results.

## TEST CASE CATEGORIES

For every feature, consider:

**A. HAPPY PATH**
- Valid input
- Expected successful behavior

**B. INVALID INPUT**
- Missing required fields
- Incorrect data types
- Invalid values
- Malformed requests

**C. EDGE CASES**
- Empty values
- Zero values
- Very large values
- Boundary values
- Duplicate requests
- Concurrent operations where relevant

**D. AUTHENTICATION**
- Unauthenticated request
- Expired authentication
- Invalid credentials
- Invalid/expired tokens

**E. AUTHORIZATION**
- Customer accessing owner functionality
- Owner accessing admin functionality
- User accessing another user's resources
- Unauthorized modification attempts

**F. DATABASE**
- Missing records
- Duplicate records
- Foreign-key violations
- Transaction rollback
- Concurrent updates
- Constraint violations

**G. API**
- Correct HTTP status codes
- Correct response structure
- Correct error responses
- Validation errors
- Server errors

**H. SECURITY**
- Never expose passwords
- Never expose secrets
- Never trust client-provided prices
- Never trust client-provided user roles
- Validate all user input
- Verify resource ownership

**I. MOBILE UI**
- Loading state
- Empty state
- Error state
- Network failure
- Retry behavior
- Offline/poor network behavior where applicable
- Navigation failure
- Invalid form submission

## TESTING PRINCIPLE

Tests must verify REQUIREMENTS and EXPECTED BEHAVIOR,
not merely reproduce the implementation.

Do not write weak tests that only verify that a
function exists or that code executes without throwing.

Prefer meaningful assertions.

## DATABASE TRANSACTION TESTING

Whenever a database transaction is used, test:

1. Successful transaction
2. Failure in the middle of transaction
3. Rollback behavior
4. Data consistency after rollback
5. Duplicate/concurrent operations where relevant

Example:

If order creation performs:

Create Order
Create Order Items
Create Payment
Create Status History

and payment creation fails:

The test MUST verify that the order and order items
are not incorrectly left in the database.

## ORDER TESTING

For the food ordering system, specifically test:

- Empty cart
- Valid cart
- Unavailable item
- Deleted item
- Changed item price
- Invalid quantity
- Add-on validation
- Invalid coupon
- Successful order
- Payment failure
- Transaction rollback
- Duplicate order request
- Unauthorized order access
- Customer viewing another customer's order
- Valid status transition
- Invalid status transition
- Cancelled order
- Rejected order
- Concurrent order attempts

The backend MUST calculate the final price from trusted
database values.

Never trust a price or total sent by the mobile app.

## AUTHENTICATION TESTING

Test:

- Valid registration
- Duplicate email/phone
- Invalid password
- Correct login
- Incorrect login
- Password hashing
- Access token
- Refresh token
- Expired token
- Invalid token
- Logout
- Protected endpoint without authentication
- Customer role
- Owner role
- Admin role

## OWNER APP TESTING

Test:

- Owner login
- Dashboard loading
- New order visibility
- Accept order
- Reject order
- Start preparation
- Mark ready
- Complete order
- Invalid status transition
- Menu creation
- Menu editing
- Menu deletion
- Availability toggle
- Price update
- Unauthorized customer access

## CUSTOMER APP TESTING

Test:

- Registration
- Login
- Restaurant loading
- Category loading
- Menu loading
- Search
- Food details
- Add item
- Remove item
- Change quantity
- Add-on selection
- Cart total
- Checkout
- Order placement
- Order status
- Order history
- Reorder
- Network error
- Empty state
- Loading state

## ANALYTICS TESTING

Verify:

- Daily order count
- Daily revenue
- Weekly revenue
- Monthly revenue
- Average order value
- Top-selling products
- Top categories
- Peak ordering hours
- Cancellation rate
- Repeat customers

Analytics tests must use controlled test data and
verify known expected results.

## REGRESSION TESTING

Whenever a feature changes existing behavior:

1. Run the feature's tests.
2. Run related module tests.
3. Run the complete test suite where practical.
4. Check for regressions.

Never modify an existing feature and assume it still works.

## QUALITY GATES

A phase CANNOT be marked COMPLETE if:

- Tests fail
- TypeScript errors exist
- Lint errors exist
- Build fails
- Critical warnings are ignored
- Security tests fail
- Required edge cases are untested

If a test fails:

DO NOT hide, skip, delete, weaken, or disable the test
just to make the test suite pass.

Investigate and fix the underlying problem.

Do not use:
- .skip
- .only
- disabled tests
- fake assertions
- meaningless snapshots

unless there is a documented temporary reason.

## TEST REPORT

At the end of EVERY phase, report:

Test framework:
Tests written:
Tests executed:
Passed:
Failed:
Skipped:
Coverage if available:
Type check:
Lint:
Build:
Security checks:
Known limitations:

Do not claim "all tests passed" unless the tests were
actually executed and passed.
