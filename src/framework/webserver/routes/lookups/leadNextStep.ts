import type { Container } from "inversify";
import { INTERFACE_TYPE } from "../../../../utils/constants/bindings.js";
import { BaseLookupRouter } from "./BaseLookupRouter.js";
import Permissions from "../../../../utils/constants/permissions.js";
import { LeadNextStepController } from "../../../../adapters/controllers/lookups/LeadNextStepController.js";
import type { AuthMiddleware } from "../../middleware/AuthMiddleware.js";
import { container } from "../../container.js";
import {
  type IBaseLookupInteractor,
  LeadNextStepInteractorImpl,
} from "../../../../application/interactors/index.js";
import type { ILeadNextStep } from "../../../../entities/lookups/index.js";
import {
  LeadNextStepRepositoryImpl,
  type IBaseLookupRepository,
} from "../../../mongodb/index.js";

container
  .bind<IBaseLookupRepository<ILeadNextStep>>(
    INTERFACE_TYPE.LeadNextStepRepositoryImpl
  )
  .to(LeadNextStepRepositoryImpl);

container
  .bind<IBaseLookupInteractor<ILeadNextStep>>(
    INTERFACE_TYPE.LeadNextStepInteractorImpl
  )
  .to(LeadNextStepInteractorImpl);

container
  .bind<LeadNextStepController>(INTERFACE_TYPE.LeadNextStepController)
  .to(LeadNextStepController);

const controller = container.get<LeadNextStepController>(
  INTERFACE_TYPE.LeadNextStepController
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
  "/api/leadNextStepes",
  permissionMap
).register();

export default router;
