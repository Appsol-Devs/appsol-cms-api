import express from "express";
import { Container } from "inversify";
import { INTERFACE_TYPE, Permissions } from "../../../utils/constants/index.js";
import { AuthMiddleware } from "../middleware/AuthMiddleware.js";
import { AuthServiceImpl } from "../../services/index.js";
import type { IAuthService } from "../../services/auth/IAuthService.js";

import { PermissionInteractorImpl } from "../../../application/interactors/permission/PermissionInteractorImpl.js";
import type { IPermissionInteractor } from "../../../application/interactors/index.js";
import { PermissionController } from "../../../adapters/controllers/permission_controller/PermissionController.js";
import { type ILogger, LoggerImpl } from "../../logging/index.js";
import {
  type IPermissionRepository,
  type IRoleRepository,
  PermissionRepositoryImpl,
  RoleRepositoryImpl,
} from "../../mongodb/index.js";

const container = new Container();

container.bind<ILogger>(INTERFACE_TYPE.Logger).to(LoggerImpl);

//bind role
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
  .bind<IPermissionRepository>(INTERFACE_TYPE.PermissionRepositoryImpl)
  .to(PermissionRepositoryImpl);

container
  .bind<IPermissionInteractor>(INTERFACE_TYPE.PermissionInteractorImpl)
  .to(PermissionInteractorImpl);

container
  .bind<PermissionController>(PermissionController)
  .to(PermissionController);

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
