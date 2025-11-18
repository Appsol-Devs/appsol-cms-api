import { INTERFACE_TYPE } from "../../../../utils/constants/bindings.js";
import { AuthMiddleware } from "../../middleware/AuthMiddleware.js";
import { ComplaintTypeController } from "../../../../adapters/controllers/lookups/ComplaintTypeController.js";
import express from "express";
import { Permissions } from "../../../../utils/constants/permissions.js";
import { validate } from "../../middleware/ValidationMiddleware.js";
import { lookupSchema } from "../../../../validation/lookupShema.js";
import { container } from "../../../../inversify/container.js";

const controller = container.get<ComplaintTypeController>(
  INTERFACE_TYPE.ComplaintTypeController
);
const authMiddleware = container.get<AuthMiddleware>(
  INTERFACE_TYPE.AuthMiddleware
);

const router = express.Router();

router.get(
  "/api/complaint_types",
  authMiddleware.authenticateToken.bind(authMiddleware),
  authMiddleware
    .checkPermission(Permissions.VIEW_COMPLAINT_TYPES)
    .bind(authMiddleware),

  controller.getAllComplaints.bind(controller)
);
router
  .route("/api/complaint_types/:id")
  .get(
    authMiddleware.authenticateToken.bind(authMiddleware),
    authMiddleware
      .checkPermission(Permissions.VIEW_COMPLAINT_TYPE)
      .bind(authMiddleware),
    controller.getAComplaint.bind(controller)
  )
  .put(
    authMiddleware.authenticateToken.bind(authMiddleware),
    authMiddleware
      .checkPermission(Permissions.UPDATE_COMPLAINT_TYPE)
      .bind(authMiddleware),
    controller.updateComplaint.bind(controller)
  )
  .delete(
    authMiddleware.authenticateToken.bind(authMiddleware),
    authMiddleware
      .checkPermission(Permissions.DELETE_COMPLAINT_TYPE)
      .bind(authMiddleware),
    controller.deleteComplaint.bind(controller)
  );
router.post(
  "/api/complaint_types",
  authMiddleware.authenticateToken.bind(authMiddleware),
  authMiddleware
    .checkPermission(Permissions.CREATE_COMPLAINT_TYPE)
    .bind(authMiddleware),
  validate(lookupSchema),
  controller.addComplaint.bind(controller)
);
export default router;
