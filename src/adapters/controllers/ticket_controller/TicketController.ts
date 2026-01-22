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
import type {
  ITicketInteractor,
  TicketInteractorImpl,
} from "../../../application/interactors/index.js";

@injectable()
export class TicketController {
  constructor(
    @inject(INTERFACE_TYPE.TicketInteractorImpl)
    private readonly interactor: ITicketInteractor,
  ) {
    this.interactor = interactor;
  }

  async closeTicket(
    req: Request,
    res: Response,
    next: NextFunction,
  ): TGenericPromise {
    try {
      const ticketId = req.params.id;
      if (!ticketId) throw new BadRequestError("Ticket id is required");
      const response = await this.interactor.closeTicket(ticketId);
      return res.status(HttpStatusCode.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  async assignTicket(
    req: Request,
    res: Response,
    next: NextFunction,
  ): TGenericPromise {
    try {
      const ticketId = req.params.id;
      if (!req.body) throw new BadRequestError("Request body is required");
      if (!ticketId) throw new BadRequestError("Ticket id is required");
      const response = await this.interactor.assignTicket(
        {
          ...req.body,
        },
        ticketId,
      );
      return res.status(HttpStatusCode.OK).json(response);
    } catch (error) {
      next(error);
    }
  }
  async getComplaintTickets(
    req: Request,
    res: Response,
    next: NextFunction,
  ): TGenericPromise {
    try {
      const complaintId = req.params.id;
      if (!complaintId) throw new BadRequestError("Complaint id is required");
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

  /**
   * @route DELETE /api/s/:id
   * @desc Soft delete a  entity
   */
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
