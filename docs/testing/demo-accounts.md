# Demo Accounts

The following accounts are automatically seeded into the database when running `npx prisma db seed`.
They are explicitly meant for **DEVELOPMENT ONLY** and should never be used in a production environment.

## Customer

Use this account to browse restaurants, add items to your cart, checkout, and view orders.

- **Email:** `customer@example.com`
- **Password:** `Password123!`
- **Role:** `CUSTOMER`

## Restaurant Owner

Use this account to test the Owner App flow, including accepting new orders, managing the restaurant dashboard, and updating preparation states.

- **Email:** `owner@example.com`
- **Password:** `Password123!`
- **Role:** `OWNER`
- **Assigned Restaurant:** `BYTE Burger`
