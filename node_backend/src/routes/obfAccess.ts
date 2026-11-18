import express, { Request, Response, NextFunction } from 'express';
import { isAuthenticated } from '../middleware/auth';
import { checkOBFAccess, isOBFCreator } from '../middleware/obfAccess';
import OBFAccess from '../models/OBFAccess';
import User from '../models/User';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Get all users with access to an OBF
router.get('/:obfId/users',
  isAuthenticated,
  checkOBFAccess('view'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accesses = await OBFAccess.findAll({
        where: { obfId: req.params.obfId },
        include: [{
          model: User,
          attributes: ['id', 'name', 'email', 'picture'],
        }],
      });

      return res.json(accesses);
    } catch (error) {
      return next(error);
    }
  }
);

// Grant access to a user
router.post('/:obfId/users/:userId',
  isAuthenticated,
  isOBFCreator,
  async (req: Request<{ obfId: string; userId: string }, {}, { accessLevel: 'view' | 'edit' | 'admin'; role?: string }>, res: Response, next: NextFunction) => {
    try {
      const { obfId, userId } = req.params;
      const { accessLevel, role } = req.body;

      // Validate access level
      if (!['view', 'edit', 'admin'].includes(accessLevel)) {
        return res.status(400).json({ message: 'Invalid access level' });
      }

      // Check if user exists
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Use provided role or default to 'Salesperson'
      const userRole = role || 'Salesperson';

      // Create or update access
      const [access, created] = await OBFAccess.findOrCreate({
        where: { obfId, userId },
        defaults: { 
          id: uuidv4(), // Generate a proper UUID
          obfId,
          userId,
          accessLevel,
          role: userRole,
        },
      });

      if (!created) {
        await access.update({ accessLevel, role: userRole });
      }
      return res.json(access);
    } catch (error) {
      return next(error);
    }
  }
);

// Update user's access level
router.put('/:obfId/users/:userId',
  isAuthenticated,
  isOBFCreator,
  async (req: Request<{ obfId: string; userId: string }, {}, { accessLevel: 'view' | 'edit' | 'admin' }>, res: Response, next: NextFunction) => {
    try {
      const { obfId, userId } = req.params;
      const { accessLevel } = req.body;

      // Validate access level
      if (!['view', 'edit', 'admin'].includes(accessLevel)) {
        return res.status(400).json({ message: 'Invalid access level' });
      }

      const access = await OBFAccess.findOne({
        where: { obfId, userId },
      });

      if (!access) {
        return res.status(404).json({ message: 'Access record not found' });
      }

      await access.update({ accessLevel });
      return res.json(access);
    } catch (error) {
      return next(error);
    }
  }
);

// Remove user's access
router.delete('/:obfId/users/:userId',
  isAuthenticated,
  isOBFCreator,
  async (req: Request<{ obfId: string; userId: string }>, res: Response, next: NextFunction) => {
    try {
      const { obfId, userId } = req.params;

      const access = await OBFAccess.findOne({
        where: { obfId, userId },
      });

      if (!access) {
        return res.status(404).json({ message: 'Access record not found' });
      }

      await access.destroy();
      return res.json({ message: 'Access removed successfully' });
    } catch (error) {
      return next(error);
    }
  }
);

export default router; 