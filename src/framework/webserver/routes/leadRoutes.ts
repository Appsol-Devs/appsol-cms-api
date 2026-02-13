import { LeadsController } from "../../../adapters/controllers/leads_controller/LeadsController.js";
import { INTERFACE_TYPE } from "../../../utils/constants/bindings.js";
import Permissions from "../../../utils/constants/permissions.js";
import {
  leadQuerySchema,
  updateLeadSchema,
} from "../../../validation/leadShema.js";
import type { Container } from "inversify";
import type { Router } from "express";
import type { AuthMiddleware } from "../middleware/AuthMiddleware.js";
import express from "express";
import { validate } from "../middleware/index.js";

export const createLeadRoutes = (container: Container): Router => {
  const router = express.Router();
  const controller = container.get<LeadsController>(
    INTERFACE_TYPE.LeadController,
  );
  const authMiddleware = container.get<AuthMiddleware>(
    INTERFACE_TYPE.AuthMiddleware,
  );

  const permissionMap = {
    create: Permissions.CREATE_LEAD,
    read: Permissions.VIEW_LEADS,
    readOne: Permissions.VIEW_LEAD,
    update: Permissions.UPDATE_LEAD,
    delete: Permissions.DELETE_LEAD,
  };

  router.patch(
    "/api/leads/:id/convert",
    authMiddleware.authenticateToken.bind(authMiddleware),
    authMiddleware
      .checkPermission(Permissions.UPDATE_TICKET)
      .bind(authMiddleware),
    controller.convertLead.bind(controller),
  );

  router.get(
    "/api/leads",
    authMiddleware.authenticateToken.bind(authMiddleware),
    authMiddleware.checkPermission(permissionMap.read).bind(authMiddleware),
    controller.getAll.bind(controller),
  );

  router.get(
    `/api/leads/:id`,
    authMiddleware.authenticateToken.bind(authMiddleware),
    authMiddleware.checkPermission(permissionMap.readOne).bind(authMiddleware),
    controller.getOne.bind(controller),
  );

  router.post(
    "/api/leads",
    authMiddleware.authenticateToken.bind(authMiddleware),
    authMiddleware.checkPermission(permissionMap.create).bind(authMiddleware),
    validate(leadQuerySchema),
    controller.create.bind(controller),
  );

  router.put(
    `/api/leads/:id`,
    authMiddleware.authenticateToken.bind(authMiddleware),
    authMiddleware.checkPermission(permissionMap.update).bind(authMiddleware),
    validate(updateLeadSchema),
    controller.update.bind(controller),
  );

  router.delete(
    `/api/leads/:id`,
    authMiddleware.authenticateToken.bind(authMiddleware),
    authMiddleware.checkPermission(permissionMap.delete).bind(authMiddleware),
    controller.delete.bind(controller),
  );

  return router;
};

export default createLeadRoutes;
