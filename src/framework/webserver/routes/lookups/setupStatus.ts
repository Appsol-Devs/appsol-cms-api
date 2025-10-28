import type { Container } from "inversify";
import { INTERFACE_TYPE } from "../../../../utils/constants/bindings.js";
import { BaseLookupRouter } from "./BaseLookupRouter.js";
import Permissions from "../../../../utils/constants/permissions.js";
import { SetupStatusController } from "../../../../adapters/controllers/lookups/SetupStatusController.js";
import type { AuthMiddleware } from "../../middleware/AuthMiddleware.js";
import { container } from "../../container.js";
import {
  type IBaseLookupInteractor,
  SetupStatusInteractorImpl,
} from "../../../../application/interactors/index.js";
import type { ISetupStatus } from "../../../../entities/lookups/index.js";
import {
  SetupStatusRepositoryImpl,
  type IBaseLookupRepository,
} from "../../../mongodb/index.js";

container
  .bind<IBaseLookupRepository<ISetupStatus>>(
    INTERFACE_TYPE.SetupStatusRepositoryImpl
  )
  .to(SetupStatusRepositoryImpl);

container
  .bind<IBaseLookupInteractor<ISetupStatus>>(
    INTERFACE_TYPE.SetupStatusInteractorImpl
  )
  .to(SetupStatusInteractorImpl);

container
  .bind<SetupStatusController>(INTERFACE_TYPE.SetupStatusController)
  .to(SetupStatusController);

const controller = container.get<SetupStatusController>(
  INTERFACE_TYPE.SetupStatusController
);
const authMiddleware = container.get<AuthMiddleware>(
  INTERFACE_TYPE.AuthMiddleware
);

const permissionMap = {
  create: Permissions.CREATE_SETUP_STAUTS,
  read: Permissions.VIEW_ALL_SETUP_STAUTS,
  readOne: Permissions.VIEW_SETUP_STAUTS,
  update: Permissions.UPDATE_SETUP_STAUTS,
  delete: Permissions.DELETE_SETUP_STAUTS,
};

const router = new BaseLookupRouter(
  controller,
  authMiddleware,
  "/api/setupStatuses",
  permissionMap
).register();

export default router;
