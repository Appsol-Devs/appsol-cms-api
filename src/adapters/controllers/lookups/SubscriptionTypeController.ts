import { inject, injectable } from "inversify";
import type { SubscriptionTypeInteractorImpl } from "../../../application/interactors/index.js";
import type { ISubscriptionType } from "../../../entities/lookups/SubscriptionType.js";
import { BaseLookupController } from "./BaseLookupController.js";
import { INTERFACE_TYPE } from "../../../utils/constants/bindings.js";

@injectable()
export class SubscriptionTypeController extends BaseLookupController<ISubscriptionType> {
  constructor(
    @inject(INTERFACE_TYPE.SubscriptionTypeInteractorImpl)
    SubscriptionTypeInteractor: SubscriptionTypeInteractorImpl
  ) {
    super(SubscriptionTypeInteractor);
  }
}
