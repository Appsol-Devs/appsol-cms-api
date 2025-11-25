import { inject } from "inversify";
import type { INotification } from "../../../entities/index.js";
import { INTERFACE_TYPE } from "../../../utils/constants/bindings.js";
import { BaseInteractorImpl } from "../base/BaseInteractorImpl.js";
import type { NotificationRepositoryImpl } from "../../../framework/mongodb/repositories/index.js";

export class NotificationInteractorImpl extends BaseInteractorImpl<INotification> {
  constructor(
    @inject(INTERFACE_TYPE.NotificationRepositoryImpl)
    notificationRepositoryImpl: NotificationRepositoryImpl
  ) {
    super(notificationRepositoryImpl);
  }

  async markAllNotificationsAsRead(): Promise<number | null | undefined> {
    const result = await this.repository.updateMany(
      { isRead: false },
      { isRead: true }
    );
    return result;
  }
}
