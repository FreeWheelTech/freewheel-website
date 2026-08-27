# System Architecture

## Overview
BYTE++ Food is composed of independent client applications and a backend REST API. The ecosystem is designed to be highly scalable, providing real-time interactions for customers and restaurant owners.

## Components

### 1. Two Mobile Applications
- **Customer App**: For browsing the menu, adding items to the cart, placing orders, and tracking status.
- **Owner App**: For managing the menu, tracking incoming orders, updating order status, and viewing daily performance.

### 2. Separate Backend
- The applications communicate with a centralized backend via REST API.
- The backend handles all business logic, role-based authorization, and final price calculations.
- It operates as a modular monolith using NestJS.

*(Note: As of Phase 1, the Customer App, Owner App, and Backend API have been scaffolded as independent, runnable projects with baseline configurations and testing architectures.)*

### 3. PostgreSQL
- Primary relational database storing users, menus, orders, and transactional data.
- Relational integrity ensures consistent state across orders and payments.

### 4. Redis
- Used for caching frequently accessed data (like menus or available items).
- Also functions as a message broker or queue for background jobs, if required.

### 5. Firebase Notifications
- Provides reliable push notifications to mobile devices.
- Handles events like "Order Accepted", "Order Ready", and promotional announcements.

### 6. SQL/Python Analytics
- A separate data engineering pipeline that runs SQL queries and Python (Pandas) scripts.
- Analyzes daily revenue, top-selling products, and peak ordering hours.
- Operates independently from the core operational transactional flow.
