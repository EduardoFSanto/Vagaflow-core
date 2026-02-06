# Project Instructions

## Tech Stack

- **Node.js**
- **Fastify** (API framework)
- **TypeScript**
- **Domain-Driven Design (DDD)** approach

---

## Core Concepts

### Users & Roles

- Every **Application** must be created by a **User**.
- A **User** can have roles. One important role is **Company**.
- Only users with the **Company** role can **accept or reject** an application.

> ⚠️ Rule: An **Application cannot exist without a User**. If this happens, the database logic breaks because ownership is undefined.

---

### Application

- An **Application** represents how a **candidate presents themselves** to a company for a listed job.
- It is the bridge between:
  - The **candidate (user)**
  - The **job vacancy**
  - The **company**

An application:

- Starts with status: `PENDING`
- Can be changed only by the **Company** to:
  - `ACCEPTED`
  - `REJECTED`

---

## Business Rules (Domain First)

The flow must always follow this order:

1. **Domain rules first**
   - Validate permissions (who can do what)
   - Validate required entities (User, Company, Job)
   - Enforce invariants (no application without user)

2. **Data validation**
   - Check database consistency
   - Validate IDs and relations

3. **Frontend behavior**
   - Show form only if domain allows it
   - Show success or error messages based on domain result

---

## Application Lifecycle

1. User applies to a job
2. Application is created with status `PENDING`
3. Company reviews the application
4. Company either:
   - Accepts → status `ACCEPTED`
   - Rejects → status `REJECTED`

---

## API Design Guidelines

- Controllers should be **thin**
- Business logic lives in **domain services / use cases**
- Repositories handle persistence only
- No business rules inside routes

---

## Notes

- The domain model is the source of truth
- Frontend should never bypass domain rules
- If domain changes, API and frontend must adapt — never the opposite

---

## Status

✅ Ready to start the project
