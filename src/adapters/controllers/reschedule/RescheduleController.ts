import { inject, injectable } from "inversify";

import { INTERFACE_TYPE } from "../../../utils/constants/bindings.js";
import { BaseController } from "../base/BaseController.js";
import type { Request, Response, NextFunction } from "express";
import type { TGenericPromise } from "../../../utils/constants/genTypes.js";
import { HttpStatusCode } from "../../../utils/constants/enums.js";
import type { IControllerUserRequest } from "../auth_controller/IController.js";
import { BadRequestError } from "../../../error_handler/BadRequestError.js";
import type {
  IReschedule,
  IRescheduleRequestQuery,
  TargetEntityType,
} from "../../../entities/Reschedule.js";
import type { RescheduleInteractorImpl } from "../../../application/interactors/reschedule/index.js";

@injectable()
export class RescheduleController extends BaseController<IReschedule> {
  constructor(
    @inject(INTERFACE_TYPE.RescheduleInteractorImpl)
    interactor: RescheduleInteractorImpl
  ) {
    super(interactor);
  }

  async getAllReschedulesForEntity(
    req: Request,
    res: Response,
    next: NextFunction
  ): TGenericPromise {
    try {
      if (!req.params) throw new BadRequestError("Request params are required");
      if (!req.params.type || !req.params.id)
        throw new BadRequestError("Both entity type and id are required");
      const entityType = req.params.type as TargetEntityType;
      const entityId = req.params.id;
      const query: IRescheduleRequestQuery = {
        targetEntityType: entityType,
        targetEntityId: entityId,
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
      const query: IRescheduleRequestQuery = {
        search: req.query.search?.toString(),
        pageIndex: req.query.pageIndex ? Number(req.query.pageIndex) : 1,
        pageSize: req.query.pageSize ? Number(req.query.pageSize) : 10,
        status:
          req.query.status?.toString() as unknown as IReschedule["status"],
        customerId: req.query.customerId?.toString() ?? undefined,
        loggedBy: req.query.loggedBy?.toString() ?? undefined,
        targetEntityType:
          req.query.targetEntityType?.toString() as TargetEntityType,
        targetEntityId: req.query.targetEntityId?.toString() ?? undefined,
        originalDateTime: req.query.originalDateTime?.toString() ?? undefined,
        newDateTime: req.query.newDateTime?.toString() ?? undefined,
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
