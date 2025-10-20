import type { Request, Response, NextFunction } from "express";

import { IRole, IUser } from "../../../entities/User.js";
import { UnauthorizedError } from "../../../error_handler/UnauthorizedError.js";
import { inject, injectable } from "inversify";
import type { IAuthService } from "../../services/auth/IAuthService.js";
import { INTERFACE_TYPE } from "../../../utils/constants/bindings.js";

interface UserRequest extends Request {
  user?: IUser;
}

@injectable()
export class AuthMiddleware {
  private authService: IAuthService;

  constructor(
    @inject(INTERFACE_TYPE.AuthServiceImpl) authService: IAuthService
  ) {
    this.authService = authService;
  }

  async authenticateToken(
    req: UserRequest,
    _res: Response,
    next: NextFunction
  ) {
    const authHeader = req.header("Authorization");

    if (authHeader && authHeader.startsWith("Bearer")) {
      const token: string = authHeader.split(" ")[1] ?? "";
      try {
        const user = await this.authService.verifyToken<IUser>(token);
        if (user) {
          req.user = user;
          next();
        } else {
          return next(new UnauthorizedError("Invalid token"));
        }
      } catch (error) {
        return next(new UnauthorizedError(error as unknown as string));
      }
    } else {
      return next(new UnauthorizedError("Access denied. No token provided"));
    }
  }

  checkPermission =
    (permission: string) =>
    async (req: UserRequest, _res: Response, next: NextFunction) => {
      if (!req.user?.role) {
        return next(new UnauthorizedError("User does not have permission"));
      }
      if (!(req.user.role as IRole).permissions?.includes(permission)) {
        return next(
          new UnauthorizedError("User does not have required permission")
        );
      }
      next();
    };
}
