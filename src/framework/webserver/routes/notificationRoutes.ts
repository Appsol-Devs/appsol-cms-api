import { INTERFACE_TYPE } from "../../../utils/constants/bindings.js";
import Permissions from "../../../utils/constants/permissions.js";

import { container } from "../../../inversify/container.js";
import type { AuthMiddleware } from "../middleware/AuthMiddleware.js";
import { BaseRouter } from "./BaseRoutes.js";
import type { NotificationController } from "../../../adapters/controllers/index.js";
import { baseQuerySchema } from "../../../validation/baseSchema.js";

const controller = container.get<NotificationController>(
  INTERFACE_TYPE.NotificationController
);
const authMiddleware = container.get<AuthMiddleware>(
  INTERFACE_TYPE.AuthMiddleware
);

const permissionMap = {
  create: Permissions.CREATE_NOTIFICATION,
  read: Permissions.VIEW_NOTIFICATIONS,
  readOne: Permissions.VIEW_NOTIFICATION,
  update: "N/A",
  delete: "N/A",
};

const router = new BaseRouter(
  controller,
  authMiddleware,
  "/api/notifications",
  permissionMap,
  baseQuerySchema
).register();

// extra routes for Fetching all Notifications for a specific entity
router.put(
  "/api/notifications/:id/read",
  authMiddleware.authenticateToken.bind(authMiddleware),
  authMiddleware
    .checkPermission(Permissions.MARK_NOTIFICATION_AS_READ)
    .bind(authMiddleware),
  controller.markSingleMessageAsRead.bind(controller)
);
router.put(
  "/api/notifications/mark-all-read",
  authMiddleware.authenticateToken.bind(authMiddleware),
  authMiddleware
    .checkPermission(Permissions.MARK_ALL_NOTIFICATIONS_AS_READ)
    .bind(authMiddleware),
  controller.markAllNotificationsAsRead.bind(controller)
);

export default router;
