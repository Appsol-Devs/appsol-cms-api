import type { Request, Response, NextFunction } from "express";

import type { RequestQuery } from "../../../entities/User.js";
import { BadRequestError } from "../../../error_handler/BadRequestError.js";
import { HttpStatusCode } from "../../../utils/constants/enums.js";
import type { TGenericPromise } from "../../../utils/constants/genTypes.js";
import { injectable } from "inversify";
import type { IBaseInteractor } from "../../../application/interactors/base/index.js";

@injectable()
export abstract class BaseController<TDomain> {
  protected constructor(
    protected readonly interactor: IBaseInteractor<TDomain>
  ) {}

  /**
   * @route GET /api/s/:id
   * @desc Get a single  entity
   */
  async getOne(
    req: Request,
    res: Response,
    next: NextFunction
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

  /**
   * @route GET /api/s
   * @desc Get all  entities (paginated + searchable)
   */
  async getAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): TGenericPromise {
    try {
      const query: RequestQuery = {
        search: req.query["search"]?.toString(),
        pageIndex: req.query["pageIndex"] ? Number(req.query["pageIndex"]) : 1,
        pageSize: req.query["pageSize"] ? Number(req.query["pageSize"]) : 10,
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

  /**
   * @route POST /api/s
   * @desc Create a new  entity
   */
  async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): TGenericPromise {
    try {
      if (!req.body) throw new BadRequestError("Request body is required");

      const createdBy = (req as any).user?._id;
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

  /**
   * @route PUT /api/s/:id
   * @desc Update an existing  entity
   */
  async update(
    req: Request,
    res: Response,
    next: NextFunction
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
    next: NextFunction
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
