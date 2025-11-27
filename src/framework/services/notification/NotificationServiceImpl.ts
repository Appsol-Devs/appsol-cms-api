import { injectable, inject } from "inversify";
import type { INotification } from "../../../entities/Notification.js";
import { INTERFACE_TYPE } from "../../../utils/constants/index.js";
import type { NotificationRepositoryImpl } from "../../mongodb/index.js";
import type { INotificationService } from "./INotificationService.js";
import type { Server as IOServer } from "socket.io";
import type { ILogger } from "../../logging/ILogger.js";

@injectable()
export class NotificationServiceImpl implements INotificationService {
  constructor(
    @inject(INTERFACE_TYPE.NotificationRepositoryImpl)
    private repo: NotificationRepositoryImpl,
    @inject(INTERFACE_TYPE.SocketIO) private io: IOServer,
    @inject(INTERFACE_TYPE.Logger) private logger: ILogger
  ) {
    this.repo = repo;
    this.io = io;
    this.logger = logger;
  }
  async create(payload: Partial<INotification>): Promise<INotification> {
    const n = await this.repo.create({
      isRead: false,
      createdAt: new Date(),
      ...payload,
    });

    // Emit real-time event to recipient room: `user:${userId}`
    try {
      if (this.io && n.userId) {
        this.io.to(`user:${n.userId}`).emit("notification:new", {
          id: n._id,
          message: n.message,
          link: n.link,
          isRead: n.isRead,
          targetEntityType: n.targetEntityType,
          targetEntityId: n.targetEntityId,
          createdAt: n.createdAt,
        });
      }
    } catch (err) {
      this.logger.error("NotificationService emit error:", err);
    }

    return n;
  }
  async markAsRead(
    notificationId: string,
    userId?: string
  ): Promise<INotification> {
    const updated = await this.repo.update(notificationId, { isRead: true });
    if (this.io && updated && userId) {
      this.io.to(userId ? `user:${userId}` : "all").emit("notification:read", {
        id: notificationId,
      });
    }
    return updated;
  }
  async markAllRead(userId?: string): Promise<number | null | undefined> {
    const affected = await this.repo.updateMany(
      { userId, isRead: false },
      { isRead: true }
    );
    if (this.io) {
      this.io
        .to(userId ? `user:${userId}` : "all")
        .emit("notification:markAllRead", { count: affected });
    }
    return affected;
  }
}
