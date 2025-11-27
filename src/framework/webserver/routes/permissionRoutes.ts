import express from "express";
import { INTERFACE_TYPE, Permissions } from "../../../utils/constants/index.js";
import type { Container } from "inversify";
import type { AuthMiddleware } from "../middleware/AuthMiddleware.js";
import type { Router } from "express";

import { PermissionController } from "../../../adapters/controllers/permission_controller/PermissionController.js";

export const createPermissionRoutes = (container: Container): Router => {
  const controller = container.get<PermissionController>(
    INTERFACE_TYPE.PermissionController
  );

  const authMiddleware = container.get<AuthMiddleware>(
    INTERFACE_TYPE.AuthMiddleware
  );

  const router = express.Router();

  router.get(
    "/api/permissions",
    authMiddleware.authenticateToken.bind(authMiddleware),
    authMiddleware
      .checkPermission(Permissions.VIEW_PERMISSIONS)
      .bind(authMiddleware),
    controller.getAllPermissions.bind(controller)
  );

  router.post(
    "/api/permissions",
    controller.uploadPermissions.bind(controller)
  );

  return router;
};

export default createPermissionRoutes;
