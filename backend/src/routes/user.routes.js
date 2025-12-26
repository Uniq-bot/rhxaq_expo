import { Router } from 'express';
import prisma from '../utils/db.js';

const router = Router();

// Get all users
router.get('/', async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.json(users);
  } catch (error) {
    next(error);
  }
});

// Create a new user
router.post('/', async (req, res, next) => {
  const { email, name } = req.body;
  
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
      },
    });
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
});

export default router;
