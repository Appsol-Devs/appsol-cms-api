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
  IFeatureRequest,
  IFeatureRequestRequestQuery,
} from "../../../entities/FeatureRequest.js";
import type { FeatureRequestInteractorImpl } from "../../../application/interactors/feature_request/index.js";

@injectable()
export class FeatureRequestController extends BaseController<IFeatureRequest> {
  constructor(
    @inject(INTERFACE_TYPE.FeatureRequestInteractorImpl)
    interactor: FeatureRequestInteractorImpl
  ) {
    super(interactor);
  }

  async getAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): TGenericPromise {
    try {
      const query: IFeatureRequestRequestQuery = {
        search: req.query.search?.toString(),
        pageIndex: req.query.pageIndex ? Number(req.query.pageIndex) : 1,
        pageSize: req.query.pageSize ? Number(req.query.pageSize) : 10,
        status: req.query.status?.toString() as unknown as
          | IFeatureRequest["status"]
          | undefined,
        customerId: req.query.customerId?.toString() ?? undefined,
        loggedBy: req.query.loggedBy?.toString() ?? undefined,
        priority: req.query.priority?.toString() as unknown as
          | TPriority
          | undefined,
        softwareId: req.query.softwareId?.toString() ?? undefined,
        startDate: req.query.startDate?.toString() ?? undefined,
        endDate: req.query.endDate?.toString() ?? undefined,
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
