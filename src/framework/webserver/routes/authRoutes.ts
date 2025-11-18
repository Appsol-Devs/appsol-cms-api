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
import { container } from "../../../inversify/container.js";

//bind role

container
  .bind<IAuthInteractor>(INTERFACE_TYPE.AuthInteractorImpl)
  .to(AuthInteractorImpl);
container
  .bind<AuthController>(INTERFACE_TYPE.AuthController)
  .to(AuthController);

// Create a new instance of the controller and bind it to the router.
const controller = container.get<AuthController>(INTERFACE_TYPE.AuthController);

const authMiddleware = container.get<AuthMiddleware>(
  INTERFACE_TYPE.AuthMiddleware
);

const router = express.Router();

router.put(
  "/api/auth/verify_password_reset",
  //authMiddleware.authenticateToken.bind(authMiddleware),
  controller.verifyPasswordReset.bind(controller)
);

router.post(
  "/api/auth/reset_password",
  // authMiddleware.authenticateToken.bind(authMiddleware),
  controller.resetPassword.bind(controller)
);

router.put(
  "/api/auth/change_password",
  authMiddleware.authenticateToken.bind(authMiddleware),
  controller.changePassword.bind(controller)
);

router.post(
  "/api/auth/login",
  validate(loginUserSchema),
  controller.login.bind(controller)
);

router.post(
  "/api/auth/verify_otp",
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
