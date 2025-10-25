import { injectable, inject } from "inversify";
import {
  HttpStatusCode,
  INTERFACE_TYPE,
  type TGenericPromise,
} from "../../../utils/constants/index.js";
import type { IPermissionInteractor } from "../../../application/interactors/index.js";
import { PermissionInteractorImpl } from "../../../application/interactors/permission/PermissionInteractorImpl.js";
import type { NextFunction, Response, Request } from "express";
import { UnauthorizedError } from "../../../error_handler/index.js";
import config from "../../../config/config.js";

@injectable()
export class PermissionController {
  private permissionInteractor: IPermissionInteractor;
  constructor(
    @inject(INTERFACE_TYPE.PermissionInteractorImpl)
    permissionInteractor: PermissionInteractorImpl
  ) {
    this.permissionInteractor = permissionInteractor;
  }

  async getAllPermissions(
    _req: Request,
    res: Response,
    next: NextFunction
  ): TGenericPromise {
    try {
      const response = await this.permissionInteractor.getAllPermissions();
      return res.status(HttpStatusCode.OK).json(response);
    } catch (error) {
      next(error);
      return;
    }
  }

  async uploadPermissions(
    req: Request,
    res: Response,
    next: NextFunction
  ): TGenericPromise {
    try {
      const key = req.query["key"];
      if (!key) throw new UnauthorizedError("key is required");
      if (key !== config.permissionKey)
        throw new UnauthorizedError("Invalid key");
      const response = await this.permissionInteractor.uploadPermissions();
      return res.status(HttpStatusCode.NO_CONTENT).json(response);
    } catch (error) {
      next(error);
      return;
    }
  }
}
