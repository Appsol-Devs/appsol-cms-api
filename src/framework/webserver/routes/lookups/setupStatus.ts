import { INTERFACE_TYPE } from "../../../../utils/constants/bindings.js";
import { BaseLookupRouter } from "./BaseLookupRouter.js";
import Permissions from "../../../../utils/constants/permissions.js";
import { SetupStatusController } from "../../../../adapters/controllers/lookups/SetupStatusController.js";
import type { AuthMiddleware } from "../../middleware/AuthMiddleware.js";
import type { Container } from "inversify";
import type { Router } from "express";

export const createSetupStatusRoutes = (container: Container): Router => {
  const controller = container.get<SetupStatusController>(
    INTERFACE_TYPE.SetupStatusController
  );
  const authMiddleware = container.get<AuthMiddleware>(
    INTERFACE_TYPE.AuthMiddleware
  );

  const permissionMap = {
    create: Permissions.CREATE_SETUP_STAUTS,
    read: Permissions.VIEW_ALL_SETUP_STAUTS,
    readOne: Permissions.VIEW_SETUP_STAUTS,
    update: Permissions.UPDATE_SETUP_STAUTS,
    delete: Permissions.DELETE_SETUP_STAUTS,
  };

  const router = new BaseLookupRouter(
    controller,
    authMiddleware,
    "/api/setup_statuses",
    permissionMap
  ).register();

  return router;
};

export default createSetupStatusRoutes;
