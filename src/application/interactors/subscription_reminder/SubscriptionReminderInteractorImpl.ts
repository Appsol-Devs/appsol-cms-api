import { inject } from "inversify";
import type { ISubscriptionReminder } from "../../../entities/index.js";
import { INTERFACE_TYPE } from "../../../utils/constants/bindings.js";
import { BaseInteractorImpl } from "../base/BaseInteractorImpl.js";
import type { SubscriptionReminderRepositoryImpl } from "../../../framework/mongodb/index.js";

export class SubscriptionReminderInteractorImpl extends BaseInteractorImpl<ISubscriptionReminder> {
  constructor(
    @inject(INTERFACE_TYPE.SubscriptionReminderRepositoryImpl)
    subscriptionReminderRepositoryImpl: SubscriptionReminderRepositoryImpl
  ) {
    super(subscriptionReminderRepositoryImpl);
  }
}
