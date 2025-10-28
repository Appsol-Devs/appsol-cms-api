import { SubscriptionTypeRepositoryImpl } from "./../../../framework/mongodb/repositories/lookups/SubscriptionTypeRepoImpl.js";
import { inject } from "inversify";
import type { ISubscriptionType } from "../../../entities/index.js";
import { BaseLookupInteractorImpl } from "./base/BaseLookupInteractorImpl.js";
import { INTERFACE_TYPE } from "../../../utils/constants/bindings.js";

export class SubscriptionTypeInteractorImpl extends BaseLookupInteractorImpl<ISubscriptionType> {
  constructor(
    @inject(INTERFACE_TYPE.SubscriptionTypeRepositoryImpl)
    subscriptionTypeRepositoryImpl: SubscriptionTypeRepositoryImpl
  ) {
    super(subscriptionTypeRepositoryImpl);
  }
}
