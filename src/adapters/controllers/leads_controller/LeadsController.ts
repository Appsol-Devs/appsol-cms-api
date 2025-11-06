import { inject, injectable } from "inversify";
import type { LeadInteractorImpl } from "../../../application/interactors/index.js";

import { INTERFACE_TYPE } from "../../../utils/constants/bindings.js";
import { BaseController } from "../base/BaseController.js";
import type { ILead, ILeadRequestQuery } from "../../../entities/Lead.js";
import type { Request, Response, NextFunction } from "express";
import type { TGenericPromise } from "../../../utils/constants/genTypes.js";
import type { RequestQuery } from "../../../entities/User.js";
import { HttpStatusCode } from "../../../utils/constants/enums.js";
import type { IControllerUserRequest } from "../auth_controller/IController.js";
import { BadRequestError } from "../../../error_handler/BadRequestError.js";

@injectable()
export class LeadsController extends BaseController<ILead> {
  constructor(
    @inject(INTERFACE_TYPE.LeadInteractorImpl)
    interactor: LeadInteractorImpl
  ) {
    super(interactor);
  }

  async getAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): TGenericPromise {
    try {
      const query: ILeadRequestQuery = {
        search: req.query.search?.toString(),
        pageIndex: req.query.pageIndex ? Number(req.query.pageIndex) : 1,
        pageSize: req.query.pageSize ? Number(req.query.pageSize) : 10,
        leadStatus: req.query.leadStatus?.toString(),
        priority: req.query.priority?.toString(),
        leadStage: req.query.leadStage?.toString(),
        nextStep: req.query.nextStep?.toString(),
        loggedBy: req.query.loggedBy?.toString(),
        leadSource: req.query.leadSource?.toString(),
        location: req.query.location?.toString(),
        name: req.query.name?.toString(),
        email: req.query.email?.toString(),
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
      console.table(req.body);
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
