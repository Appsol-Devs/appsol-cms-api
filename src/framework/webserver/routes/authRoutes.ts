import express from "express";
import { AuthController } from "../../../adapters/controllers/auth_controller/AuthController.js";
import { AuthInteractorImpl } from "../../../application/interactors/index.js";

import { Container } from "inversify";

import { AuthServiceImpl, MailerImpl } from "../../services/index.js";

import type { IAuthInteractor } from "../../../application/interactors/auth/IAuthInteractor.js";

import type { IAuthService } from "../../services/auth/IAuthService.js";
import type { IMailer } from "../../services/mailer/IMailer.js";

import {
  loginUserSchema,
  registerUserSchema,
  verifySignupOtpSchema,
} from "../../../validation/userSchema.js";
import type { ILogger } from "../../logging/ILogger.js";
import { LoggerImpl } from "../../logging/LoggerImpl.js";
import { INTERFACE_TYPE } from "../../../utils/constants/bindings.js";
import {
  type IAuthRepository,
  AuthRepositoryImpl,
  type IUserRepository,
  UserRepositoryImpl,
  type IRoleRepository,
  RoleRepositoryImpl,
} from "../../mongodb/index.js";
import { AuthMiddleware } from "../middleware/AuthMiddleware.js";
import { validate } from "../middleware/ValidationMiddleware.js";

const container = new Container();

//bind role
container
  .bind<IRoleRepository>(INTERFACE_TYPE.RoleRepositoryImpl)
  .to(RoleRepositoryImpl);

container
  .bind<IAuthRepository>(INTERFACE_TYPE.AuthRepositoryImpl)
  .to(AuthRepositoryImpl);
container
  .bind<IAuthService>(INTERFACE_TYPE.AuthServiceImpl)
  .to(AuthServiceImpl);
container
  .bind<IAuthInteractor>(INTERFACE_TYPE.AuthInteractorImpl)
  .to(AuthInteractorImpl);
container
  .bind<AuthController>(INTERFACE_TYPE.AuthController)
  .to(AuthController);

container
  .bind<IUserRepository>(INTERFACE_TYPE.UserRepositoryImpl)
  .to(UserRepositoryImpl);

container.bind<ILogger>(INTERFACE_TYPE.Logger).to(LoggerImpl);

container.bind<IMailer>(INTERFACE_TYPE.Mailer).to(MailerImpl);

container
  .bind<AuthMiddleware>(INTERFACE_TYPE.AuthMiddleware)
  .to(AuthMiddleware);

// Create a new instance of the controller and bind it to the router.
const controller = container.get<AuthController>(INTERFACE_TYPE.AuthController);

const authMiddleware = container.get<AuthMiddleware>(
  INTERFACE_TYPE.AuthMiddleware
);

const router = express.Router();

router.put(
  "/api/auth/verifyPasswordReset",
  //authMiddleware.authenticateToken.bind(authMiddleware),
  controller.verifyPasswordReset.bind(controller)
);

router.post(
  "/api/auth/resetPassword",
  // authMiddleware.authenticateToken.bind(authMiddleware),
  controller.resetPassword.bind(controller)
);

router.put(
  "/api/auth/changePassword",
  authMiddleware.authenticateToken.bind(authMiddleware),
  controller.changePassword.bind(controller)
);

router.post(
  "/api/auth/login",
  validate(loginUserSchema),
  controller.login.bind(controller)
);

router.post(
  "/api/auth/verifyOtp",
  validate(verifySignupOtpSchema),
  controller.verifyOtp.bind(controller)
);

router.post(
  "/api/auth/register",
  validate(registerUserSchema),
  controller.registerUser.bind(controller)
);

router.post(
  "/api/auth/sendOtp",
  // validate(verifySignupOtpSchema),
  controller.sendEmailOTP.bind(controller)
);

router.get("/api/test", controller.test.bind(controller));

export default router;
