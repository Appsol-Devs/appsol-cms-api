import { INTERFACE_TYPE } from "../../../utils/constants/bindings.js";
import Permissions from "../../../utils/constants/permissions.js";

import { container } from "../../../inversify/container.js";
import type { AuthMiddleware } from "../middleware/AuthMiddleware.js";
import { BaseRouter } from "./BaseRoutes.js";
import type { SubscriptionReminderController } from "../../../adapters/controllers/index.js";
import { baseQuerySchema } from "../../../validation/baseSchema.js";

const controller = container.get<SubscriptionReminderController>(
  INTERFACE_TYPE.SubscriptionReminderController
);
const authMiddleware = container.get<AuthMiddleware>(
  INTERFACE_TYPE.AuthMiddleware
);

const permissionMap = {
  create: "N/A",
  read: Permissions.VIEW_SUBSCRIPTION_REMINDERS,
  readOne: Permissions.VIEW_SUBSCRIPTION_REMINDER,
  update: "N/A",
  delete: "N/A",
};

const router = new BaseRouter(
  controller,
  authMiddleware,
  "/api/subscription_reminders",
  permissionMap,
  baseQuerySchema
).register();

// Reminders for a single customer
router.get(
  "/customers/:customerId/reminders",
  authMiddleware.authenticateToken.bind(authMiddleware),
  authMiddleware.checkPermission(Permissions.VIEW_SUBSCRIPTION_REMINDERS),
  controller.getRemindersByCustomer.bind(controller)
);

export default router;
