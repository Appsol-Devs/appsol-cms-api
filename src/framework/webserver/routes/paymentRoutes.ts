import { INTERFACE_TYPE } from "../../../utils/constants/bindings.js";
import Permissions from "../../../utils/constants/permissions.js";

import { container } from "../../../inversify/container.js";
import type { AuthMiddleware } from "../middleware/AuthMiddleware.js";
import { BaseRouter } from "./BaseRoutes.js";
import type { PaymentController } from "../../../adapters/controllers/payment_controller/PaymentController.js";
import { paymentSchema } from "../../../validation/index.js";

const controller = container.get<PaymentController>(
  INTERFACE_TYPE.PaymentController
);
const authMiddleware = container.get<AuthMiddleware>(
  INTERFACE_TYPE.AuthMiddleware
);

const permissionMap = {
  create: Permissions.CREATE_PAYMENT,
  read: Permissions.VIEW_PAYMENTS,
  readOne: Permissions.VIEW_PAYMENT,
  update: "N/A",
  delete: Permissions.DELETE_PAYMENT,
};

const router = new BaseRouter(
  controller,
  authMiddleware,
  "/api/payments",
  permissionMap,
  paymentSchema
).register();

// extra route for approving or rejecting a payment
router.put(
  "/api/payments/:id/approve-or-reject/:status",
  authMiddleware.authenticateToken.bind(authMiddleware),
  authMiddleware
    .checkPermission(Permissions.APPROVE_OR_REJECT_PAYMENT)
    .bind(authMiddleware),
  controller.approveOrRejectPayment.bind(controller)
);

export default router;
