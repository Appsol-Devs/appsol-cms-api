import { injectable } from "inversify";
import type { ISubscriptionType } from "../../../../entities/index.js";
import {
  SubscriptionTypeModel,
  SubscriptionTypeModelMapper,
} from "../../models/lookups/subscriptionType.js";
import { BaseLookupRepoistoryImpl } from "../base/BaseLookupRepositoryImpl.js";

@injectable()
export class SubscriptionTypeRepositoryImpl extends BaseLookupRepoistoryImpl<ISubscriptionType> {
  constructor() {
    super(SubscriptionTypeModel, SubscriptionTypeModelMapper);
  }
}
