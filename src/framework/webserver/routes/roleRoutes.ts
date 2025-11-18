import express from "express";
import { INTERFACE_TYPE, Permissions } from "../../../utils/constants/index.js";
import { AuthMiddleware } from "../middleware/AuthMiddleware.js";

import { RoleController } from "../../../adapters/controllers/role_controller/RoleController.js";
import { container } from "../../../inversify/container.js";

const controller = container.get<RoleController>(RoleController);

const authMiddleware = container.get<AuthMiddleware>(
  INTERFACE_TYPE.AuthMiddleware
);

const router = express.Router();

router
  .route("/api/roles")
  .get(
    authMiddleware.authenticateToken.bind(authMiddleware),
    authMiddleware.checkPermission(Permissions.VIEW_ROLES).bind(authMiddleware),
    controller.getAllRoles.bind(controller)
  )
  .post(
    authMiddleware.authenticateToken.bind(authMiddleware),
    authMiddleware
      .checkPermission(Permissions.CREATE_ROLE)
      .bind(authMiddleware),
    controller.addRole.bind(controller)
  );
router
  .route("/api/roles/:id")
  .get(
    authMiddleware.authenticateToken.bind(authMiddleware),
    authMiddleware.checkPermission(Permissions.VIEW_ROLE).bind(authMiddleware),
    controller.getARole.bind(controller)
  )
  .put(
    authMiddleware.authenticateToken.bind(authMiddleware),
    authMiddleware
      .checkPermission(Permissions.UPDATE_ROLE)
      .bind(authMiddleware),
    controller.updateRole.bind(controller)
  )
  .delete(
    authMiddleware.authenticateToken.bind(authMiddleware),
    authMiddleware
      .checkPermission(Permissions.DELETE_ROLE)
      .bind(authMiddleware),
    controller.deleteRole.bind(controller)
  );
export default router;
