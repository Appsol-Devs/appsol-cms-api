import { inject } from "inversify";
import type { ISubscription } from "../../../entities/index.js";
import { INTERFACE_TYPE } from "../../../utils/constants/bindings.js";
import { BaseInteractorImpl } from "../base/BaseInteractorImpl.js";
import type { SubscriptionRepositoryImpl } from "../../../framework/index.js";

export class SubscriptionInteractorImpl extends BaseInteractorImpl<ISubscription> {
  constructor(
    @inject(INTERFACE_TYPE.SubscriptionRepositoryImpl)
    subscriptionRepositoryImpl: SubscriptionRepositoryImpl
  ) {
    super(subscriptionRepositoryImpl);
  }
}
