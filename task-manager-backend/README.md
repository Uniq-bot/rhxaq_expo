# Task Manager API

A RESTful API for managing tasks and users, built with Node.js, Express, PostgreSQL, and Prisma.

## Features

- User management (CRUD operations)
- Task management (CRUD operations)
- One-to-many relationship between Users and Tasks
- Input validation and error handling
- Environment-based configuration
- CORS support

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher) or yarn
- PostgreSQL database
- Prisma CLI (installed as dev dependency)

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Update the database connection string and other variables as needed

4. Set up the database:
   ```bash
   npx prisma migrate dev --name init
   ```

5. Generate Prisma Client:
   ```bash
   npx prisma generate
   ```

## Running the Application

- Development mode with auto-reload:
  ```bash
  npm run dev
  ```

- Production mode:
  ```bash
  npm start
  ```

The API will be available at `http://localhost:3000` by default.

## API Endpoints

### Users

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get a specific user by ID
- `POST /api/users` - Create a new user
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com"
  }
  ```
- `PUT /api/users/:id` - Update a user
- `DELETE /api/users/:id` - Delete a user

### Tasks

- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get a specific task by ID
- `GET /api/tasks/user/:userId` - Get all tasks for a specific user
- `POST /api/tasks` - Create a new task
  ```json
  {
    "title": "Complete project",
    "description": "Finish the task manager API",
    "userId": "user-id-here"
  }
  ```
- `PUT /api/tasks/:id` - Update a task
  ```json
  {
    "title": "Updated task title",
    "description": "Updated description",
    "completed": true
  }
  ```
- `DELETE /api/tasks/:id` - Delete a task

## Database Schema

### User
- `id` (String, Primary Key)
- `name` (String)
- `email` (String, Unique)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### Task
- `id` (String, Primary Key)
- `title` (String)
- `description` (String, Optional)
- `completed` (Boolean, Default: false)
- `userId` (String, Foreign Key)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

## Error Handling

The API returns appropriate HTTP status codes and JSON error responses:

```json
{
  "error": "Error message",
  "message": "Additional details (in development)"
}
```

## Environment Variables

- `PORT` - Server port (default: 3000)
- `DATABASE_URL` - PostgreSQL connection string
- `NODE_ENV` - Environment (development/production)

## Deployment

1. Set up a PostgreSQL database
2. Update the `DATABASE_URL` in your production environment
3. Install dependencies with `npm install --production`
4. Run database migrations: `npx prisma migrate deploy`
5. Start the server: `npm start`

## License

MIT
