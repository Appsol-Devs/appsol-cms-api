import { INTERFACE_TYPE } from "../../../utils/constants/bindings.js";
import Permissions from "../../../utils/constants/permissions.js";

import { container } from "../../../inversify/container.js";
import type { AuthMiddleware } from "../middleware/AuthMiddleware.js";
import { BaseRouter } from "./BaseRoutes.js";
import type { FeatureRequestController } from "../../../adapters/controllers/index.js";
import { featureRequestSchema } from "../../../validation/featureRequestSchema.js";

const controller = container.get<FeatureRequestController>(
  INTERFACE_TYPE.FeatureRequestController
);
const authMiddleware = container.get<AuthMiddleware>(
  INTERFACE_TYPE.AuthMiddleware
);

const permissionMap = {
  create: Permissions.CREATE_FEATURE_REQUEST,
  read: Permissions.VIEW_FEATURE_REQUESTS,
  readOne: Permissions.VIEW_FEATURE_REQUEST,
  update: Permissions.UPDATE_FEATURE_REQUEST,
  delete: Permissions.DELETE_FEATURE_REQUEST,
};

const router = new BaseRouter(
  controller,
  authMiddleware,
  "/api/feature_requests",
  permissionMap,
  featureRequestSchema
).register();

export default router;
