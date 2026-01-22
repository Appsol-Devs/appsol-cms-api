import { INTERFACE_TYPE } from "../../../utils/constants/bindings.js";
import Permissions from "../../../utils/constants/permissions.js";

import type { Container } from "inversify";
import type { AuthMiddleware } from "../middleware/AuthMiddleware.js";
import { BaseRouter } from "./BaseRoutes.js";
import type { TicketController } from "../../../adapters/controllers/index.js";

import { ticketsSchema } from "../../../validation/ticketSchema.js";
import express, { Router } from "express";
import { validate } from "../middleware/index.js";

export const createTicketRoutes = (container: Container): Router => {
  const router = express.Router();
  const controller = container.get<TicketController>(
    INTERFACE_TYPE.TicketController,
  );
  const authMiddleware = container.get<AuthMiddleware>(
    INTERFACE_TYPE.AuthMiddleware,
  );

  const permissionMap = {
    create: Permissions.CREATE_TICKET,
    read: Permissions.VIEW_TICKETS,
    readOne: Permissions.VIEW_TICKET,
    update: Permissions.UPDATE_TICKET,
    delete: Permissions.DELETE_TICKET,
  };

  router.patch(
    "/api/tickets/:id",
    authMiddleware.authenticateToken.bind(authMiddleware),
    authMiddleware
      .checkPermission(Permissions.UPDATE_TICKET)
      .bind(authMiddleware),
    controller.assignTicket.bind(controller),
  );
  router.get(
    "/api/customer_complaints/:id/tickets",
    authMiddleware.authenticateToken.bind(authMiddleware),
    authMiddleware
      .checkPermission(Permissions.VIEW_TICKETS)
      .bind(authMiddleware),
    controller.getComplaintTickets.bind(controller),
  );

  router.get(
    "/api/tickets",
    authMiddleware.authenticateToken.bind(authMiddleware),
    authMiddleware.checkPermission(permissionMap.read).bind(authMiddleware),
    controller.getAll.bind(controller),
  );

  router.get(
    `/api/tickets/:id`,
    authMiddleware.authenticateToken.bind(authMiddleware),
    authMiddleware.checkPermission(permissionMap.readOne).bind(authMiddleware),
    controller.getOne.bind(controller),
  );

  router.post(
    "/api/tickets",
    authMiddleware.authenticateToken.bind(authMiddleware),
    authMiddleware.checkPermission(permissionMap.create).bind(authMiddleware),
    validate(ticketsSchema),
    controller.create.bind(controller),
  );

  router.put(
    `/api/tickets/:id`,
    authMiddleware.authenticateToken.bind(authMiddleware),
    authMiddleware.checkPermission(permissionMap.update).bind(authMiddleware),
    controller.update.bind(controller),
  );

  router.delete(
    `/api/tickets/:id`,
    authMiddleware.authenticateToken.bind(authMiddleware),
    authMiddleware.checkPermission(permissionMap.delete).bind(authMiddleware),
    controller.delete.bind(controller),
  );

  return router;
};

export default createTicketRoutes;
