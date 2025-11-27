import { INTERFACE_TYPE } from "../../../utils/constants/bindings.js";
import Permissions from "../../../utils/constants/permissions.js";

import type { Container } from "inversify";
import type { AuthMiddleware } from "../middleware/AuthMiddleware.js";
import { BaseRouter } from "./BaseRoutes.js";
import type { CustomerOutreachController } from "../../../adapters/controllers/customer_outreach/CustomerOutreachController.js";
import { customerOutreachSchema } from "../../../validation/customerOutreachSchema.js";

export const createCustomerOutreachRoutes = (container: Container) => {
  const controller = container.get<CustomerOutreachController>(
    INTERFACE_TYPE.CustomerOutreachController
  );
  const authMiddleware = container.get<AuthMiddleware>(
    INTERFACE_TYPE.AuthMiddleware
  );

  const permissionMap = {
    create: Permissions.CREATE_CUSTOMER_OUTREACH,
    read: Permissions.VIEW_CUSTOMER_OUTREACHS,
    readOne: Permissions.VIEW_CUSTOMER_OUTREACH,
    update: Permissions.UPDATE_CUSTOMER_OUTREACH,
    delete: Permissions.DELETE_CUSTOMER_OUTREACH,
  };

  const router = new BaseRouter(
    controller,
    authMiddleware,
    "/api/customer_outreachs",
    permissionMap,
    customerOutreachSchema
  ).register();

  return router;
};

export default createCustomerOutreachRoutes;
