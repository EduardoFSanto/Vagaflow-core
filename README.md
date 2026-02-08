# VagaFlow Core

Backend API for a job application platform built with Domain-Driven Design (DDD) and Clean Architecture principles.

## Overview

VagaFlow Core is a RESTful API that connects candidates and companies through job vacancies. The system allows candidates to apply for jobs and companies to manage applications by accepting or rejecting them.

## Architecture

This project follows **Domain-Driven Design (DDD)** and **Clean Architecture** principles, ensuring:

- Clear separation of concerns
- Business logic independence from frameworks and infrastructure
- Testability and maintainability
- Type safety with TypeScript

### Project Structure

```
src/
├── domain/              # Business logic and rules
│   ├── entities/        # Domain entities (User, Company, Job, Application)
│   ├── value-objects/   # Value objects (Email, JobTitle)
│   ├── enums/          # Domain enums (UserRole, ApplicationStatus, JobStatus)
│   ├── errors/         # Domain-specific errors
│   └── repositories/   # Repository interfaces
│
├── application/        # Application layer
│   ├── use-cases/      # Use case implementations
│   └── dtos/          # Data Transfer Objects
│
└── infra/             # Infrastructure layer
    ├── database/       # Prisma ORM configuration
    ├── http/          # Fastify server, routes, controllers
    └── repositories/   # Repository implementations (Prisma)
```

## Tech Stack

- **Node.js** - Runtime environment
- **TypeScript** - Programming language
- **Fastify** - Web framework
- **Prisma** - ORM for database access
- **PostgreSQL** - Relational database
- **Zod** - Schema validation

## Core Features

### User Management

- Create users with CANDIDATE or COMPANY roles
- Role-based access control
- Email uniqueness validation

### Candidate Features

- Create candidate profile
- Apply to job vacancies
- View application status
- Prevention of duplicate applications

### Company Features

- Create company profile
- Post job vacancies
- Manage job status (OPEN/CLOSED)
- Accept or reject applications

### Application Workflow

1. Candidate applies to an open job vacancy
2. Application is created with PENDING status
3. Company reviews the application
4. Company accepts (ACCEPTED) or rejects (REJECTED) the application
5. Status becomes final and cannot be changed

## Business Rules

- A user can have only one role (CANDIDATE or COMPANY)
- User role is immutable after creation
- Only companies can create jobs and manage applications
- Candidates can only apply to open jobs
- A candidate cannot apply twice to the same job
- Once an application is accepted or rejected, the status is final

## API Endpoints

### Users

```
POST /api/users
```

### Candidates

```
POST /api/candidates
```

### Companies

```
POST /api/companies
```

### Jobs

```
POST /api/jobs
```

### Applications

```
POST /api/applications
PATCH /api/applications/:id/accept
PATCH /api/applications/:id/reject
```

### Health Check

```
GET /health
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v13 or higher)
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone https://github.com/EduardoFSanto/Vagaflow-core.git
cd vagaflow-core
```

2. Install dependencies

```bash
npm install
```

3. Configure environment variables

Copy .env.example to .env and update the values:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/vagaflow?schema=public"
PORT=3333
NODE_ENV=development
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
ALLOWED_ORIGINS=http://localhost:3000
```

4. Run database migrations

```bash
npx prisma migrate dev
```

5. Generate Prisma Client

```bash
npx prisma generate
```

### Running the Application

Development mode:

```bash
npm run dev
```

Build for production:

```bash
npm run build
npm start
```

### Testing

Run tests:

```bash
npm test
```

Run tests with coverage:

```bash
npm run test:coverage
```

## Database Schema

The application uses PostgreSQL with the following main tables:

- `users` - User accounts with role (CANDIDATE or COMPANY)
- `candidates` - Candidate profiles linked to users
- `companies` - Company profiles linked to users
- `jobs` - Job vacancies created by companies
- `applications` - Job applications from candidates

All tables include:

- UUID primary keys
- Timestamps (createdAt, updatedAt)
- Proper foreign key constraints
- Cascade deletes where appropriate

## Error Handling

The API uses custom domain errors that are automatically converted to appropriate HTTP status codes:

- `ValidationError` → 400 Bad Request
- `UnauthorizedError` → 403 Forbidden
- `NotFoundError` → 404 Not Found
- `ConflictError` → 409 Conflict
- `DomainError` → 400 Bad Request
- Unexpected errors → 500 Internal Server Error

## Development Principles

- **SOLID Principles** - Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion
- **DDD Patterns** - Entities, Value Objects, Aggregates, Repositories, Domain Services
- **Clean Code** - Meaningful names, small functions, clear intent
- **Type Safety** - Strict TypeScript configuration
- **Immutability** - Value objects and critical domain properties are immutable

## Project Status

Current version: 1.0.0

### Completed

- Domain layer with entities, value objects, and business rules
- Application layer with use cases
- Infrastructure layer with Prisma repositories
- HTTP layer with Fastify server and routes
- Error handling middleware
- Database schema and migrations

### Planned Features

- Authentication with JWT
- Authorization middleware
- GET endpoints for listing resources
- Filtering and pagination
- Unit and integration tests
- API documentation (Swagger/OpenAPI)
- Docker support
- CI/CD pipeline

## Contributing

This is a personal project for learning and portfolio purposes. Contributions are not currently being accepted.

## License

MIT License - See LICENSE file for details

## Author

Eduardo Santos

- GitHub: [@EduardoFSanto](https://github.com/EduardoFSanto)
- Email: farias.eduardo@icloud.com

## Acknowledgments

Built as a learning project to demonstrate:

- Domain-Driven Design implementation
- Clean Architecture principles
- TypeScript best practices
- Modern Node.js development
