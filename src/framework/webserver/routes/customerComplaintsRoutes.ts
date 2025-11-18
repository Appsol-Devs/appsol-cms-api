import { INTERFACE_TYPE } from "../../../utils/constants/bindings.js";
import Permissions from "../../../utils/constants/permissions.js";

import { container } from "../../../inversify/container.js";
import type { AuthMiddleware } from "../middleware/AuthMiddleware.js";
import { BaseRouter } from "./BaseRoutes.js";
import type { CustomerComplaintController } from "../../../adapters/controllers/customer_complaints/CustomerComplaintsController.js";
import { customerComplaintSchema } from "../../../validation/customerComplaintShema.js";

const controller = container.get<CustomerComplaintController>(
  INTERFACE_TYPE.CustomerComplaintController
);
const authMiddleware = container.get<AuthMiddleware>(
  INTERFACE_TYPE.AuthMiddleware
);

const permissionMap = {
  create: Permissions.CREATE_CUSTOMER_COMPLAINT,
  read: Permissions.VIEW_CUSTOMER_COMPLAINTS,
  readOne: Permissions.VIEW_CUSTOMER_COMPLAINT,
  update: Permissions.UPDATE_CUSTOMER_COMPLAINT,
  delete: Permissions.DELETE_CUSTOMER_COMPLAINT,
};

const router = new BaseRouter(
  controller,
  authMiddleware,
  "/api/customer_complaints",
  permissionMap,
  customerComplaintSchema
).register();

export default router;
