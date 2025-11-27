import { INTERFACE_TYPE } from "../../../../utils/constants/bindings.js";
import { BaseLookupRouter } from "./BaseLookupRouter.js";
import Permissions from "../../../../utils/constants/permissions.js";
import { ComplaintCategoryController } from "../../../../adapters/controllers/lookups/ComplaintCategoryController.js";
import type { AuthMiddleware } from "../../middleware/AuthMiddleware.js";
import type { Container } from "inversify";
import type { Router } from "express";

export const createComplaintCategoryRoutes = (container: Container): Router => {
  const controller = container.get<ComplaintCategoryController>(
    INTERFACE_TYPE.ComplaintCategoryController
  );
  const authMiddleware = container.get<AuthMiddleware>(
    INTERFACE_TYPE.AuthMiddleware
  );

  const permissionMap = {
    create: Permissions.CREATE_COMPLAINT_CATEGORY,
    read: Permissions.VIEW_COMPLAINT_CATEGORIES,
    readOne: Permissions.VIEW_COMPLAINT_CATEGORY,
    update: Permissions.UPDATE_COMPLAINT_CATEGORY,
    delete: Permissions.DELETE_COMPLAINT_CATEGORY,
  };

  const router = new BaseLookupRouter(
    controller,
    authMiddleware,
    "/api/complaint_categories",
    permissionMap
  ).register();

  return router;
};

export default createComplaintCategoryRoutes;
