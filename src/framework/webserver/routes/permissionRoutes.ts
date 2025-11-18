import express from "express";
import { INTERFACE_TYPE, Permissions } from "../../../utils/constants/index.js";
import { AuthMiddleware } from "../middleware/AuthMiddleware.js";

import { PermissionController } from "../../../adapters/controllers/permission_controller/PermissionController.js";
import { container } from "../../../inversify/container.js";

const controller = container.get<PermissionController>(PermissionController);

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

router.post("/api/permissions", controller.uploadPermissions.bind(controller));

export default router;
