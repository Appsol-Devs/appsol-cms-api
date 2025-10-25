import { inject, injectable } from "inversify";
import type { IUserInteractor } from "../../../application/interactors/users/IUserInteractor.js";
import {
  HttpStatusCode,
  INTERFACE_TYPE,
} from "../../../utils/constants/index.js";
import type { NextFunction, Request, Response } from "express";
import type { RequestQuery } from "../../../entities/User.js";
import type { IControllerUserRequest } from "../auth_controller/IController.js";
import { BadRequestError } from "../../../error_handler/index.js";
import type { TGenericPromise } from "../../../utils/constants/genTypes.js";

@injectable()
export class UserController {
  private userInteractor: IUserInteractor;
  constructor(
    @inject(INTERFACE_TYPE.UserInteractor) userInteractor: IUserInteractor
  ) {
    this.userInteractor = userInteractor;
  }

  async getAUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): TGenericPromise {
    try {
      const { id } = req.params;
      if (!id) throw new BadRequestError("User id is required");
      const response = await this.userInteractor.getAUser(id);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
      return;
    }
  }

  async deleteUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): TGenericPromise {
    try {
      const { id } = req.params;
      if (!id) throw new BadRequestError("User id is required");
      const response = await this.userInteractor.deleteUser(id);
      if (!response) throw new BadRequestError("Error deleting user");
      return res.status(HttpStatusCode.NO_CONTENT).json();
    } catch (error) {
      next(error);
      return;
    }
  }

  async addUser(
    req: IControllerUserRequest,
    res: Response,
    next: NextFunction
  ): TGenericPromise {
    try {
      //TODO add validation
      const createdBy = req.user?._id;
      const response = await this.userInteractor.addUser({
        ...req.body,
        createdBy,
      });
      return res.status(200).json(response);
    } catch (error) {
      next(error);
      return;
    }
  }

  async getAllUsers(
    req: IControllerUserRequest,
    res: Response,
    next: NextFunction
  ): TGenericPromise {
    try {
      const query: RequestQuery = {
        search: req.query["search"]
          ? req.query["search"].toString()
          : undefined,
        pageIndex: req.query["pageIndex"]
          ? Number(req.query["pageIndex"])
          : undefined,
        pageSize: req.query["pageSize"]
          ? Number(req.query["pageSize"])
          : undefined,
      };
      const response = await this.userInteractor.getAllUsers(query);
      res.set(
        "x-pagination",
        JSON.stringify({
          totalPages: response.totalPages,
          pageCount: response.pageCount,
          totalCount: response.totalCount,
        })
      );
      return res.status(200).json(response.data);
    } catch (error) {
      next(error);
      return;
    }
  }

  async updateUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): TGenericPromise {
    try {
      const { id } = req.params;
      if (!id) throw new BadRequestError("User id is required");
      if (!req.body) throw new BadRequestError("User data is required");
      //TODO validate data
      const response = await this.userInteractor.updateUser(id, req.body);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
      return;
    }
  }
}
