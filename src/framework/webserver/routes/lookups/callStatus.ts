import { INTERFACE_TYPE } from "../../../../utils/constants/bindings.js";
import { BaseLookupRouter } from "./BaseLookupRouter.js";
import Permissions from "../../../../utils/constants/permissions.js";
import { CallStatusController } from "../../../../adapters/controllers/lookups/CallStatusController.js";
import type { AuthMiddleware } from "../../middleware/AuthMiddleware.js";
import type { Container } from "inversify";
import type { Router } from "express";

export const createCallStatusRoutes = (container: Container): Router => {
  const controller = container.get<CallStatusController>(
    INTERFACE_TYPE.CallStatusController
  );
  const authMiddleware = container.get<AuthMiddleware>(
    INTERFACE_TYPE.AuthMiddleware
  );

  const permissionMap = {
    create: Permissions.CREATE_CALL_STATUS,
    read: Permissions.VIEW_ALL_CALL_STATUSS,
    readOne: Permissions.VIEW_CALL_STATUS,
    update: Permissions.UPDATE_CALL_STATUS,
    delete: Permissions.DELETE_CALL_STATUS,
  };

  const router = new BaseLookupRouter(
    controller,
    authMiddleware,
    "/api/call_statuses",
    permissionMap
  ).register();

  return router;
};

export default createCallStatusRoutes;
