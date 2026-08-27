# BYTE++ FOOD

A modern, production-ready Zomato-style food ordering platform. 
BYTE++ Food consists of a backend REST API and two separate mobile applications (Customer and Owner) built with Expo React Native.

## Project Architecture

The system uses a mono-repo style structure containing 3 independent but highly integrated projects:

1. **Backend API (`backend/api`)**
   - **Tech Stack:** NestJS, Fastify, Prisma, PostgreSQL
   - **Description:** Provides all core APIs, authentication, payments, and database connectivity.
2. **Customer App (`frontend/customer-app`)**
   - **Tech Stack:** React Native, Expo, TanStack Query
   - **Description:** Zomato-style frontend for customers to browse restaurants, add items to cart, and checkout.
3. **Owner App (`frontend/owner-app`)**
   - **Tech Stack:** React Native, Expo, TanStack Query
   - **Description:** Restaurant owner dashboard to accept incoming orders and mark preparation statuses.

## Local Development Setup

To run the full suite locally, follow these steps:

### 1. Database Setup
Ensure you have PostgreSQL running or a valid `DATABASE_URL` in `backend/api/.env`.
```bash
cd backend/api
npx prisma generate
npx prisma db push
npx prisma db seed
```
*(The seed script automatically provisions `customer@example.com` and `owner@example.com` accounts, along with 5 demo restaurants).*

### 2. Start the Backend API
```bash
cd backend/api
npm install
npm run start:dev
```

### 3. Start the Customer App
```bash
cd frontend/customer-app
npm install
npx expo start
```
*(Press `a` in the terminal to open the Android Emulator).*

### 4. Start the Owner App
```bash
cd frontend/owner-app
npm install
npx expo start
```
*(Press `a` in the terminal to open the Android Emulator).*

## Networking Note (Android Emulator)
If you are running the frontend on the Android Emulator and the backend on your Mac, the frontend is pre-configured to point to `http://10.0.2.2:3000`. This allows the emulator to correctly route to your host machine's `localhost`.

See `docs/architecture/local-mobile-networking.md` for more details.

## Testing
Run unit tests across the suite:
```bash
# Backend
cd backend/api && npm run test

# Frontend
cd frontend/customer-app && npm run test
```
