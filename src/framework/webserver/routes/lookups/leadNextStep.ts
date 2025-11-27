import { INTERFACE_TYPE } from "../../../../utils/constants/bindings.js";
import { BaseLookupRouter } from "./BaseLookupRouter.js";
import Permissions from "../../../../utils/constants/permissions.js";
import { LeadNextStepController } from "../../../../adapters/controllers/lookups/LeadNextStepController.js";
import type { AuthMiddleware } from "../../middleware/AuthMiddleware.js";
import type { Container } from "inversify";
import type { Router } from "express";

export const createLeadNextStepRoutes = (container: Container): Router => {
  const controller = container.get<LeadNextStepController>(
    INTERFACE_TYPE.LeadNextStepController
  );
  const authMiddleware = container.get<AuthMiddleware>(
    INTERFACE_TYPE.AuthMiddleware
  );

  const permissionMap = {
    create: Permissions.CREATE_LEAD_STATUS,
    read: Permissions.VIEW_ALL_LEAD_STATUS,
    readOne: Permissions.VIEW_LEAD_STATUS,
    update: Permissions.UPDATE_LEAD_STATUS,
    delete: Permissions.DELETE_LEAD_STATUS,
  };

  const router = new BaseLookupRouter(
    controller,
    authMiddleware,
    "/api/lead_next_steps",
    permissionMap
  ).register();

  return router;
};

export default createLeadNextStepRoutes;
