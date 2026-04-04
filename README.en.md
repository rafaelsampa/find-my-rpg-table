
# 🎲 FindMyRPG

[🇧🇷 Português](./README.md) | 🇺🇸 English | [🇫🇷 Français](./README.fr.md)

## Connecting Players / Structuring Ideas / Building to Learn

## Overview
A SaaS platform designed to connect tabletop RPG players with active game tables.

The application allows players to find campaigns through structured filters, while Game Masters (GMs) can promote their sessions using standardized categories. The goal is to avoid excessive free-text searches, ensuring filter consistency, database integrity, and a superior browsing experience.

---

# 1. Project Purpose

FindMyRPG was born from two main motivations:

1. **Solving a real community problem:**
   Finding organized RPG tables without relying exclusively on scattered Discord groups or social media.

2. **Serving as a "Build to Learn" project:**
   A system intentionally designed to practice:
   * Layered Architecture (N-Tier)
   * Consistent Relational Modeling
   * Correct use of Enums
   * Formal definition of Business Rules
   * Real Test-Driven Development (TDD)
   * Deterministic API Contracts

This is not just a CRUD. It is a controlled software engineering laboratory.

# 2. Problem Statement

Currently, finding an RPG table involves:
* Loose messages in Discord and chats.
* Incomplete information.
* Lack of standardization.
* Difficulty filtering by system, theme, or format.

The system solves this by imposing **structure**:
* Fixed categories.
* Deterministic filters.
* Clear business rules.
* Consistent data.

No free-text breaking the search. No semantic inconsistency.

# 3. Design Philosophy

This system follows three core principles:

### 1. Structure > Excessive Flexibility
Critical fields are controlled Enums.

### 2. Backend as the Source of Truth
Every rule validated on the frontend must be mandatorily validated on the backend.

### 3. Specification Precedes Implementation
The implementation must strictly obey this documentation.

# 4. Architecture

## Frontend
* **Core:** React + Vite
* **Styling:** Tailwind CSS + shadcn/ui
* **Forms & Validation:** React Hook Form + Zod
* **Data Fetching:** Axios + TanStack Query

## Backend
* **Runtime:** Node.js + Express.js
* **ORM:** Prisma ORM
* **Database:** PostgreSQL
* **Validation:** Zod
* **Layered Architecture:**
  * Controllers
  * Services
  * Repositories
  * Middlewares

## Database
* **Engine:** PostgreSQL
* **Primary Keys:** UUID
* **Domains:** Native ENUMs for categorical data

# 5. Data Model

## Entity: User

| Field         | Type         | Rule          |
| ------------- | ------------ | ------------- |
| id            | UUID         | PK            |
| email         | VARCHAR(255) | Unique        |
| password_hash | TEXT         | bcrypt        |
| profile_name  | VARCHAR(100) | Required      |
| created_at    | TIMESTAMP    | default NOW() |

## Entity: Campaign

| Field                | Type         | Rule                         |
| -------------------- | ------------ | ---------------------------- |
| id                   | UUID         | PK                           |
| owner_id             | UUID         | FK → User(id)                |
| system               | ENUM         | Required                     |
| theme                | ENUM         | Required                     |
| modality             | ENUM         | Required                     |
| city                 | VARCHAR(120) | Conditional                  |
| vtt                  | ENUM         | Required                     |
| campaign_type        | ENUM         | Required                     |
| setting_lore         | TEXT         | ≤ 1500 words                 |
| total_slots          | INTEGER      | 1–12                         |
| filled_slots         | INTEGER      | 0 ≤ value ≤ total_slots      |
| created_at           | TIMESTAMP    | default NOW()                |

# 6. Official ENUMs (Case-Sensitive)

### SYSTEM
`DND_5E`, `LANCER`, `TORMENTA20`, `CALL_OF_CTHULHU`, `PATHFINDER_2E`, `VAMPIRO_A_MASCARA`, `OTHER`, `TBD`

### THEME
`MEDIEVAL_FANTASY`, `SCI_FI_MECHA`, `CYBERPUNK`, `HORROR_INVESTIGATION`, `POST_APOCALYPTIC`, `OTHER`, `TBD`

### MODALITY
`REMOTE`, `IN_PERSON`, `TBD`

### VTT_TOOL
`TABLETOP_SIMULATOR`, `FOUNDRY_VTT`, `ROLL20`, `OWLBEAR_RODEO`, `DISCORD_THEATER_OF_THE_MIND`, `OTHER`, `TBD`

### CAMPAIGN_TYPE
`PUBLISHED_MODULE`, `HOME_BREW`, `TBD`

# 7. Domain Invariants (Mandatory)

1. `total_slots` ∈ [1, 12]
2. `filled_slots` ∈ [0, total_slots]
3. `setting_lore` ≤ 1500 words
4. If `modality` = `IN_PERSON` → `city` is required.
5. If `modality` = `REMOTE` → `city` must be NULL.

# 8. Authentication

**JWT (JSON Web Token):**
* **Algorithm:** HS256
* **Expiration:** 24h
* **Payload:** `user_id`, `email`

# 9. API Contracts

## POST `/auth/register`
```json
{
  "email": "string",
  "password": "string (min 8)",
  "profile_name": "string"
}
```

## POST `/auth/login`
```json
{
  "email": "string",
  "password": "string"
}
```
**Response:** `{ "token": "JWT" }`

## GET `/campaigns`
**Optional Query Params:** `system`, `theme`, `modality`, `vtt`, `campaign_type`, `page` (default 1), `limit` (default 10, max 50).

# 10. Global Error Pattern

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "User-friendly description",
    "issues": []
  }
}
```

# 11. Testing Strategy (TDD)

* No endpoint is considered "done" without tests.
* **Tools:** Jest + Supertest.
* **Scope:** Authentication, Domain Rules, Authorization, Pagination, and Combined Filters.

# 12. Project Nature

This project is:
* A deliberate architectural exercise.
* A relational modeling laboratory.
* A practical study of TDD.
* A scalable foundation for future features.

---

**DISCLAIMER**: As a "Build to Learn" project, the architectures and technologies used may be replaced or removed during the development process.

