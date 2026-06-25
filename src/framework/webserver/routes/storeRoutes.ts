import { INTERFACE_TYPE } from "../../../utils/constants/bindings.js";
import Permissions from "../../../utils/constants/permissions.js";
import { storeSchema } from "../../../validation/storeSchema.js";

import type { Container } from "inversify";
import type { Router } from "express";
import type { AuthMiddleware } from "../middleware/AuthMiddleware.js";
import { BaseRouter } from "./BaseRoutes.js";
import type { StoreController } from "../../../adapters/controllers/index.js";

export const createStoreRoutes = (container: Container): Router => {
  const controller = container.get<StoreController>(
    INTERFACE_TYPE.StoreController,
  );
  const authMiddleware = container.get<AuthMiddleware>(
    INTERFACE_TYPE.AuthMiddleware,
  );

  const permissionMap = {
    create: Permissions.CREATE_STORE,
    read: Permissions.VIEW_STORES,
    readOne: Permissions.VIEW_STORE,
    update: Permissions.UPDATE_STORE,
    delete: Permissions.DELETE_STORE,
  };

  const router = new BaseRouter(
    controller,
    authMiddleware,
    "/api/stores",
    permissionMap,
    storeSchema,
  ).register();

  return router;
};

export default createStoreRoutes;
