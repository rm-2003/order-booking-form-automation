import { sequelize } from '../config/database';
import { QueryTypes } from 'sequelize';

interface NotificationData {
  userId: string;
  obfId: string;
  type: 'validation' | 'approval' | 'rejection' | 'comment';
  message: string;
}

interface ObfCreator {
  creatorId: string;
}

interface AccessUser {
  userId: string;
}

export async function createNotification(data: NotificationData) {
  await sequelize.query(
    `INSERT INTO notifications (user_id, obf_id, type, message, read, created_at, updated_at)
     VALUES (:userId, :obfId, :type, :message, false, NOW(), NOW())`,
    {
      replacements: {
        userId: data.userId,
        obfId: data.obfId,
        type: data.type,
        message: data.message
      },
      type: QueryTypes.INSERT
    }
  );
}

export async function notifyObfCreator(obfId: string, type: NotificationData['type'], message: string) {
  const [rows] = await sequelize.query<[ObfCreator[], unknown]>(
    `SELECT "creatorId" FROM obf WHERE id = :obfId`,
    { replacements: { obfId }, type: QueryTypes.SELECT }
  );
  if (rows.length > 0) {
    const creator = (rows[0] as unknown) as ObfCreator;
    await createNotification({
      userId: creator.creatorId,
      obfId,
      type,
      message
    });
  }
}

export async function notifyAllAccessUsers(obfId: string, type: NotificationData['type'], message: string) {
  const [rows] = await sequelize.query<[AccessUser[], unknown]>(
    `SELECT DISTINCT "userId" FROM obf_access WHERE "obfId" = :obfId`,
    { replacements: { obfId }, type: QueryTypes.SELECT }
  );
  
  for (const user of rows as AccessUser[]) {
    await createNotification({
      userId: user.userId,
      obfId,
      type,
      message
    });
  }
}

export async function markNotificationsAsRead(userId: string, obfId: string) {
  await sequelize.query(
    `UPDATE notifications 
     SET read = true, updated_at = NOW()
     WHERE user_id = :userId AND obf_id = :obfId AND read = false`,
    {
      replacements: { userId, obfId },
      type: QueryTypes.UPDATE
    }
  );
}

export async function getUnreadNotifications(userId: string) {
  return await sequelize.query(
    `SELECT n.*, o.project_name, o.project_code
     FROM notifications n
     JOIN obf o ON n.obf_id = o.id
     WHERE n.user_id = :userId AND n.read = false
     ORDER BY n.created_at DESC`,
    {
      replacements: { userId },
      type: QueryTypes.SELECT
    }
  );
} 