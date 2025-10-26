import { Container } from "inversify";
import type { IComplaintTypeInteractor } from "../../../../application/interactors/lookups/complaint_type/IComplaintTypeInteractor.js";
import { INTERFACE_TYPE } from "../../../../utils/constants/bindings.js";
import {
  type IComplaintTypeRepository,
  ComplaintTypeRepositoryImpl,
} from "../../../mongodb/index.js";
import { type IAuthService, AuthServiceImpl } from "../../../services/index.js";
import { AuthMiddleware } from "../../middleware/AuthMiddleware.js";
import { ComplaintTypeInteractorImpl } from "../../../../application/interactors/lookups/index.js";
import { ComplaintTypeController } from "../../../../adapters/controllers/lookups/ComplaintTypeController.js";
import express from "express";
import { Permissions } from "../../../../utils/constants/permissions.js";
import { validate } from "../../middleware/ValidationMiddleware.js";
import { lookupSchema } from "../../../../validation/lookupShema.js";

const container = new Container();

container
  .bind<IComplaintTypeRepository>(INTERFACE_TYPE.ComplaintTypeRepository)
  .to(ComplaintTypeRepositoryImpl);

container
  .bind<IComplaintTypeInteractor>(INTERFACE_TYPE.ComplaintTypeInteractor)
  .to(ComplaintTypeInteractorImpl);

container
  .bind<IAuthService>(INTERFACE_TYPE.AuthServiceImpl)
  .to(AuthServiceImpl);
container
  .bind<ComplaintTypeController>(INTERFACE_TYPE.ComplaintTypeController)
  .to(ComplaintTypeController);

container
  .bind<AuthMiddleware>(INTERFACE_TYPE.AuthMiddleware)
  .to(AuthMiddleware);

const controller = container.get<ComplaintTypeController>(
  INTERFACE_TYPE.ComplaintTypeController
);
const authMiddleware = container.get<AuthMiddleware>(
  INTERFACE_TYPE.AuthMiddleware
);

const router = express.Router();

router.get(
  "/api/complaintsTypes",
  authMiddleware.authenticateToken.bind(authMiddleware),
  authMiddleware
    .checkPermission(Permissions.VIEW_COMPLAINT_TYPES)
    .bind(authMiddleware),

  controller.getAllComplaints.bind(controller)
);
router
  .route("/api/complaintsTypes/:id")
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
  "/api/complaintsTypes",
  authMiddleware.authenticateToken.bind(authMiddleware),
  authMiddleware
    .checkPermission(Permissions.CREATE_COMPLAINT_TYPE)
    .bind(authMiddleware),
  validate(lookupSchema),
  controller.addComplaint.bind(controller)
);
export default router;
