import { CustomersController } from "../../../adapters/controllers/customers_controller/CustomersController.js";
import { INTERFACE_TYPE } from "../../../utils/constants/bindings.js";
import Permissions from "../../../utils/constants/permissions.js";
import { customerQuerySchema } from "../../../validation/customerSchema.js";

import { container } from "../../../inversify/container.js";
import type { AuthMiddleware } from "../middleware/AuthMiddleware.js";
import { BaseRouter } from "./BaseRoutes.js";

const controller = container.get<CustomersController>(
  INTERFACE_TYPE.CustomerController
);
const authMiddleware = container.get<AuthMiddleware>(
  INTERFACE_TYPE.AuthMiddleware
);

const permissionMap = {
  create: Permissions.CREATE_CUSTOMER,
  read: Permissions.VIEW_CUSTOMERS,
  readOne: Permissions.VIEW_CUSTOMER,
  update: Permissions.UPDATE_CUSTOMER,
  delete: Permissions.DELETE_CUSTOMER,
};

const router = new BaseRouter(
  controller,
  authMiddleware,
  "/api/customers",
  permissionMap,
  customerQuerySchema
).register();

export default router;
