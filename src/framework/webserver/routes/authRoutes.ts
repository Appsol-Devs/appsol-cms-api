// ...existing code...
import { Router } from "express";
import { AuthController } from "../../../adapters/controllers/auth_controller/AuthController.js";
import { AuthInteractorImpl } from "../../../application/interactors/index.js";

import type { IAuthInteractor } from "../../../application/interactors/auth/IAuthInteractor.js";

import {
  loginUserSchema,
  registerUserSchema,
  verifySignupOtpSchema,
} from "../../../validation/userSchema.js";
import { INTERFACE_TYPE } from "../../../utils/constants/bindings.js";
import { AuthMiddleware } from "../middleware/AuthMiddleware.js";
import { validate } from "../middleware/ValidationMiddleware.js";
import type { Container } from "inversify";
// ...existing code...

export const createAuthRoutes = (container: Container): Router => {
  const router = Router();

  const controller = container.get<AuthController>(
    INTERFACE_TYPE.AuthController
  );

  const authMiddleware = container.get<AuthMiddleware>(
    INTERFACE_TYPE.AuthMiddleware
  );

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
    "/api/auth/send_otp",
    // validate(verifySignupOtpSchema),
    authMiddleware.authenticateToken.bind(authMiddleware),
    controller.sendEmailOTP.bind(controller)
  );

  router.get("/api/test", controller.test.bind(controller));

  return router;
};
// ...existing code...
