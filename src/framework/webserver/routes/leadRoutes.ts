import { LeadsController } from "../../../adapters/controllers/leads_controller/LeadsController.js";
import {
  type IBaseLookupInteractor,
  LeadInteractorImpl,
} from "../../../application/interactors/index.js";
import type { ILead } from "../../../entities/Lead.js";
import { INTERFACE_TYPE } from "../../../utils/constants/bindings.js";
import Permissions from "../../../utils/constants/permissions.js";
import { leadQuerySchema } from "../../../validation/leadShema.js";
import {
  type IBaseLookupRepository,
  LeadRepositoryImpl,
} from "../../mongodb/index.js";
import { container } from "../container.js";
import type { AuthMiddleware } from "../middleware/AuthMiddleware.js";
import { BaseRouter } from "./BaseRoutes.js";

container
  .bind<IBaseLookupRepository<ILead>>(INTERFACE_TYPE.LeadRepositoryImpl)
  .to(LeadRepositoryImpl);

container
  .bind<IBaseLookupInteractor<ILead>>(INTERFACE_TYPE.LeadInteractorImpl)
  .to(LeadInteractorImpl);

container
  .bind<LeadsController>(INTERFACE_TYPE.LeadController)
  .to(LeadsController);

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
