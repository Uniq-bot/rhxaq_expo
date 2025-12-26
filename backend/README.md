# Task Manager API

A simple task management system built with Node.js, Express, and Prisma, using PostgreSQL as the database.

## Features

- **User Management**: Create and manage users
- **Task Management**: Create, update, and track tasks
- **Task Assignment**: Assign tasks to users (max 3 users per task)
- **State Management**: Track task status with valid state transitions
- **RESTful API**: Follows REST principles

## Data Model

### Tables

1. **User**
   - id: Primary Key
   - email: String (Unique)
   - name: String (Optional)
   - createdAt: DateTime
   - updatedAt: DateTime

2. **Task**
   - id: Primary Key
   - title: String (Required)
   - description: String (Optional)
   - status: Enum (PENDING, IN_PROGRESS, COMPLETED, CANCELLED)
   - dueDate: DateTime (Optional)
   - createdAt: DateTime
   - updatedAt: DateTime

3. **TaskAssignment**
   - id: Primary Key
   - taskId: Foreign Key to Task
   - userId: Foreign Key to User
   - assignedAt: DateTime
   - Unique constraint on (taskId, userId)

## Business Rules

1. **Task Assignment Limit**: A task cannot be assigned to more than 3 users
2. **Status Transitions**:
   - PENDING → IN_PROGRESS or CANCELLED
   - IN_PROGRESS → COMPLETED or CANCELLED
   - COMPLETED → (no further transitions)
   - CANCELLED → (no further transitions)

## State Management

The system uses a state machine for task status. To view the current state and allowed transitions, make a GET request to `/api/tasks/state`.

Example response:
```json
[
  {
    "status": "PENDING",
    "allowedNext": ["IN_PROGRESS", "CANCELLED"]
  },
  {
    "status": "IN_PROGRESS",
    "allowedNext": ["COMPLETED", "CANCELLED"]
  },
  {
    "status": "COMPLETED",
    "allowedNext": []
  },
  {
    "status": "CANCELLED",
    "allowedNext": []
  }
]
```

## API Endpoints

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create a new task
- `POST /api/tasks/assign` - Assign a task to a user
- `PATCH /api/tasks/:id/status` - Update task status

### Users
- `GET /api/users` - Get all users
- `POST /api/users` - Create a new user

## Getting Started

### Prerequisites

- Node.js (v14+)
- PostgreSQL
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your `.env` file with your database connection string
4. Run migrations:
   ```bash
   npx prisma migrate dev --name init
   ```
5. Start the server:
   ```bash
   npm run dev
   ```

## Running Tests

```bash
npm test
```

## License

This project is licensed under the MIT License.
