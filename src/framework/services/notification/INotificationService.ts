import type { INotification } from "../../../entities/Notification.js";

export interface INotificationService {
  create(payload: Partial<INotification>): Promise<INotification>;
  markAsRead(notificationId: string, userId?: string): Promise<INotification>;
  markAllRead(userId?: string): Promise<number | null | undefined>;
}
