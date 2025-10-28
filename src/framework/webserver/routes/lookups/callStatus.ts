import type { Container } from "inversify";
import { INTERFACE_TYPE } from "../../../../utils/constants/bindings.js";
import { BaseLookupRouter } from "./BaseLookupRouter.js";
import Permissions from "../../../../utils/constants/permissions.js";
import { CallStatusController } from "../../../../adapters/controllers/lookups/CallStatusController.js";
import type { AuthMiddleware } from "../../middleware/AuthMiddleware.js";
import { container } from "../../container.js";
import {
  type IBaseLookupInteractor,
  CallStatusInteractorImpl,
} from "../../../../application/interactors/index.js";
import type { ICallStatus } from "../../../../entities/lookups/index.js";
import {
  CallStatusRepositoryImpl,
  type IBaseLookupRepository,
} from "../../../mongodb/index.js";

container
  .bind<IBaseLookupRepository<ICallStatus>>(
    INTERFACE_TYPE.CallStatusRepositoryImpl
  )
  .to(CallStatusRepositoryImpl);

container
  .bind<IBaseLookupInteractor<ICallStatus>>(
    INTERFACE_TYPE.CallStatusInteractorImpl
  )
  .to(CallStatusInteractorImpl);

container
  .bind<CallStatusController>(INTERFACE_TYPE.CallStatusController)
  .to(CallStatusController);

const controller = container.get<CallStatusController>(
  INTERFACE_TYPE.CallStatusController
);
const authMiddleware = container.get<AuthMiddleware>(
  INTERFACE_TYPE.AuthMiddleware
);

const permissionMap = {
  create: Permissions.CREATE_CALL_STATUS,
  read: Permissions.VIEW_ALL_CALL_STATUSS,
  readOne: Permissions.VIEW_CALL_STATUS,
  update: Permissions.UPDATE_CALL_STATUS,
  delete: Permissions.DELETE_CALL_STATUS,
};

const router = new BaseLookupRouter(
  controller,
  authMiddleware,
  "/api/callStatuses",
  permissionMap
).register();

export default router;
