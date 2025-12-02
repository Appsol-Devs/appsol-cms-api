import { INTERFACE_TYPE } from "../../../utils/constants/bindings.js";
import Permissions from "../../../utils/constants/permissions.js";

import type { Container } from "inversify";
import type { AuthMiddleware } from "../middleware/AuthMiddleware.js";
import { BaseRouter } from "./BaseRoutes.js";
import type { VisitorController } from "../../../adapters/controllers/index.js";
import { baseQuerySchema } from "../../../validation/baseSchema.js";
import type { Router } from "express";
import { visitorsSchema } from "../../../validation/vistorSchema.js";

export const createVisitorRoutes = (container: Container): Router => {
  const controller = container.get<VisitorController>(
    INTERFACE_TYPE.VisitorController
  );
  const authMiddleware = container.get<AuthMiddleware>(
    INTERFACE_TYPE.AuthMiddleware
  );

  const permissionMap = {
    create: Permissions.CREATE_VISITOR,
    read: Permissions.VIEW_VISITORS,
    readOne: Permissions.VIEW_VISITOR,
    update: Permissions.UPDATE_VISITOR,
    delete: Permissions.DELETE_VISITOR,
  };

  const router = new BaseRouter(
    controller,
    authMiddleware,
    "/api/visitors_log",
    permissionMap,
    visitorsSchema
  ).register();

  //check-in
  router.put(
    "/api/visitors_log/:id/check_in",
    authMiddleware.authenticateToken.bind(authMiddleware),
    authMiddleware
      .checkPermission(Permissions.CHECK_IN_VISITOR)
      .bind(authMiddleware),
    controller.checkIn.bind(controller)
  );

  //check-out
  router.put(
    "/api/visitors_log/:id/check_out",
    authMiddleware.authenticateToken.bind(authMiddleware),
    authMiddleware
      .checkPermission(Permissions.CHECK_OUT_VISITOR)
      .bind(authMiddleware),
    controller.checkOut.bind(controller)
  );
  return router;
};

export default createVisitorRoutes;
