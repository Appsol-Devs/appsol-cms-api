import { inject, injectable } from "inversify";
import type { CustomerInteractorImpl } from "../../../application/interactors/index.js";

import { INTERFACE_TYPE } from "../../../utils/constants/bindings.js";
import { BaseController } from "../base/BaseController.js";
import type {
  CustomerStatus,
  ICustomer,
  ICustomerRequestQuery,
} from "../../../entities/Customer.js";
import type { Request, Response, NextFunction } from "express";
import type { TGenericPromise } from "../../../utils/constants/genTypes.js";
import { HttpStatusCode } from "../../../utils/constants/enums.js";

@injectable()
export class CustomersController extends BaseController<ICustomer> {
  constructor(
    @inject(INTERFACE_TYPE.CustomerInteractorImpl)
    interactor: CustomerInteractorImpl,
  ) {
    super(interactor);
  }

  async getAll(
    req: Request,
    res: Response,
    next: NextFunction,
  ): TGenericPromise {
    try {
      const query: ICustomerRequestQuery = {
        search: req.query.search?.toString(),
        pageIndex: req.query.pageIndex ? Number(req.query.pageIndex) : 1,
        pageSize: req.query.pageSize ? Number(req.query.pageSize) : 10,
        status: req.query.status?.toString() as CustomerStatus,
        loggedBy: req.query.loggedBy?.toString(),
        startDate: req.query.startDate?.toString(),
        endDate: req.query.endDate?.toString(),
        softwareId: req.query.softwareId?.toString(),
      };
      const response = await this.interactor.getAll(query);
      res.set(
        "x-pagination",
        JSON.stringify({
          totalPages: response.totalPages,
          pageCount: response.pageCount,
          totalCount: response.totalCount,
        }),
      );

      return res.status(HttpStatusCode.OK).json(response.data);
    } catch (error) {
      next(error);
    }
  }
}
