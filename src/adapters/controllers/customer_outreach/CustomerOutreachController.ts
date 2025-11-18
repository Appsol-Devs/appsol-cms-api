import { inject, injectable } from "inversify";
import type { CustomerOutreachInteractorImpl } from "../../../application/interactors/index.js";

import { INTERFACE_TYPE } from "../../../utils/constants/bindings.js";
import { BaseController } from "../base/BaseController.js";
import type { Request, Response, NextFunction } from "express";
import type { TGenericPromise } from "../../../utils/constants/genTypes.js";
import { HttpStatusCode } from "../../../utils/constants/enums.js";
import type { IControllerUserRequest } from "../auth_controller/IController.js";
import { BadRequestError } from "../../../error_handler/BadRequestError.js";
import type {
  ICustomerOutreach,
  ICustomerOutreachRequestQuery,
  ICustomerOutreachStatus,
} from "../../../entities/CustomerOutreach.js";

@injectable()
export class CustomerOutreachController extends BaseController<ICustomerOutreach> {
  constructor(
    @inject(INTERFACE_TYPE.CustomerOutreachInteractorImpl)
    interactor: CustomerOutreachInteractorImpl
  ) {
    super(interactor);
  }

  async getAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): TGenericPromise {
    try {
      const query: ICustomerOutreachRequestQuery = {
        search: req.query.search?.toString(),
        pageIndex: req.query.pageIndex ? Number(req.query.pageIndex) : 1,
        pageSize: req.query.pageSize ? Number(req.query.pageSize) : 10,
        status: req.query.status?.toString() as ICustomerOutreachStatus,
        customerId: req.query.customerId?.toString() ?? undefined,
        callStatusId: req.query.callStatusId?.toString() ?? undefined,
        loggedBy: req.query.loggedBy?.toString() ?? undefined,
        resolvedBy: req.query.resolvedBy?.toString() ?? undefined,
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
