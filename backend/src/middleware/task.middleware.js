import prisma from '../utils/db.js';

export const validateTaskAssignment = async (req, res, next) => {
  if (req.method === 'POST' && req.path.includes('/assign')) {
    try {
      const { taskId } = req.body;
      
      // Check current assignment count
      const assignmentCount = await prisma.taskAssignment.count({
        where: { taskId: parseInt(taskId) }
      });

      if (assignmentCount >= 3) {
        return res.status(400).json({
          error: 'A task cannot be assigned to more than 3 users'
        });
      }
    } catch (error) {
      console.error('Assignment validation error:', error);
      return res.status(500).json({ error: 'Failed to validate task assignment' });
    }
  }
  next();
};
