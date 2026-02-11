# VagaFlow Core

> Professional job application platform API built with Domain-Driven Design (DDD) and Clean Architecture

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-24-green)](https://nodejs.org/)
[![Fastify](https://img.shields.io/badge/Fastify-5.2-black)](https://fastify.dev/)
[![Prisma](https://img.shields.io/badge/Prisma-6.19-2D3748)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18-336791)](https://www.postgresql.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [API Documentation](#api-documentation)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Business Rules](#business-rules)
- [Database Schema](#database-schema)
- [Error Handling](#error-handling)
- [Development](#development)
- [Author](#author)

## 🎯 Overview

VagaFlow Core is a production-ready RESTful API that connects job seekers (candidates) with employers (companies). The platform enables candidates to browse and apply for job openings while allowing companies to post vacancies and manage applications efficiently.

**Key Highlights:**

- 🏗️ **Clean Architecture** - Separation of concerns with clear boundaries
- 🎨 **Domain-Driven Design** - Business logic at the core
- 🔒 **JWT Authentication** - Secure, stateless authentication
- 📊 **Pagination Support** - Efficient data retrieval with metadata
- 📚 **Interactive API Docs** - Swagger/OpenAPI documentation
- 🛡️ **Type Safety** - Full TypeScript with strict mode
- ⚡ **High Performance** - Fastify framework with async/await
- 🔐 **Role-Based Access** - CANDIDATE and COMPANY roles with protected routes

## 🏗️ Architecture

This project follows **Domain-Driven Design (DDD)** and **Clean Architecture** principles, ensuring maintainability, testability, and scalability.

### Layered Structure

```
src/
├── domain/                 # Core business logic (framework-agnostic)
│   ├── entities/           # Business entities (User, Job, Application)
│   ├── value-objects/      # Immutable values (Email, JobTitle, Password)
│   ├── enums/              # Domain enumerations (UserRole, ApplicationStatus)
│   ├── errors/             # Domain-specific errors
│   └── repositories/       # Repository interfaces (contracts)
│
├── application/            # Use cases and application logic
│   ├── use-cases/          # Business use cases (CreateJob, AcceptApplication)
│   └── dtos/               # Data Transfer Objects
│
├── infra/                  # External frameworks and tools
│   ├── database/           # Prisma ORM configuration
│   ├── http/               # Fastify server, routes, controllers, middlewares
│   └── repositories/       # Repository implementations (Prisma)
│
└── shared/                 # Shared utilities and types
    ├── types/              # Common types (Pagination)
    └── utils/              # Utility functions
```

### Design Patterns

- **Repository Pattern** - Data access abstraction
- **Dependency Injection** - Loose coupling between layers
- **Factory Pattern** - Object creation
- **Strategy Pattern** - Algorithm encapsulation (error handling)

## ✨ Features

### 🔐 Authentication & Authorization

- JWT-based authentication with bcrypt password hashing
- Role-based access control (RBAC)
- Protected routes with middleware validation
- Token expiration and refresh handling

### 👤 User Management

- User registration with email validation
- CANDIDATE or COMPANY role assignment
- Immutable role after creation
- Unique email constraint

### 🎓 Candidate Features

- Profile creation linked to user account
- Browse open job vacancies with pagination
- Apply to jobs with duplicate prevention
- View personal application history
- Track application status (APPLIED → ACCEPTED/REJECTED)

### 🏢 Company Features

- Company profile creation
- Post job vacancies with detailed descriptions
- Manage job status (OPEN/CLOSED)
- View applications for owned jobs only
- Accept or reject candidate applications
- Authorization checks (companies can only manage their own jobs)

### 📊 Advanced Features

- **Pagination** - Efficient data retrieval with metadata (page, limit, total, totalPages)
- **Filtering** - Query parameters for data filtering (`?page=1&limit=10`)
- **Error Handling** - Standardized error responses with proper HTTP status codes
- **API Documentation** - Interactive Swagger UI at `/docs`
- **Health Check** - Endpoint for monitoring server status

## 🛠️ Tech Stack

| Category           | Technology       | Version | Purpose                       |
| ------------------ | ---------------- | ------- | ----------------------------- |
| **Runtime**        | Node.js          | 24.x    | JavaScript runtime            |
| **Language**       | TypeScript       | 5.7     | Type-safe development         |
| **Framework**      | Fastify          | 5.2     | High-performance web server   |
| **Database**       | PostgreSQL       | 18.x    | Relational database           |
| **ORM**            | Prisma           | 6.19    | Type-safe database client     |
| **Validation**     | Zod              | 3.24    | Schema validation             |
| **Authentication** | @fastify/jwt     | 9.0     | JWT token handling            |
| **Password**       | bcrypt           | 5.1     | Secure password hashing       |
| **Documentation**  | @fastify/swagger | Latest  | OpenAPI/Swagger docs          |
| **CORS**           | @fastify/cors    | Latest  | Cross-origin resource sharing |

## 📚 API Documentation

Interactive API documentation is available via Swagger UI:

```
http://localhost:3333/docs
```

**Features:**

- Try out all endpoints directly in the browser
- View request/response schemas
- Test authentication with JWT tokens
- Explore organized endpoints by category (Auth, Jobs, Applications)

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher ([Download](https://nodejs.org/))
- **PostgreSQL** v13 or higher ([Download](https://www.postgresql.org/download/))
- **npm** or **yarn** package manager
- **Git** for version control

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/EduardoFSanto/Vagaflow-core.git
cd vagaflow-core
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

Create a .env file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/vagaflow?schema=public"

# Server
PORT=3333
NODE_ENV=development

# JWT
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

4. **Run database migrations**

```bash
npx prisma migrate dev
```

5. **Generate Prisma Client**

```bash
npx prisma generate
```

6. **Start the development server**

```bash
npm run dev
```

The server will start at `http://localhost:3333`

**Available URLs:**

- API: `http://localhost:3333/api`
- Health Check: `http://localhost:3333/health`
- API Docs: `http://localhost:3333/docs`

## 🔌 API Endpoints

### Authentication

| Method | Endpoint             | Description       | Access |
| ------ | -------------------- | ----------------- | ------ |
| POST   | `/api/auth/register` | Register new user | Public |
| POST   | `/api/auth/login`    | Authenticate user | Public |

### Users

| Method | Endpoint     | Description | Access    |
| ------ | ------------ | ----------- | --------- |
| POST   | `/api/users` | Create user | Protected |

### Candidates

| Method | Endpoint          | Description              | Access                |
| ------ | ----------------- | ------------------------ | --------------------- |
| POST   | `/api/candidates` | Create candidate profile | Protected (CANDIDATE) |

### Companies

| Method | Endpoint         | Description            | Access              |
| ------ | ---------------- | ---------------------- | ------------------- |
| POST   | `/api/companies` | Create company profile | Protected (COMPANY) |

### Jobs

| Method | Endpoint        | Description                | Access              |
| ------ | --------------- | -------------------------- | ------------------- |
| GET    | `/api/jobs`     | List open jobs (paginated) | Public              |
| GET    | `/api/jobs/:id` | Get job details            | Public              |
| POST   | `/api/jobs`     | Create job posting         | Protected (COMPANY) |

### Applications

| Method | Endpoint                            | Description           | Access                          |
| ------ | ----------------------------------- | --------------------- | ------------------------------- |
| POST   | `/api/applications`                 | Apply to a job        | Protected (CANDIDATE)           |
| GET    | `/api/applications/my-applications` | List my applications  | Protected (CANDIDATE)           |
| GET    | `/api/jobs/:jobId/applications`     | List job applications | Protected (COMPANY, owner only) |
| PATCH  | `/api/applications/:id/accept`      | Accept application    | Protected (COMPANY, owner only) |
| PATCH  | `/api/applications/:id/reject`      | Reject application    | Protected (COMPANY, owner only) |

### Examples

**Register a new candidate:**

```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "candidate@example.com",
  "password": "securePassword123",
  "name": "John Doe",
  "role": "CANDIDATE"
}
```

**List jobs with pagination:**

```bash
GET /api/jobs?page=1&limit=10
```

**Response:**

```json
{
  "data": [
    {
      "id": "uuid",
      "companyId": "uuid",
      "title": "Senior Backend Developer",
      "description": "Node.js and TypeScript developer",
      "status": "OPEN",
      "createdAt": "2026-02-09T22:31:49.361Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

## 📜 Business Rules

### User & Authentication

- ✅ Email must be unique across all users
- ✅ User role (CANDIDATE or COMPANY) is immutable after creation
- ✅ Passwords are hashed using bcrypt (salt rounds: 10)
- ✅ JWT tokens expire after configured duration (default: 7 days)

### Candidate Rules

- ✅ Candidate profile requires an associated user account
- ✅ A candidate can apply to a job only once
- ✅ Candidates can only apply to jobs with status OPEN
- ✅ Candidates can view their own applications

### Company Rules

- ✅ Company profile requires an associated user account
- ✅ Only companies can create job postings
- ✅ Companies can only view/manage applications for their own jobs
- ✅ Job status can be OPEN or CLOSED

### Application Workflow

1. Candidate applies to an OPEN job → Status: **APPLIED**
2. Company reviews the application
3. Company accepts → Status: **ACCEPTED** (final)
4. Company rejects → Status: **REJECTED** (final)

**Status Transition Rules:**

- ✅ APPLIED → ACCEPTED (allowed)
- ✅ APPLIED → REJECTED (allowed)
- ❌ ACCEPTED → REJECTED (forbidden)
- ❌ REJECTED → ACCEPTED (forbidden)

## 🗄️ Database Schema

### Main Tables

**users**

- `id` (UUID, PK)
- `email` (String, unique)
- `name` (String)
- `passwordHash` (String)
- `role` (Enum: CANDIDATE | COMPANY)
- `createdAt`, `updatedAt` (DateTime)

**candidates**

- `id` (UUID, PK)
- `userId` (UUID, FK → users.id, unique)
- `name` (String)
- `createdAt`, `updatedAt` (DateTime)

**companies**

- `id` (UUID, PK)
- `userId` (UUID, FK → users.id, unique)
- `name` (String)
- `createdAt`, `updatedAt` (DateTime)

**jobs**

- `id` (UUID, PK)
- `companyId` (UUID, FK → companies.id)
- `title` (String)
- `description` (String)
- `status` (Enum: OPEN | CLOSED)
- `createdAt`, `updatedAt` (DateTime)

**applications**

- `id` (UUID, PK)
- `candidateId` (UUID, FK → candidates.id)
- `jobId` (UUID, FK → jobs.id)
- `status` (Enum: APPLIED | ACCEPTED | REJECTED)
- `createdAt`, `updatedAt` (DateTime)
- **Unique constraint:** (candidateId, jobId)

### Relationships

- User 1:1 Candidate
- User 1:1 Company
- Company 1:N Jobs
- Job N:M Candidates (through Applications)

## ⚠️ Error Handling

The API provides standardized error responses with appropriate HTTP status codes:

| Error Type          | HTTP Status | Description                                     |
| ------------------- | ----------- | ----------------------------------------------- |
| `ValidationError`   | 400         | Invalid input data (Zod validation failed)      |
| `UnauthorizedError` | 401         | Missing or invalid JWT token                    |
| `NotFoundError`     | 404         | Resource not found                              |
| `ConflictError`     | 409         | Duplicate resource (e.g., email already exists) |
| `DomainError`       | 400         | Business rule violation                         |
| Unexpected errors   | 500         | Internal server error                           |

**Example Error Response:**

```json
{
  "error": "Bad Request",
  "message": "Invalid email format"
}
```

## 🧪 Development

### Project Scripts

```bash
# Development mode with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Format code
npm run format

# Lint code
npm run lint

# Database studio (Prisma Studio)
npx prisma studio
```

### Code Quality

- **ESLint** - Linting with recommended rules
- **Prettier** - Code formatting
- **TypeScript Strict Mode** - Maximum type safety
- **Git Hooks** - Pre-commit validation (planned)

### Development Principles

- ✅ **SOLID Principles** - Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion
- ✅ **DDD Patterns** - Entities, Value Objects, Repositories, Use Cases
- ✅ **Clean Code** - Meaningful names, small functions, clear intent
- ✅ **Immutability** - Value objects and critical properties are immutable
- ✅ **Dependency Injection** - Loose coupling between layers

## 📦 Project Status

**Current Version:** 2.0.0

### ✅ Completed Features

- [x] Domain layer with entities, value objects, and business rules
- [x] Application layer with use cases and DTOs
- [x] Infrastructure layer with Prisma repositories
- [x] HTTP layer with Fastify server, routes, and controllers
- [x] JWT authentication (register, login)
- [x] Authorization middleware with role-based access control
- [x] Error handling middleware with custom domain errors
- [x] Database schema and migrations
- [x] GET endpoints with pagination support
- [x] Swagger/OpenAPI interactive documentation
- [x] Input validation with Zod schemas
- [x] Password hashing with bcrypt
- [x] CORS configuration

### 🚧 Planned Features

- [ ] Unit tests for domain entities and use cases
- [ ] Integration tests for API endpoints
- [ ] Docker and Docker Compose setup
- [ ] CI/CD pipeline with GitHub Actions
- [ ] Rate limiting and request throttling
- [ ] Structured logging (Winston/Pino)
- [ ] Email notifications
- [ ] File upload support (company logos, candidate resumes)
- [ ] Advanced search and filtering
- [ ] Caching layer (Redis)
- [ ] Monitoring and observability (Grafana, Prometheus)

## 👨‍💻 Author

**Eduardo Santos**

- GitHub: [@EduardoFSanto](https://github.com/EduardoFSanto)
- Email: farias.eduardo@icloud.com
- LinkedIn: [Eduardo Santos](https://linkedin.com/in/eduardo-santos)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

This project was built as a comprehensive learning exercise to demonstrate:

- Enterprise-grade backend architecture
- Domain-Driven Design implementation
- Clean Architecture principles
- TypeScript best practices
- Modern Node.js development patterns
- RESTful API design
- Authentication and authorization patterns

---

**Built with using TypeScript, Fastify, and Prisma**
