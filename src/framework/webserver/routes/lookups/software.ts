import type { Container } from "inversify";
import { INTERFACE_TYPE } from "../../../../utils/constants/bindings.js";
import { BaseLookupRouter } from "./BaseLookupRouter.js";
import Permissions from "../../../../utils/constants/permissions.js";
import { SoftwareController } from "../../../../adapters/controllers/lookups/SoftwareController.js";
import type { AuthMiddleware } from "../../middleware/AuthMiddleware.js";
import { container } from "../../container.js";
import {
  type IBaseLookupInteractor,
  SoftwareInteractorImpl,
} from "../../../../application/interactors/index.js";
import type { ISoftware } from "../../../../entities/lookups/index.js";
import {
  SoftwareRepositoryImpl,
  type IBaseLookupRepository,
} from "../../../mongodb/index.js";

container
  .bind<IBaseLookupRepository<ISoftware>>(INTERFACE_TYPE.SoftwareRepositoryImpl)
  .to(SoftwareRepositoryImpl);

container
  .bind<IBaseLookupInteractor<ISoftware>>(INTERFACE_TYPE.SoftwareInteractorImpl)
  .to(SoftwareInteractorImpl);

container
  .bind<SoftwareController>(INTERFACE_TYPE.SoftwareController)
  .to(SoftwareController);

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
