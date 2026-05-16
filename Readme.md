# Taskma

A full-stack Todo application built as a hands on project for learning [Prisma ORM](https://www.prisma.io/). It supports user authentication, tag based todo organization, and is deployed across Vercel and Render.

---

## What I Learned

- Setting up **Prisma** with PostgreSQL from scratch
- Writing and migrating a **Prisma schema** with relations (one-to-many, many-to-many)
- Using **Prisma Client** for type-safe database queries
- Structuring a **REST API** with Express and TypeScript
- Implementing **JWT authentication** with access & refresh tokens

---

## Features

- **Auth** — Register, login, logout with JWT access & refresh tokens
- **Todos** — Create, read, update, delete todos
- **Tags** — Attach tags to todos for organization
- **User-scoped** — Each user only sees their own todos
- **Timestamps** — Auto-managed `createdAt` and `updatedAt` fields

---

## Database Schema

Three models with Prisma-managed relations:

```
User ──< Todo >──< Tag
```

- A **User** has many **Todos**
- A **Todo** belongs to one **User** and can have many **Tags**
- A **Tag** can belong to many **Todos** (many-to-many)

```prisma
model User {
  id           Int      @id @default(autoincrement())
  email        String   @unique
  name         String
  password     String
  createdAt    DateTime @default(now())
  refreshToken String
  todos        Todo[]
}

model Todo {
  id          Int      @id @default(autoincrement())
  title       String
  description String?
  completed   Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  userId      Int
  user        User     @relation(fields: [userId], references: [id])
  tags        Tag[]
}

model Tag {
  id    Int    @id @default(autoincrement())
  name  String @unique
  todos Todo[]
}
```

---

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React, TypeScript, Vite             |
| Backend    | Node.js, Express, TypeScript        |
| ORM        | Prisma                              |
| Database   | PostgreSQL                          |
| Auth       | JWT (Access token + Refresh token)  |
| Deployment | Vercel (frontend), Render (backend) |

---

## Project Structure

```
.
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   └── src/
│       ├── controller/
│       │   ├── todo.controller.ts       # Todo CRUD logic
│       │   └── user.controller.ts       # Auth & user logic
│       ├── db/
│       │   ├── todo.db.ts               # Prisma queries for todos
│       │   └── user.db.ts               # Prisma queries for users
│       ├── middleware/
│       │   └── auth.middleware.ts       # JWT verification
│       ├── routes/
│       │   ├── todo.routes.ts
│       │   └── user.routes.ts
│       ├── types/
│       │   └── express.d.ts             # Extended Express types
│       └── index.ts                     # App entry point
│
└── frontend/
    ├── public/
    └── src/
        ├── components/
        │   ├── Pages/
        │   │   ├── Home.tsx             # Main dashboard page
        │   │   └── SignupPage.tsx        # Auth page
        │   ├── AllTasks.tsx             # All todos view
        │   ├── CompletedTasks.tsx       # Completed todos view
        │   ├── Navbar.tsx               # Top navigation
        │   ├── TagSidebar.tsx           # Tag-based filtering sidebar
        │   └── TodayPanel.tsx           # Today's todos panel
        ├── utils/
        │   └── api.ts                   # API calls
        ├── App.tsx
        ├── main.tsx
        └── index.css
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- PostgreSQL database
- npm or yarn

### 1. Clone the repo

```bash
git clone https://github.com/devsterxyz/Taskma.git
cd Taskma
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file (see `.env.example`):

```env
DATABASE_URL="postgresql://user:password@localhost:5432/todos"
ACCESS_TOKEN_SECRET="your_access_secret"
REFRESH_TOKEN_SECRET="your_refresh_secret"
```

Run Prisma migrations and start the server:

```bash
npx prisma migrate dev
npm run dev
```

### 3. Set up the frontend

```bash
cd frontend
npm install
npm run dev
```

---

## API Overview

| Method | Endpoint         | Description            | Auth Required |
|--------|------------------|------------------------|---------------|
| POST   | `/auth/register` | Register a new user    | No            |
| POST   | `/auth/login`    | Login and get tokens   | No            |
| POST   | `/auth/refresh`  | Refresh access token   | No            |
| POST   | `/auth/logout`   | Logout user            | Yes           |
| GET    | `/todos`         | Get all todos for user | Yes           |
| POST   | `/todos`         | Create a new todo      | Yes           |
| PATCH  | `/todos/:id`     | Update a todo          | Yes           |
| DELETE | `/todos/:id`     | Delete a todo          | Yes           |
| GET    | `/tags`          | Get all tags           | Yes           |

---

## Auth Flow

1. User logs in and receives a short-lived **access token** and a long-lived **refresh token**
2. Access token is sent in the `Authorization: Bearer <token>` header on every request
3. When the access token expires, the client uses the refresh token to get a new one
4. Logout clears the refresh token from the database