import express from "express";
import { Container } from "inversify";
import { INTERFACE_TYPE, Permissions } from "../../../utils/constants/index.js";
import { AuthMiddleware } from "../middleware/AuthMiddleware.js";

import { type IAuthService } from "../../services/auth/IAuthService.js";
import { AuthServiceImpl } from "../../services/auth/authService.js";
import { RoleController } from "../../../adapters/controllers/role_controller/RoleController.js";
import {
  type IRoleInteractor,
  RoleInteractorImpl,
} from "../../../application/interactors/index.js";
import {
  type IRoleRepository,
  RoleRepositoryImpl,
} from "../../mongodb/index.js";

const container = new Container();

container
  .bind<IRoleRepository>(INTERFACE_TYPE.RoleRepositoryImpl)
  .to(RoleRepositoryImpl);

container
  .bind<IAuthService>(INTERFACE_TYPE.AuthServiceImpl)
  .to(AuthServiceImpl);

container
  .bind<AuthMiddleware>(INTERFACE_TYPE.AuthMiddleware)
  .to(AuthMiddleware);

container
  .bind<IRoleInteractor>(INTERFACE_TYPE.RoleInteractorImpl)
  .to(RoleInteractorImpl);

container.bind<RoleController>(RoleController).to(RoleController);

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
