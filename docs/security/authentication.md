# Authentication and Security Architecture

## Overview
The BYTE++ Food project employs a secure, JWT-based authentication system with Role-Based Access Control (RBAC). The backend NestJS API acts as the sole authority for identity, while the mobile applications (Customer and Owner) act as authenticated clients.

## Password Hashing
- **Algorithm:** bcrypt
- **Why bcrypt?** It is a modern, computationally expensive hashing algorithm that includes built-in salting. The computational cost (rounds) defends against brute-force and dictionary attacks.
- **Handling:** Plaintext passwords are NEVER stored. They are hashed immediately upon registration. Hashes are NEVER returned in API responses.

## Token Strategy
### Access Tokens
- **Type:** JSON Web Token (JWT)
- **Lifetime:** 15 minutes
- **Storage (Mobile):** `expo-secure-store`
- **Purpose:** Sent as a Bearer token in the `Authorization` header for all protected endpoints. Contains minimal claims (`sub` for user ID, `email`, `role`).

### Refresh Tokens
- **Type:** JWT
- **Lifetime:** 7 days
- **Storage (Mobile):** `expo-secure-store`
- **Purpose:** Used to securely obtain a new access token when the old one expires, preventing the user from needing to log in repeatedly.
- **Persistence:** Stored in the `RefreshToken` database table. This allows the backend to forcibly revoke sessions (e.g., during logout or security breaches) by marking the token as `revoked`.

## Role-Based Access Control (RBAC)
The system defines roles: `CUSTOMER`, `OWNER`, and `ADMIN`.
- **Backend Enforcement:** The `RolesGuard` intercepts requests. If a route requires the `OWNER` role, and a `CUSTOMER` attempts access, the backend rejects it with a `403 Forbidden`.
- **Client Enforcement:** The mobile apps inspect the role upon login. The Owner App explicitly rejects logins from users holding only the `CUSTOMER` role.
