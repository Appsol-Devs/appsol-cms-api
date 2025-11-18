import { UserController } from "../../../adapters/controllers/users_controller/UserController.js";
import express from "express";
import { AuthMiddleware } from "../middleware/AuthMiddleware.js";
import { INTERFACE_TYPE } from "../../../utils/constants/bindings.js";
import Permissions from "../../../utils/constants/permissions.js";
import { container } from "../../../inversify/container.js";

const controller = container.get<UserController>(INTERFACE_TYPE.UserController);
const authMiddleware = container.get<AuthMiddleware>(
  INTERFACE_TYPE.AuthMiddleware
);

const router = express.Router();

router.get(
  "/api/users",
  authMiddleware.authenticateToken.bind(authMiddleware),
  authMiddleware.checkPermission(Permissions.VIEW_USERS).bind(authMiddleware),
  controller.getAllUsers.bind(controller)
);
router
  .route("/api/users/:id")
  .get(
    authMiddleware.authenticateToken.bind(authMiddleware),
    authMiddleware.checkPermission(Permissions.VIEW_USER).bind(authMiddleware),
    controller.getAUser.bind(controller)
  )
  .put(
    authMiddleware.authenticateToken.bind(authMiddleware),
    authMiddleware
      .checkPermission(Permissions.UPDATE_USER)
      .bind(authMiddleware),
    controller.updateUser.bind(controller)
  );
router.delete(
  "/api/users/:id",
  authMiddleware.authenticateToken.bind(authMiddleware),
  authMiddleware.checkPermission(Permissions.DELETE_USER).bind(authMiddleware),
  controller.deleteUser.bind(controller)
);
router.post(
  "/api/users",
  authMiddleware.authenticateToken.bind(authMiddleware),
  authMiddleware.checkPermission(Permissions.CREATE_USER).bind(authMiddleware),
  controller.addUser.bind(controller)
);

export default router;
