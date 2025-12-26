import { Router } from 'express';
import prisma from '../utils/db.js';

export const taskRouter = Router();

// Get all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      include: {
        assignments: {
          include: {
            user: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Create a new task
router.post('/', async (req, res) => {
  const { title, description, dueDate } = req.body;
  
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  try {
    const task = await prisma.task.create({
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    });
    
    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Assign a task to a user
router.post('/assign', async (req, res) => {
  const { taskId, userId } = req.body;
  
  if (!taskId || !userId) {
    return res.status(400).json({ error: 'Task ID and User ID are required' });
  }

  try {
    // Check if assignment already exists
    const existingAssignment = await prisma.taskAssignment.findFirst({
      where: {
        taskId: parseInt(taskId),
        userId: parseInt(userId)
      }
    });

    if (existingAssignment) {
      return res.status(400).json({ error: 'User is already assigned to this task' });
    }

    const assignment = await prisma.taskAssignment.create({
      data: {
        taskId: parseInt(taskId),
        userId: parseInt(userId),
      },
      include: {
        task: true,
        user: true
      }
    });
    
    res.status(201).json(assignment);
  } catch (error) {
    console.error('Error assigning task:', error);
    res.status(500).json({ error: 'Failed to assign task' });
  }
});

// Update task status
router.patch('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  if (!status || !['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].includes(status)) {
    return res.status(400).json({ error: 'Valid status is required' });
  }

  try {
    const updatedTask = await prisma.task.update({
      where: { id: parseInt(id) },
      data: { status },
    });
    
    res.json(updatedTask);
  } catch (error) {
    console.error('Error updating task status:', error);
    res.status(500).json({ error: 'Failed to update task status' });
  }
});

export default taskRouter;
