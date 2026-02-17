import { inject, injectable } from "inversify";

import { INTERFACE_TYPE } from "../../../utils/constants/bindings.js";
import type { ILeadRequestQuery } from "../../../entities/Lead.js";
import type { Request, Response, NextFunction } from "express";
import type { TGenericPromise } from "../../../utils/constants/genTypes.js";
import { HttpStatusCode } from "../../../utils/constants/enums.js";
import type { IControllerUserRequest } from "../auth_controller/IController.js";
import { BadRequestError } from "../../../error_handler/BadRequestError.js";
import type { ILeadInteractor } from "../../../application/interactors/lead/ILeadInteractor.js";

@injectable()
export class LeadsController {
  constructor(
    @inject(INTERFACE_TYPE.LeadInteractorImpl)
    private interactor: ILeadInteractor,
  ) {
    this.interactor = interactor;
  }

  async convertLead(
    req: Request,
    res: Response,
    next: NextFunction,
  ): TGenericPromise {
    try {
      const leadId = req.params.id;
      if (!leadId) throw new BadRequestError("ID is required");
      const response = await this.interactor.convertLead(leadId);
      return res.status(HttpStatusCode.OK).json(response);
    } catch (error) {
      next(error);
    }
  }
  async getAll(
    req: Request,
    res: Response,
    next: NextFunction,
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

  async create(
    req: IControllerUserRequest,
    res: Response,
    next: NextFunction,
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

  async getOne(
    req: Request,
    res: Response,
    next: NextFunction,
  ): TGenericPromise {
    try {
      const { id } = req.params;
      if (!id) throw new BadRequestError("ID is required");

      const response = await this.interactor.getById(id);
      return res.status(HttpStatusCode.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  async update(
    req: Request,
    res: Response,
    next: NextFunction,
  ): TGenericPromise {
    try {
      const { id } = req.params;
      if (!id) throw new BadRequestError("ID is required");
      if (!req.body) throw new BadRequestError("Update data is required");

      const response = await this.interactor.update(id, req.body);
      return res.status(HttpStatusCode.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  async delete(
    req: Request,
    res: Response,
    next: NextFunction,
  ): TGenericPromise {
    try {
      const { id } = req.params;
      if (!id) throw new BadRequestError("ID is required");

      const response = await this.interactor.delete(id);
      if (!response) throw new BadRequestError("Error deleting entity");

      return res.status(HttpStatusCode.NO_CONTENT).json();
    } catch (error) {
      next(error);
    }
  }
}
