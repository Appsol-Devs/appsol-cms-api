import { inject, injectable } from "inversify";

import { INTERFACE_TYPE } from "../../../utils/constants/bindings.js";
import { BaseController } from "../base/BaseController.js";
import type { Request, Response, NextFunction } from "express";
import type {
  TGenericPromise,
  TPriority,
} from "../../../utils/constants/genTypes.js";
import { HttpStatusCode } from "../../../utils/constants/enums.js";
import type { IControllerUserRequest } from "../auth_controller/IController.js";
import { BadRequestError } from "../../../error_handler/BadRequestError.js";

import type {
  ISubscriptionReminder,
  ISubscriptionReminderRequestQuery,
  TSubscriptionReminderType,
} from "../../../entities/SubscriptionReminder.js";
import type { SubscriptionReminderInteractorImpl } from "../../../application/interactors/index.js";

@injectable()
export class SubscriptionReminderController extends BaseController<ISubscriptionReminder> {
  constructor(
    @inject(INTERFACE_TYPE.SubscriptionReminderInteractorImpl)
    interactor: SubscriptionReminderInteractorImpl
  ) {
    super(interactor);
  }

  async getRemindersByCustomer(
    req: Request,
    res: Response,
    next: NextFunction
  ): TGenericPromise {
    try {
      const customerId = req.params.customerId;
      if (!customerId) {
        throw new BadRequestError("Customer ID is required");
      }
      const query: ISubscriptionReminderRequestQuery = {
        customerId: customerId,
      };
      const response = await this.interactor.getAll(query);
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
      const query: ISubscriptionReminderRequestQuery = {
        search: req.query.search?.toString(),
        pageIndex: req.query.pageIndex ? Number(req.query.pageIndex) : 1,
        pageSize: req.query.pageSize ? Number(req.query.pageSize) : 10,
        customerId: req.query.customerId?.toString() ?? undefined,
        loggedBy: req.query.loggedBy?.toString() ?? undefined,
        reminderType: req.query.reminderType?.toString() as unknown as
          | TSubscriptionReminderType
          | undefined,
        softwareId: req.query.softwareId?.toString() ?? undefined,
        startDate: req.query.startDate?.toString() ?? undefined,
        endDate: req.query.endDate?.toString() ?? undefined,
        isSent: req.query.isSent
          ? req.query.isSent.toString().toLowerCase() === "true"
          : undefined,
        sentVia: req.query.sentVia?.toString() as unknown as
          | ISubscriptionReminder["sentVia"]
          | undefined,
      };

      const response = await this.interactor.getAll(query);

      res.set({
        "x-pagination": JSON.stringify({
          totalPages: response.totalPages,
          pageCount: response.pageCount,
          totalCount: response.totalCount,
        }),
      });

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
