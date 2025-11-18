import { INTERFACE_TYPE } from "../../../../utils/constants/bindings.js";
import { BaseLookupRouter } from "./BaseLookupRouter.js";
import Permissions from "../../../../utils/constants/permissions.js";
import { OutreachTypeController } from "../../../../adapters/controllers/lookups/OutreachTypeController.js";
import type { AuthMiddleware } from "../../middleware/AuthMiddleware.js";
import { container } from "../../../../inversify/container.js";

const controller = container.get<OutreachTypeController>(
  INTERFACE_TYPE.OutreachTypeController
);
const authMiddleware = container.get<AuthMiddleware>(
  INTERFACE_TYPE.AuthMiddleware
);

const permissionMap = {
  create: Permissions.CREATE_OUTREACH_TYPE,
  read: Permissions.VIEW_OUTREACH_TYPES,
  readOne: Permissions.VIEW_OUTREACH_TYPE,
  update: Permissions.UPDATE_OUTREACH_TYPE,
  delete: Permissions.DELETE_OUTREACH_TYPE,
};

const router = new BaseLookupRouter(
  controller,
  authMiddleware,
  "/api/outreach_types",
  permissionMap
).register();

export default router;
