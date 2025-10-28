import type { Container } from "inversify";
import { INTERFACE_TYPE } from "../../../../utils/constants/bindings.js";
import { BaseLookupRouter } from "./BaseLookupRouter.js";
import Permissions from "../../../../utils/constants/permissions.js";

import type { AuthMiddleware } from "../../middleware/AuthMiddleware.js";
import { container } from "../../container.js";
import {
  type IBaseLookupInteractor,
  SubscriptionTypeInteractorImpl,
} from "../../../../application/interactors/index.js";
import type { ISubscriptionType } from "../../../../entities/lookups/index.js";
import {
  SubscriptionTypeRepositoryImpl,
  type IBaseLookupRepository,
} from "../../../mongodb/index.js";
import { SubscriptionTypeController } from "../../../../adapters/controllers/lookups/SubscriptionTypeController.js";
import { subscriptionTypeSchema } from "../../../../validation/lookupShema.js";

container
  .bind<IBaseLookupRepository<ISubscriptionType>>(
    INTERFACE_TYPE.SubscriptionTypeRepositoryImpl
  )
  .to(SubscriptionTypeRepositoryImpl);

container
  .bind<IBaseLookupInteractor<ISubscriptionType>>(
    INTERFACE_TYPE.SubscriptionTypeInteractorImpl
  )
  .to(SubscriptionTypeInteractorImpl);

container
  .bind<SubscriptionTypeController>(INTERFACE_TYPE.SubscriptionTypeController)
  .to(SubscriptionTypeController);

const controller = container.get<SubscriptionTypeController>(
  INTERFACE_TYPE.SubscriptionTypeController
);
const authMiddleware = container.get<AuthMiddleware>(
  INTERFACE_TYPE.AuthMiddleware
);

const permissionMap = {
  create: Permissions.CREATE_SUBSCRIPTION_TYPE,
  read: Permissions.VIEW_SUBSCRIPTION_TYPES,
  readOne: Permissions.VIEW_SUBSCRIPTION_TYPE,
  update: Permissions.UPDATE_SUBSCRIPTION_TYPE,
  delete: Permissions.DELETE_SUBSCRIPTION_TYPE,
};

const router = new BaseLookupRouter(
  controller,
  authMiddleware,
  "/api/subscriptionTypes",
  permissionMap,
  subscriptionTypeSchema
).register();

export default router;
