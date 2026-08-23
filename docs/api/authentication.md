# Authentication API

All endpoints are prefixed with `/api/v1/auth`.

## `POST /register`
Registers a new user.
- **Body:** `{ name, email, password, phone (optional), role (optional) }`
- **Response:** `{ user: { id, email, role }, accessToken, refreshToken }`

## `POST /login`
Authenticates a user.
- **Body:** `{ email, password }`
- **Response:** `{ user: { id, email, role }, accessToken, refreshToken }`

## `POST /refresh`
Obtains a new access token.
- **Body:** `{ refreshToken }`
- **Response:** `{ user: { id, email, role }, accessToken, refreshToken }`
- **Note:** The old refresh token is revoked immediately.

## `POST /logout`
Revokes a refresh token.
- **Body:** `{ refreshToken }`
- **Response:** `{ message: 'Logged out successfully' }`

## `GET /me`
Retrieves the profile of the currently authenticated user.
- **Headers:** `Authorization: Bearer <accessToken>`
- **Response:** `{ id, email, name, role, createdAt, updatedAt }` (Password hash is omitted).
