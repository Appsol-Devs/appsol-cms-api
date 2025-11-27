import { INTERFACE_TYPE } from "../../../../utils/constants/bindings.js";
import { BaseLookupRouter } from "./BaseLookupRouter.js";
import Permissions from "../../../../utils/constants/permissions.js";

import type { AuthMiddleware } from "../../middleware/AuthMiddleware.js";
import type { Container } from "inversify";
import type { Router } from "express";
import { SubscriptionTypeController } from "../../../../adapters/controllers/lookups/SubscriptionTypeController.js";
import { subscriptionTypeSchema } from "../../../../validation/lookupShema.js";

export const createSubscriptionTypeRoutes = (container: Container): Router => {
  const controller = container.get<SubscriptionTypeController>(
    INTERFACE_TYPE.SubscriptionTypeController
  );
  const authMiddleware = container.get<AuthMiddleware>(
    INTERFACE_TYPE.AuthMiddleware
  );

  const permissionMap = {
    create: Permissions.CREATE_SUBSCRIPTION_TYPE,
    read: Permissions.VIEW_SUBSCRIPTION_TYPES,
    readOne: Permissions.VIEW_SUBSCRIPTION_TYPE,
    update: Permissions.UPDATE_SUBSCRIPTION_TYPE,
    delete: Permissions.DELETE_SUBSCRIPTION_TYPE,
  };

  const router = new BaseLookupRouter(
    controller,
    authMiddleware,
    "/api/subscription_types",
    permissionMap,
    subscriptionTypeSchema
  ).register();

  return router;
};

export default createSubscriptionTypeRoutes;
