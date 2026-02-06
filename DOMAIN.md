# VagaFlow Core — Domain Definition

## 🎯 Purpose

VagaFlow exists to connect candidates to companies through job applications.

The system must guarantee:

- Data consistency
- Clear separation of responsibilities
- Enforced business rules
- Predictable state transitions

---

## 🧩 Actors

### Candidate

- Searches jobs
- Applies to jobs
- Never creates jobs

### Company

- Creates jobs
- Manages applications
- Never applies to jobs

### System

- Enforces rules
- Validates data
- Protects sensitive information

---

## 🧠 Core Questions (must always have an answer)

- Who is allowed to perform this action?
- What state must exist before this action?
- What state changes after this action?
- What can go wrong?

---

## 🧱 Core Entities

### User

Represents authentication identity.

- id
- email
- passwordHash
- role (CANDIDATE | COMPANY)

A user's role is immutable.

---

### Candidate

Represents a job seeker.

- id
- userId
- name

A candidate cannot exist without a user.

---

### Company

Represents an employer.

- id
- userId
- name

A company cannot exist without a user.

---

### Job

Represents an open position.

- id
- companyId
- title
- description
- status (OPEN | CLOSED)

Only companies can create jobs.

---

### Application

Represents a candidate applying to a job.

- id
- jobId
- candidateId
- status (APPLIED | ACCEPTED | REJECTED)

A candidate can apply only once per job.

---

## 🔄 State Transitions

### Job

OPEN → CLOSED  
CLOSED → ❌ (no transition)

---

### Application

APPLIED → ACCEPTED  
APPLIED → REJECTED  
ACCEPTED / REJECTED → ❌

---

## 🚫 Forbidden States

- Candidate creating a job
- Company applying to a job
- Application to a closed job
- Application without a candidate
- Job without a company

---

## ⚠️ Failure Scenarios

- Database unavailable
- Duplicate application
- Unauthorized access
- Invalid data

All failures must return explicit errors.

---

## 🧠 Engineering Principle

If a rule is not written here, it does not exist.

Code must reflect this document, not redefine it.
