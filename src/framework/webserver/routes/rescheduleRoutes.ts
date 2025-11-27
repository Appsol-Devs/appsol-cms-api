import { INTERFACE_TYPE } from "../../../utils/constants/bindings.js";
import Permissions from "../../../utils/constants/permissions.js";

import type { Container } from "inversify";
import type { AuthMiddleware } from "../middleware/AuthMiddleware.js";
import { BaseRouter } from "./BaseRoutes.js";
import type { RescheduleController } from "../../../adapters/controllers/reschedule/RescheduleController.js";
import { rescheduleSchema } from "../../../validation/rescheduleSchema.js";
import type { Router } from "express";

export const createRescheduleRoutes = (container: Container): Router => {
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

  router.get(
    "/api/reschedules/by-entity/:type/:id",
    authMiddleware.authenticateToken.bind(authMiddleware),
    authMiddleware
      .checkPermission(Permissions.VIEW_RESCHEDULES)
      .bind(authMiddleware),
    controller.getAllReschedulesForEntity.bind(controller)
  );

  return router;
};

export default createRescheduleRoutes;
