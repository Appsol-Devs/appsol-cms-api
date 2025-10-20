import { inject, injectable } from "inversify";
import type { IRoleInteractor } from "../../../application/interactors/index.js";
import {
  HttpStatusCode,
  INTERFACE_TYPE,
} from "../../../utils/constants/index.js";
import type { IControllerUserRequest } from "../auth_controller/IController.js";
import type { NextFunction, Response, Request } from "express";
import { BadRequestError } from "../../../error_handler/index.js";
import type { RequestQuery } from "../../../entities/index.js";

@injectable()
export class RoleController {
  private roleInteractor: IRoleInteractor;

  constructor(
    @inject(INTERFACE_TYPE.RoleInteractorImpl) roleInteractor: IRoleInteractor
  ) {
    this.roleInteractor = roleInteractor;
  }

  async addRole(
    req: IControllerUserRequest,
    res: Response,
    next: NextFunction
  ): Promise<Response<any, Record<string, any>> | undefined> {
    try {
      const data = {
        ...req.body,
      };
      if (!data.companyId) throw new BadRequestError("CompanyId is required");

      const role = await this.roleInteractor.addRole(data);
      if (!role) throw new BadRequestError("Error while adding role");
      return res.status(HttpStatusCode.CREATED).json(role);
    } catch (error) {
      next(error);
      return;
    }
  }

  async getARole(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<any, Record<string, any>> | undefined> {
    try {
      const { id } = req.params;
      if (!id) throw new BadRequestError("Role id is required");
      const response = await this.roleInteractor.getARole(id);
      if (!response) throw new BadRequestError("Error while getting role");
      return res.status(HttpStatusCode.OK).json(response);
    } catch (error) {
      next(error);
      return;
    }
  }

  async getAllRoles(
    req: IControllerUserRequest,
    res: Response,
    next: NextFunction
  ): Promise<Response<any, Record<string, any>> | undefined> {
    try {
      const query: RequestQuery = {
        search: req.query["search"]
          ? req.query["search"].toString()
          : undefined,
      };
      const response = await this.roleInteractor.getRoles(query);
      if (!response) throw new BadRequestError("Error while getting roles");
      return res.status(HttpStatusCode.OK).json(response);
    } catch (error) {
      next(error);
      return;
    }
  }

  async updateRole(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<any, Record<string, any>> | undefined> {
    try {
      const { id } = req.params;
      if (!id) throw new BadRequestError("Role id is required");
      if (!req.body) throw new BadRequestError("Role data is required");
      //TODO validate data
      const data = {
        name: req.body.name,
        description: req.body.description,
        permissions: req.body.permissions,
      };
      const response = await this.roleInteractor.updateRole(id, data);
      if (!response) throw new BadRequestError("Error while updating role");
      return res.status(HttpStatusCode.OK).json(response);
    } catch (error) {
      next(error);
      return;
    }
  }

  async deleteRole(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<any, Record<string, any>> | undefined> {
    try {
      const { id } = req.params;
      if (!id) throw new BadRequestError("Role id is required");
      const response = await this.roleInteractor.deleteRole(id);
      if (!response) throw new BadRequestError("Error while deleting role");
      return res.status(HttpStatusCode.OK).json(response);
    } catch (error) {
      next(error);
      return;
    }
  }
}
