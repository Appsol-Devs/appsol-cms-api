import { inject, injectable } from "inversify";

import { INTERFACE_TYPE } from "../../../utils/constants/bindings.js";
import { BaseController } from "../base/BaseController.js";
import type { Request, Response, NextFunction } from "express";
import type { TGenericPromise } from "../../../utils/constants/genTypes.js";
import { HttpStatusCode } from "../../../utils/constants/enums.js";
import type { IControllerUserRequest } from "../auth_controller/IController.js";
import { BadRequestError } from "../../../error_handler/BadRequestError.js";

import type { VisitorInteractorImpl } from "../../../application/interactors/index.js";
import type {
  IVisitor,
  IVisitorRequestQuery,
} from "../../../entities/index.js";

@injectable()
export class VisitorController extends BaseController<IVisitor> {
  constructor(
    @inject(INTERFACE_TYPE.VisitorInteractorImpl)
    interactor: VisitorInteractorImpl
  ) {
    super(interactor);
  }

  //check-in
  async checkIn(
    req: Request,
    res: Response,
    next: NextFunction
  ): TGenericPromise {
    try {
      const { id } = req.params;
      if (!id) throw new BadRequestError("Visitor id is required");

      const data: Partial<IVisitor> = {
        checkInTime: new Date(),
        status: "checked_in",
      };
      const response = await this.interactor.update(id, data);
      return res.status(HttpStatusCode.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  //check-out
  async checkOut(
    req: Request,
    res: Response,
    next: NextFunction
  ): TGenericPromise {
    try {
      const { id } = req.params;
      if (!id) throw new BadRequestError("Visitor id is required");

      const data: Partial<IVisitor> = {
        checkOutTime: new Date(),
        status: "checked_out",
      };
      const response = await this.interactor.update(id, data);
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
      const query: IVisitorRequestQuery = {
        search: req.query.search?.toString(),
        pageIndex: req.query.pageIndex ? Number(req.query.pageIndex) : 1,
        pageSize: req.query.pageSize ? Number(req.query.pageSize) : 10,

        loggedBy: req.query.loggedBy?.toString() ?? undefined,
        startDate: req.query.startDate?.toString() ?? undefined,
        endDate: req.query.endDate?.toString() ?? undefined,
        fullName: req.query.fullName?.toString() ?? undefined,
        email: req.query.email?.toString() ?? undefined,
        phone: req.query.phone?.toString() ?? undefined,
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
