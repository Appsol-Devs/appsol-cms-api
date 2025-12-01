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
  ISubscription,
  ISubscriptionRequestQuery,
} from "../../../entities/Subscription.js";
import type { SubscriptionInteractorImpl } from "../../../application/interactors/index.js";
import type { IReminderService } from "../../../framework/services/reminder/IReminderService.js";

@injectable()
export class SubscriptionController extends BaseController<ISubscription> {
  constructor(
    @inject(INTERFACE_TYPE.SubscriptionInteractorImpl)
    interactor: SubscriptionInteractorImpl
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
      const query: ISubscriptionRequestQuery = {
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
      const autoRenew: boolean | undefined =
        req.query.autoRenew === undefined
          ? undefined
          : Boolean(req.query.autoRenew);
      const query: ISubscriptionRequestQuery = {
        search: req.query.search?.toString(),
        pageIndex: req.query.pageIndex ? Number(req.query.pageIndex) : 1,
        pageSize: req.query.pageSize ? Number(req.query.pageSize) : 10,
        customerId: req.query.customerId?.toString() ?? undefined,
        loggedBy: req.query.loggedBy?.toString() ?? undefined,
        subscriptionTypeId: req.query.reminderTypeId?.toString() ?? undefined,
        softwareId: req.query.softwareId?.toString() ?? undefined,
        startDate: req.query.startDate?.toString() ?? undefined,
        endDate: req.query.endDate?.toString() ?? undefined,
        autoRenew: autoRenew,
        nextBillingDate: {
          gte: req.query.nextBillingDate?.toString() ?? undefined,
          lte: req.query.nextBillingDate?.toString() ?? undefined,
        },
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
