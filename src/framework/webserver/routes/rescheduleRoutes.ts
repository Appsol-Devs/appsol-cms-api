import { INTERFACE_TYPE } from "../../../utils/constants/bindings.js";
import Permissions from "../../../utils/constants/permissions.js";

import { container } from "../../../inversify/container.js";
import type { AuthMiddleware } from "../middleware/AuthMiddleware.js";
import { BaseRouter } from "./BaseRoutes.js";
import type { RescheduleController } from "../../../adapters/controllers/reschedule/RescheduleController.js";
import { rescheduleSchema } from "../../../validation/rescheduleSchema.js";

const controller = container.get<RescheduleController>(
  INTERFACE_TYPE.RescheduleController
);
const authMiddleware = container.get<AuthMiddleware>(
  INTERFACE_TYPE.AuthMiddleware
);

const permissionMap = {
  create: Permissions.CREATE_RESCHEDULE,
  read: Permissions.VIEW_RESCHEDULES,
  readOne: Permissions.VIEW_RESCHEDULE,
  update: Permissions.UPDATE_RESCHEDULE,
  delete: Permissions.DELETE_RESCHEDULE,
};

const router = new BaseRouter(
  controller,
  authMiddleware,
  "/api/reschedules",
  permissionMap,
  rescheduleSchema
).register();

// extra routes for Fetching all reschedules for a specific entity
router.get(
  "by-entity/:type/:id",
  authMiddleware.authenticateToken.bind(authMiddleware),
  authMiddleware
    .checkPermission(Permissions.VIEW_RESCHEDULES)
    .bind(authMiddleware),
  controller.getAllReschedulesForEntity.bind(controller)
);

export default router;
