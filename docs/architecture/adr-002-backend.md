# ADR-002: Backend Framework Selection

## Status
Accepted

## Context
The platform requires a robust backend to handle business logic, data persistence, authentication, and integration with third-party services like Firebase. It must support multiple mobile clients concurrently and be highly maintainable.

## Decision
We will use **NestJS** with the **Fastify adapter** following a **Modular Monolith approach** exposing a **REST API**.

## Why it was selected
- **Structure**: NestJS provides an opinionated, Angular-like architecture that enforces dependency injection, modularity, and consistency across the codebase.
- **Performance**: The Fastify adapter offers superior throughput and lower overhead compared to the default Express adapter.
- **TypeScript First**: Excellent developer experience with decorators, strong typing, and auto-generated OpenAPI/Swagger documentation.
- **Modular Monolith**: Easier to deploy, test, and maintain initially compared to microservices, while still allowing boundaries that facilitate extraction later if required.

## Alternatives Considered
- **Express.js (vanilla)**: Highly flexible but lacks built-in architectural constraints, which often leads to messy codebases in large projects.
- **Go / Rust**: Extreme performance, but fragments the technology stack (shifting away from TypeScript) and increases context-switching overhead.
- **Microservices**: Over-engineering for Phase 0. Introduces complex orchestration, network latency, and distributed transactions prematurely.

## Trade-offs
- NestJS introduces a learning curve and boilerplate for simpler endpoints.
- Fastify adapter can occasionally be incompatible with Express-specific middleware, requiring Fastify equivalents.
