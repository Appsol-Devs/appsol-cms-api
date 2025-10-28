import type { NextFunction, Response, Request } from "express";
import type { IAuthInteractor } from "../../../application/interactors/auth/IAuthInteractor.js";
import { inject, injectable } from "inversify";
import {
  HttpStatusCode,
  INTERFACE_TYPE,
  type TGenericPromise,
} from "../../../utils/constants/index.js";
import type { IControllerUserRequest } from "./IController.js";
import { UnprocessableEntityError } from "../../../error_handler/index.js";

@injectable()
export class AuthController {
  private interactor: IAuthInteractor;

  constructor(
    @inject(INTERFACE_TYPE.AuthInteractorImpl) interactor: IAuthInteractor
  ) {
    this.interactor = interactor;
  }

  async verifyPasswordReset(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<any, Record<string, any>> | undefined> {
    try {
      const { userId, otp, newPassword } = req.body;
      const response = await this.interactor.verifyPasswordReset(
        userId,
        otp,
        newPassword
      );
      if (response) {
        return res.status(HttpStatusCode.OK).json(response);
      }
      throw new Error();
    } catch (error) {
      next(error);
      return;
    }
  }

  async resetPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<any, Record<string, any>> | undefined> {
    try {
      const response = await this.interactor.resetPassword(req.body.email);
      if (response) {
        return res.status(HttpStatusCode.OK).json(response);
      }
      throw new Error();
    } catch (error) {
      next(error);
      return;
    }
  }

  async changePassword(
    req: IControllerUserRequest,
    res: Response,
    next: NextFunction
  ): Promise<Response<any, Record<string, any>> | undefined> {
    try {
      //TODO add validation
      req.body.userId = req.user?._id;
      const response = await this.interactor.changePassword(req.body);
      if (response) {
        return res.status(HttpStatusCode.NO_CONTENT).send();
      }
      throw new Error();
    } catch (error) {
      next(error);
      return;
    }
  }

  async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<any, Record<string, any>> | undefined> {
    try {
      //TODO add validation

      const response = await this.interactor.login(
        req.body.email,
        req.body.password,
        req.body.deviceToken
      );
      //send token as header
      res.set("accessToken", response.token);
      return res.status(HttpStatusCode.OK).json(response);
    } catch (error) {
      next(error);
      return;
    }
  }

  async verifyOtp(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<any, Record<string, any>> | undefined> {
    try {
      const { userId, otp } = req.body;
      const response = await this.interactor.verifyOTP(userId, otp);
      return res.status(HttpStatusCode.OK).json(response);
    } catch (error) {
      next(error);
      return;
    }
  }

  async sendEmailOTP(
    req: Request,
    res: Response,
    next: NextFunction
  ): TGenericPromise {
    try {
      const response = await this.interactor.sendOtp(
        req.body.userId,
        req.body.email
      );
      if (response) {
        return res.status(HttpStatusCode.OK).json(response);
      }
      throw new Error();
    } catch (error) {
      next(error);
      return;
    }
  }

  async registerUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<any, Record<string, any>> | undefined> {
    if (!req.body)
      throw new UnprocessableEntityError("Request body is required");
    try {
      const response = await this.interactor.registerUser(req.body);
      return res.status(HttpStatusCode.CREATED).json(response);
    } catch (error) {
      next(error);
      return;
    }
  }

  async test(
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response<any, Record<string, any>> | undefined> {
    try {
      const response = this.interactor.test();
      return res.status(HttpStatusCode.OK).json(response);
    } catch (error) {
      next(error);
      return;
    }
  }
}
