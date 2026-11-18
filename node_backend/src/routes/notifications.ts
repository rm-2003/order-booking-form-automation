import express, { Request, Response } from 'express';
import { sequelize } from '../config/database';
import { QueryTypes } from 'sequelize';
import { isAuthenticated } from '../middleware/auth';
import Notification from '../models/Notification';

const notificationsRouter = express.Router();

// GET /obf/notifications (for current user, unread filter optional)
notificationsRouter.get('/notifications', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any).id;
    const { unread } = req.query;
    const notifications = await sequelize.query(
      `SELECT n.*, o.project_name, o.project_code
       FROM notifications n
       JOIN obf o ON n.obf_id = o.id
       WHERE n.user_id = :userId ${unread === 'true' ? 'AND n.read = false' : ''}
       ORDER BY n.created_at DESC`,
      {
        replacements: { userId },
        type: QueryTypes.SELECT
      }
    );
    return res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return res.status(500).json({ message: 'Failed to fetch notifications' });
  }
});

// POST /obf/notifications/:id/read (mark as read)
notificationsRouter.post('/notifications/:id/read', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req.user as any).id;
    const notification = await Notification.findOne({ where: { id, user_id: userId } });
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    notification.read = true;
    notification.updated_at = new Date();
    await notification.save();
    return res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return res.status(500).json({ message: 'Failed to mark notification as read' });
  }
});

export default notificationsRouter; 