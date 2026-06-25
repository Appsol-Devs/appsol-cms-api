import { inject, injectable } from "inversify";
import { INTERFACE_TYPE } from "../../../utils/constants/bindings.js";
import { BaseController } from "../base/BaseController.js";
import type { Request, Response, NextFunction } from "express";
import type { TGenericPromise } from "../../../utils/constants/genTypes.js";
import { HttpStatusCode } from "../../../utils/constants/enums.js";
import type { StoreInteractorImpl } from "../../../application/interactors/index.js";
import type {
  IStore,
  IStoreRequestQuery,
  StoreStatus,
} from "../../../entities/Store.js";

@injectable()
export class StoreController extends BaseController<IStore> {
  constructor(
    @inject(INTERFACE_TYPE.StoreInteractorImpl)
    interactor: StoreInteractorImpl,
  ) {
    super(interactor);
  }

  async getAll(
    req: Request,
    res: Response,
    next: NextFunction,
  ): TGenericPromise {
    try {
      const query: IStoreRequestQuery = {
        search: req.query.search?.toString(),
        pageIndex: req.query.pageIndex ? Number(req.query.pageIndex) : 1,
        pageSize: req.query.pageSize ? Number(req.query.pageSize) : 10,
        customerId: req.query.customerId?.toString(),
        status: req.query.status?.toString() as StoreStatus,
        loggedBy: req.query.loggedBy?.toString(),
        startDate: req.query.startDate?.toString(),
        endDate: req.query.endDate?.toString(),
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
