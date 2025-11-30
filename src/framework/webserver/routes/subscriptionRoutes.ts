import { INTERFACE_TYPE } from "../../../utils/constants/bindings.js";
import Permissions from "../../../utils/constants/permissions.js";

import type { Container } from "inversify";
import type { AuthMiddleware } from "../middleware/AuthMiddleware.js";
import { BaseRouter } from "./BaseRoutes.js";
import type { SubscriptionController } from "../../../adapters/controllers/index.js";
import { baseQuerySchema } from "../../../validation/baseSchema.js";
import type { Router } from "express";
import { ApiKeyMiddleware } from "../middleware/ApiKeyMiddleware.js";

export const createSubscriptionRoutes = (container: Container): Router => {
  const controller = container.get<SubscriptionController>(
    INTERFACE_TYPE.SubscriptionController
  );
  const authMiddleware = container.get<AuthMiddleware>(
    INTERFACE_TYPE.AuthMiddleware
  );

  const permissionMap = {
    create: Permissions.CREATE_SUBSCRIPTION,
    read: Permissions.VIEW_SUBSCRIPTIONS,
    readOne: Permissions.VIEW_SUBSCRIPTION,
    update: Permissions.UPDATE_SUBSCRIPTION,
    delete: Permissions.DELETE_SUBSCRIPTION,
  };

  const router = new BaseRouter(
    controller,
    authMiddleware,
    "/api/subscriptions",
    permissionMap,
    baseQuerySchema
  ).register();

  return router;
};

export default createSubscriptionRoutes;
