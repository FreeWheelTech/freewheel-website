# ADR-003: Database Selection

## Status
Accepted

## Context
BYTE++ Food deals with highly structured, relational data involving users (customers, owners), menus, complex orders, transactions, and status histories. Consistency, ACID compliance, and robust querying capabilities are strictly required.

## Decision
We will use **PostgreSQL** as our primary database engine, modeled relationally.

## Why it was selected
- **Relational Data Model**: Perfectly suits our domain model (Orders linked to Customers, Payments, Items, and Statuses).
- **ACID Compliance**: Crucial for financial and transactional guarantees (e.g., deducting stock, recording payments).
- **Rich Feature Set**: Offers advanced indexing, JSONB support for unstructured edge cases, and robust analytical capabilities.
- **Ecosystem**: Highly compatible with Prisma ORM, which we are utilizing on the backend.

## Alternatives Considered
- **MongoDB / NoSQL**: Flexible schemas are appealing, but enforcing relations and multi-document transactions for complex orders is error-prone and requires complex application-level logic.
- **MySQL**: A strong alternative, but PostgreSQL's stricter adherence to standard SQL, advanced data types (JSONB/Arrays), and community momentum in the TypeScript ecosystem give it an edge.

## Trade-offs
- Scaling writes across multiple nodes is more complex than in distributed NoSQL stores, though vertical scaling and read replicas will easily cover our foreseeable load.
- Stricter migrations require careful management using Prisma compared to schemaless databases.
