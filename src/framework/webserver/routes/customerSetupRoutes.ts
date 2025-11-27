import { INTERFACE_TYPE } from "../../../utils/constants/bindings.js";
import Permissions from "../../../utils/constants/permissions.js";

import type { Container } from "inversify";
import type { Router } from "express";
import type { AuthMiddleware } from "../middleware/AuthMiddleware.js";
import { BaseRouter } from "./BaseRoutes.js";
import type { CustomerSetupController } from "../../../adapters/controllers/index.js";
import { customerSetupSchema } from "../../../validation/customerSetupSchema.js";

export const createCustomerSetupRoutes = (container: Container): Router => {
  const controller = container.get<CustomerSetupController>(
    INTERFACE_TYPE.CustomerSetupController
  );
  const authMiddleware = container.get<AuthMiddleware>(
    INTERFACE_TYPE.AuthMiddleware
  );

  const permissionMap = {
    create: Permissions.CREATE_CUSTOMER_SETUP,
    read: Permissions.VIEW_CUSTOMER_SETUPS,
    readOne: Permissions.VIEW_CUSTOMER_SETUP,
    update: Permissions.UPDATE_CUSTOMER_SETUP,
    delete: Permissions.DELETE_CUSTOMER_SETUP,
  };

  const router = new BaseRouter(
    controller,
    authMiddleware,
    "/api/customer_setups",
    permissionMap,
    customerSetupSchema
  ).register();

  return router;
};

export default createCustomerSetupRoutes;
