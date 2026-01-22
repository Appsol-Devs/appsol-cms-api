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
  ITicket,
  ITicketRequestQuery,
  TTicketStatus,
} from "../../../entities/Ticket.js";
import type { TicketInteractorImpl } from "../../../application/interactors/index.js";
import type { IReminderService } from "../../../framework/services/reminder/IReminderService.js";

@injectable()
export class TicketController extends BaseController<ITicket> {
  constructor(
    @inject(INTERFACE_TYPE.TicketInteractorImpl)
    interactor: TicketInteractorImpl,
  ) {
    super(interactor);
  }

  async getComplaintTickets(
    req: Request,
    res: Response,
    next: NextFunction,
  ): TGenericPromise {
    try {
      const complaintId = req.params.id;
      const response = await this.interactor.getOne({ complaintId });
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
      const query: ITicketRequestQuery = {
        search: req.query.search?.toString(),
        pageIndex: req.query.pageIndex ? Number(req.query.pageIndex) : 1,
        pageSize: req.query.pageSize ? Number(req.query.pageSize) : 10,
        assignedEngineerId:
          req.query.assignedEngineerId?.toString() ?? undefined,
        loggedBy: req.query.loggedBy?.toString() ?? undefined,
        status: req.query.status?.toString() as unknown as
          | TTicketStatus
          | undefined,
        complaintId: req.query.complaintId?.toString() ?? undefined,
        startDate: req.query.startDate?.toString() ?? undefined,
        endDate: req.query.endDate?.toString() ?? undefined,
        priority: req.query.priority?.toString() as unknown as
          | TPriority
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
}
