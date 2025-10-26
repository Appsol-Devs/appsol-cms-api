import type { Request, Response, NextFunction } from "express";
import type { IBaseLookupInteractor } from "../../../application/interactors/index.js";
import type { RequestQuery } from "../../../entities/User.js";
import { BadRequestError } from "../../../error_handler/BadRequestError.js";
import { HttpStatusCode } from "../../../utils/constants/enums.js";
import type { TGenericPromise } from "../../../utils/constants/genTypes.js";
import { injectable } from "inversify";

@injectable()
export abstract class BaseLookupController<TDomain> {
  protected constructor(
    protected readonly lookupInteractor: IBaseLookupInteractor<TDomain>
  ) {}

  /**
   * @route GET /api/lookups/:id
   * @desc Get a single lookup entity
   */
  async getOne(
    req: Request,
    res: Response,
    next: NextFunction
  ): TGenericPromise {
    try {
      const { id } = req.params;
      if (!id) throw new BadRequestError("ID is required");

      const response = await this.lookupInteractor.getById(id);
      return res.status(HttpStatusCode.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @route GET /api/lookups
   * @desc Get all lookup entities (paginated + searchable)
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

      const response = await this.lookupInteractor.getAll(query);

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
   * @route POST /api/lookups
   * @desc Create a new lookup entity
   */
  async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): TGenericPromise {
    try {
      if (!req.body) throw new BadRequestError("Request body is required");

      const createdBy = (req as any).user?._id;
      const response = await this.lookupInteractor.create({
        ...req.body,
        createdBy,
      });

      return res.status(HttpStatusCode.CREATED).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @route PUT /api/lookups/:id
   * @desc Update an existing lookup entity
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

      const response = await this.lookupInteractor.update(id, req.body);
      return res.status(HttpStatusCode.OK).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @route DELETE /api/lookups/:id
   * @desc Soft delete a lookup entity
   */
  async delete(
    req: Request,
    res: Response,
    next: NextFunction
  ): TGenericPromise {
    try {
      const { id } = req.params;
      if (!id) throw new BadRequestError("ID is required");

      const response = await this.lookupInteractor.delete(id);
      if (!response) throw new BadRequestError("Error deleting entity");

      return res.status(HttpStatusCode.NO_CONTENT).json();
    } catch (error) {
      next(error);
    }
  }
}
