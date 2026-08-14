import { inject } from "inversify";
import type { INotification } from "../../../entities/index.js";
import { INTERFACE_TYPE } from "../../../utils/constants/bindings.js";
import { BaseInteractorImpl } from "../base/BaseInteractorImpl.js";
import type { IBaseRepository } from "../../../domain/repositories/base/IBaseRepository.js";

export class NotificationInteractorImpl extends BaseInteractorImpl<INotification> {
  constructor(
    @inject(INTERFACE_TYPE.NotificationRepositoryImpl)
    notificationRepository: IBaseRepository<INotification>,
  ) {
    super(notificationRepository as any);
  }

  async updateMany(): Promise<number | null | undefined> {
    const result = await this.repository.updateMany(
      { isRead: false },
      { isRead: true },
    );
    return result;
  }
}
