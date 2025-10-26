import { injectable, inject } from "inversify";
import type { RequestQuery } from "../../../entities/User.js";
import { BadRequestError } from "../../../error_handler/BadRequestError.js";
import {
  INTERFACE_TYPE,
  type TGenericPromise,
  HttpStatusCode,
} from "../../../utils/constants/index.js";
import type { IComplaintTypeInteractor } from "../../../application/interactors/lookups/complaint_type/IComplaintTypeInteractor.js";
import type { NextFunction, Request, Response } from "express";

@injectable()
export class ComplaintTypeController {
  constructor(
    @inject(INTERFACE_TYPE.ComplaintTypeInteractor)
    private readonly complaintInteractor: IComplaintTypeInteractor
  ) {
    this.complaintInteractor = complaintInteractor;
  }

  /**
   * @route GET /api/complaintsTypes/:id
   * @desc Get a single complaint
   */
  async getAComplaint(
    req: Request,
    res: Response,
    next: NextFunction
  ): TGenericPromise {
    try {
      const { id } = req.params;
      if (!id) throw new BadRequestError("Complaint ID is required");

      const response = await this.complaintInteractor.getAComplaintType(id);
      return res.status(HttpStatusCode.OK).json(response);
    } catch (error) {
      next(error);
      return;
    }
  }

  /**
   * @route DELETE /api/complaintsTypes/:id
   * @desc Delete a complaint (soft delete)
   */
  async deleteComplaint(
    req: Request,
    res: Response,
    next: NextFunction
  ): TGenericPromise {
    try {
      const { id } = req.params;
      if (!id) throw new BadRequestError("Complaint ID is required");

      const response = await this.complaintInteractor.deleteComplaintType(id);
      if (!response) throw new BadRequestError("Error deleting complaint");

      return res.status(HttpStatusCode.NO_CONTENT).json();
    } catch (error) {
      next(error);
      return;
    }
  }

  /**
   * @route POST /api/complaints
   * @desc Log a new customer complaint
   */
  async addComplaint(
    req: Request,
    res: Response,
    next: NextFunction
  ): TGenericPromise {
    try {
      const createdBy = (req as any).user?._id;
      if (!req.body) throw new BadRequestError("Complaint data is required");

      const response = await this.complaintInteractor.addComplaintType({
        ...req.body,
        createdBy,
      });

      return res.status(HttpStatusCode.CREATED).json(response);
    } catch (error) {
      next(error);
      return;
    }
  }

  /**
   * @route GET /api/complaints
   * @desc Get all complaints (paginated + searchable)
   */
  async getAllComplaints(
    req: Request,
    res: Response,
    next: NextFunction
  ): TGenericPromise {
    try {
      const query: RequestQuery = {
        search: req.query["search"]
          ? req.query["search"].toString()
          : undefined,
        pageIndex: req.query["pageIndex"] ? Number(req.query["pageIndex"]) : 1,
        pageSize: req.query["pageSize"] ? Number(req.query["pageSize"]) : 10,
      };

      const response = await this.complaintInteractor.getAllComplaintTypes(
        query
      );

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
      return;
    }
  }

  /**
   * @route PUT /api/complaintsTypes/:id
   * @desc Update an existing complaint
   */
  async updateComplaint(
    req: Request,
    res: Response,
    next: NextFunction
  ): TGenericPromise {
    try {
      const { id } = req.params;
      if (!id) throw new BadRequestError("Complaint ID is required");
      if (!req.body) throw new BadRequestError("Complaint data is required");

      const response = await this.complaintInteractor.updateComplaintType(
        id,
        req.body
      );
      return res.status(HttpStatusCode.OK).json(response);
    } catch (error) {
      next(error);
      return;
    }
  }
}
