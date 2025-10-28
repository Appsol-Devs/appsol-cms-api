import type { Container } from "inversify";
import { INTERFACE_TYPE } from "../../../../utils/constants/bindings.js";
import { BaseLookupRouter } from "./BaseLookupRouter.js";
import Permissions from "../../../../utils/constants/permissions.js";
import { ComplaintCategoryController } from "../../../../adapters/controllers/lookups/ComplaintCategoryController.js";
import type { AuthMiddleware } from "../../middleware/AuthMiddleware.js";
import { container } from "../../container.js";
import {
  type IBaseLookupInteractor,
  ComplaintCategoryInteractorImpl,
} from "../../../../application/interactors/index.js";
import type { IComplaintCategory } from "../../../../entities/lookups/index.js";
import {
  ComplaintCategoryRepositoryImpl,
  type IBaseLookupRepository,
} from "../../../mongodb/index.js";

container
  .bind<IBaseLookupRepository<IComplaintCategory>>(
    INTERFACE_TYPE.ComplaintCategoryRepositoryImpl
  )
  .to(ComplaintCategoryRepositoryImpl);

container
  .bind<IBaseLookupInteractor<IComplaintCategory>>(
    INTERFACE_TYPE.ComplaintCategoryInteractorImpl
  )
  .to(ComplaintCategoryInteractorImpl);

container
  .bind<ComplaintCategoryController>(INTERFACE_TYPE.ComplaintCategoryController)
  .to(ComplaintCategoryController);

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
  "/api/complaintCategories",
  permissionMap
).register();

export default router;
