import express from 'express';
import cors from 'cors';
import { connectDB, disconnectDB } from './utils/db.js';
import { validateTaskAssignment } from './middleware/task.middleware.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
import { router as userRouter } from './routes/user.routes.js';
import { router as taskRouter } from './routes/task.routes.js';

// Task assignment validation middleware
app.use('/api/tasks/assign', validateTaskAssignment);

// API Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Task Manager API',
    endpoints: {
      users: '/api/users',
      tasks: '/api/tasks',
      taskState: '/api/tasks/state',
      assignTask: '/api/tasks/assign',
      updateStatus: '/api/tasks/:id/status'
    }
  });
});

app.use('/api/users', userRouter);
app.use('/api/tasks', taskRouter);

// Task state endpoint
import { getTaskState } from './utils/taskState.js';
app.get('/api/tasks/state', (req, res) => {
  const states = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
  const stateInfo = states.map(state => getTaskState(state));
  res.json(stateInfo);
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: err.message 
  });
});

// Start the server
const server = app.listen(port, async () => {
  try {
    await connectDB();
    console.log(`Server is running on http://localhost:${port}`);
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
});

// Handle graceful shutdown
const gracefulShutdown = async () => {
  console.log('Shutting down gracefully...');
  
  server.close(async () => {
    console.log('Server closed');
    await disconnectDB();
    process.exit(0);
  });

  // Force close server after 5 seconds
  setTimeout(() => {
    console.error('Forcing server shutdown');
    process.exit(1);
  }, 5000);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
