import { LeadsController } from "../../../adapters/controllers/leads_controller/LeadsController.js";
import { INTERFACE_TYPE } from "../../../utils/constants/bindings.js";
import Permissions from "../../../utils/constants/permissions.js";
import { leadQuerySchema } from "../../../validation/leadShema.js";
import { container } from "../../../inversify/container.js";
import type { AuthMiddleware } from "../middleware/AuthMiddleware.js";
import { BaseRouter } from "./BaseRoutes.js";

const controller = container.get<LeadsController>(
  INTERFACE_TYPE.LeadController
);
const authMiddleware = container.get<AuthMiddleware>(
  INTERFACE_TYPE.AuthMiddleware
);

const permissionMap = {
  create: Permissions.CREATE_LEAD,
  read: Permissions.VIEW_LEADS,
  readOne: Permissions.VIEW_LEAD,
  update: Permissions.UPDATE_LEAD,
  delete: Permissions.DELETE_LEAD,
};

const router = new BaseRouter(
  controller,
  authMiddleware,
  "/api/leads",
  permissionMap,
  leadQuerySchema
).register();

export default router;
