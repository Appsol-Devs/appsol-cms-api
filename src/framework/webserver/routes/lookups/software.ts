import { INTERFACE_TYPE } from "../../../../utils/constants/bindings.js";
import { BaseLookupRouter } from "./BaseLookupRouter.js";
import Permissions from "../../../../utils/constants/permissions.js";
import { SoftwareController } from "../../../../adapters/controllers/lookups/SoftwareController.js";
import type { AuthMiddleware } from "../../middleware/AuthMiddleware.js";
import { container } from "../../../../inversify/container.js";

const controller = container.get<SoftwareController>(
  INTERFACE_TYPE.SoftwareController
);
const authMiddleware = container.get<AuthMiddleware>(
  INTERFACE_TYPE.AuthMiddleware
);

const permissionMap = {
  create: Permissions.CREATE_SOFTWARE,
  read: Permissions.VIEW_SOFTWARES,
  readOne: Permissions.VIEW_SOFTWARE,
  update: Permissions.UPDATE_SOFTWARE,
  delete: Permissions.DELETE_SOFTWARE,
};

const router = new BaseLookupRouter(
  controller,
  authMiddleware,
  "/api/softwares",
  permissionMap
).register();

export default router;
