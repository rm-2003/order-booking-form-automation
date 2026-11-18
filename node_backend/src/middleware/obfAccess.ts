import { Request, Response, NextFunction } from 'express';
// import { isAuthenticated } from './auth'; // Removed unused import
import OBFAccess from '../models/OBFAccess';
import OBF from '../models/OBF';
import User from '../models/User'; // Removed UserAttributes from import

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

type AccessLevel = 'view' | 'edit' | 'admin';

export const checkOBFAccess = (requiredLevel: AccessLevel = 'view') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // First check if user is authenticated
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const obfId = req.params.obfId;
      if (!obfId) {
        return res.status(400).json({ message: 'OBF ID is required' });
      }

      // Check if OBF exists
      const obf = await OBF.findByPk(obfId);
      if (!obf) {
        return res.status(404).json({ message: 'OBF not found' });
      }

      // If user is the creator, they have full access
      if (obf.creatorId === (req.user as User).id) {
        return next();
      }

      // Check user's access level
      const access = await OBFAccess.findOne({
        where: {
          obfId,
          userId: (req.user as User).id,
        },
      });

      if (!access) {
        return res.status(403).json({ message: 'Access denied' });
      }

      // Check if user has required access level
      const accessLevels: AccessLevel[] = ['view', 'edit', 'admin'];
      const requiredLevelIndex = accessLevels.indexOf(requiredLevel);
      const userLevelIndex = accessLevels.indexOf(access.accessLevel);

      if (userLevelIndex < requiredLevelIndex) {
        return res.status(403).json({ message: 'Insufficient permissions' });
      }

      return next();
    } catch (error) {
      return next(error);
    }
  };
};

// Helper middleware to check if user is OBF creator
export const isOBFCreator = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const obfId = req.params.obfId;
    const obf = await OBF.findByPk(obfId);

    if (!obf) {
      return res.status(404).json({ message: 'OBF not found' });
    }

    if (obf.creatorId !== (req.user as User)?.id) {
      return res.status(403).json({ message: 'Only the creator can modify access' });
    }

    return next();
  } catch (error) {
    return next(error);
  }
}; 