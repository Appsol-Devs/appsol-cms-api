import { INTERFACE_TYPE } from "../../../../utils/constants/bindings.js";
import { BaseLookupRouter } from "./BaseLookupRouter.js";
import Permissions from "../../../../utils/constants/permissions.js";
import { LeadStatusController } from "../../../../adapters/controllers/lookups/LeadStatusController.js";
import type { AuthMiddleware } from "../../middleware/AuthMiddleware.js";
import { container } from "../../../../inversify/container.js";

const controller = container.get<LeadStatusController>(
  INTERFACE_TYPE.LeadStatusController
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
  "/api/leadStatuses",
  permissionMap
).register();

export default router;
