import { inject, injectable } from "inversify";

import { INTERFACE_TYPE } from "../../../utils/constants/bindings.js";
import { BaseController } from "../base/BaseController.js";
import type { Request, Response, NextFunction } from "express";
import type { TGenericPromise } from "../../../utils/constants/genTypes.js";
import { HttpStatusCode } from "../../../utils/constants/enums.js";
import type { IControllerUserRequest } from "../auth_controller/IController.js";
import { BadRequestError } from "../../../error_handler/BadRequestError.js";
import type {
  INotification,
  INotificationRequestQuery,
} from "../../../entities/Notification.js";
import type { NotificationInteractorImpl } from "../../../application/interactors/index.js";
import type { TargetEntityType } from "../../../entities/index.js";

@injectable()
export class NotificationController extends BaseController<INotification> {
  constructor(
    @inject(INTERFACE_TYPE.NotificationInteractorImpl)
    interactor: NotificationInteractorImpl
  ) {
    super(interactor);
  }

  async markAllNotificationsAsRead(
    req: Request,
    res: Response,
    next: NextFunction
  ): TGenericPromise {
    try {
      const response = await this.interactor.updateMany();
      return res.status(HttpStatusCode.OK).json(response);
    } catch (error) {
      next(error);
    }
  }
  async markSingleMessageAsRead(
    req: Request,
    res: Response,
    next: NextFunction
  ): TGenericPromise {
    try {
      if (!req.params) throw new BadRequestError("Request params are required");
      if (!req.params.id)
        throw new BadRequestError("Notification id is required");
      const data: INotification = {
        isRead: true,
        readAt: new Date(),
      };
      const response = await this.interactor.update(req.params.id, data);
      return res.status(HttpStatusCode.OK).json(response);
    } catch (error) {
      next(error);
    }
  }
  async getAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): TGenericPromise {
    try {
      const query: INotificationRequestQuery = {
        search: req.query.search?.toString(),
        pageIndex: req.query.pageIndex ? Number(req.query.pageIndex) : 1,
        pageSize: req.query.pageSize ? Number(req.query.pageSize) : 10,
        loggedBy: req.query.loggedBy?.toString() ?? undefined,
        targetEntityType:
          req.query.targetEntityType?.toString() as TargetEntityType,
        targetEntityId: req.query.targetEntityId?.toString() ?? undefined,
      };

      const response = await this.interactor.getAll(query);

      res.set(
        "x-pagination",
        JSON.stringify({
          totalPages: response.totalPages,
          pageCount: response.pageCount,
          totalCount: response.totalCount,
        })
      );

      return res.status(HttpStatusCode.OK).json(response.data);
    } catch (error) {
      next(error);
    }
  }

  async create(
    req: IControllerUserRequest,
    res: Response,
    next: NextFunction
  ): TGenericPromise {
    try {
      if (!req.body) throw new BadRequestError("Request body is required");
      const createdBy = req.user?._id;
      const response = await this.interactor.create({
        ...req.body,
        createdBy,
        loggedBy: createdBy,
      });

      return res.status(HttpStatusCode.CREATED).json(response);
    } catch (error) {
      next(error);
    }
  }
}
