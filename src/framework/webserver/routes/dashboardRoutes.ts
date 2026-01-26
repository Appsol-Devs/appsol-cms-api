import { INTERFACE_TYPE } from "../../../utils/constants/bindings.js";
import Permissions from "../../../utils/constants/permissions.js";

import type { Container } from "inversify";
import type { AuthMiddleware } from "../middleware/AuthMiddleware.js";
import type { DashboardController } from "../../../adapters/controllers/index.js";

import express, { Router } from "express";

export const createDashboardRoutes = (container: Container): Router => {
  const router = express.Router();
  const controller = container.get<DashboardController>(
    INTERFACE_TYPE.DashboardController,
  );
  const authMiddleware = container.get<AuthMiddleware>(
    INTERFACE_TYPE.AuthMiddleware,
  );

  router.get(
    "/api/dashboard/summary",
    authMiddleware.authenticateToken.bind(authMiddleware),
    authMiddleware
      .checkPermission(Permissions.VIEW_DASHBOARD)
      .bind(authMiddleware),
    controller.getDashboardSummary.bind(controller),
  );

  router.get(
    "/api/dashboard/weekly-revenue-trends",
    authMiddleware.authenticateToken.bind(authMiddleware),
    authMiddleware
      .checkPermission(Permissions.VIEW_DASHBOARD)
      .bind(authMiddleware),
    controller.getWeeklyRevenueTrend.bind(controller),
  );
  router.get(
    "/api/dashboard/operational-insights",
    authMiddleware.authenticateToken.bind(authMiddleware),
    authMiddleware
      .checkPermission(Permissions.VIEW_DASHBOARD)
      .bind(authMiddleware),
    controller.getOperationalInsights.bind(controller),
  );

  return router;
};

export default createDashboardRoutes;
