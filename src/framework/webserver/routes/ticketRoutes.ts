import { INTERFACE_TYPE } from "../../../utils/constants/bindings.js";
import Permissions from "../../../utils/constants/permissions.js";

import type { Container } from "inversify";
import type { AuthMiddleware } from "../middleware/AuthMiddleware.js";
import { BaseRouter } from "./BaseRoutes.js";
import type { TicketController } from "../../../adapters/controllers/index.js";
import type { Router } from "express";
import { ticketsSchema } from "../../../validation/ticketSchema.js";

export const createTicketRoutes = (container: Container): Router => {
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

  const router = new BaseRouter(
    controller,
    authMiddleware,
    "/api/tickets",
    permissionMap,
    ticketsSchema,
  ).register();

  router.get(
    "/api/customer_complaints/:id/tickets",
    authMiddleware.authenticateToken.bind(authMiddleware),
    authMiddleware
      .checkPermission(Permissions.VIEW_TICKETS)
      .bind(authMiddleware),
    controller.getComplaintTickets.bind(controller),
  );

  return router;
};

export default createTicketRoutes;
