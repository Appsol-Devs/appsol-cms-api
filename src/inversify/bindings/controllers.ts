import type { Container } from "inversify";
import {
  RescheduleController,
  CustomerOutreachController,
  CustomerComplaintController,
  RoleController,
  UserController,
  PermissionController,
  CustomersController,
  LeadsController,
  LeadNextStepController,
  OutreachTypeController,
  CallStatusController,
  ComplaintCategoryController,
  LeadStatusController,
  SetupStatusController,
  SoftwareController,
  SubscriptionTypeController,
  ComplaintTypeController,
  PaymentController,
  FeatureRequestController,
  SubscriptionReminderController,
  CustomerSetupController,
  NotificationController,
  AuthController,
} from "../../adapters/controllers/index.js";
import { INTERFACE_TYPE } from "../../utils/constants/bindings.js";

export const bindAllControllers = (container: Container) => {
  container
    .bind<NotificationController>(INTERFACE_TYPE.NotificationController)
    .to(NotificationController);

  container
    .bind<CustomerSetupController>(INTERFACE_TYPE.CustomerSetupController)
    .to(CustomerSetupController);

  container
    .bind<SubscriptionReminderController>(
      INTERFACE_TYPE.SubscriptionReminderController
    )
    .to(SubscriptionReminderController);

  container
    .bind<FeatureRequestController>(INTERFACE_TYPE.FeatureRequestController)
    .to(FeatureRequestController);

  container
    .bind<PaymentController>(INTERFACE_TYPE.PaymentController)
    .to(PaymentController);

  container
    .bind<RescheduleController>(INTERFACE_TYPE.RescheduleController)
    .to(RescheduleController);

  container
    .bind<CustomerOutreachController>(INTERFACE_TYPE.CustomerOutreachController)
    .to(CustomerOutreachController);

  container
    .bind<CustomerComplaintController>(
      INTERFACE_TYPE.CustomerComplaintController
    )
    .to(CustomerComplaintController);

  container
    .bind<RoleController>(INTERFACE_TYPE.RoleController)
    .to(RoleController);

  container
    .bind<UserController>(INTERFACE_TYPE.UserController)
    .to(UserController);

  container
    .bind<PermissionController>(INTERFACE_TYPE.PermissionController)
    .to(PermissionController);

  container
    .bind<CustomersController>(INTERFACE_TYPE.CustomerController)
    .to(CustomersController);

  container
    .bind<LeadsController>(INTERFACE_TYPE.LeadController)
    .to(LeadsController);

  container
    .bind<LeadNextStepController>(INTERFACE_TYPE.LeadNextStepController)
    .to(LeadNextStepController);

  container
    .bind<OutreachTypeController>(INTERFACE_TYPE.OutreachTypeController)
    .to(OutreachTypeController);

  container
    .bind<CallStatusController>(INTERFACE_TYPE.CallStatusController)
    .to(CallStatusController);

  container
    .bind<ComplaintCategoryController>(
      INTERFACE_TYPE.ComplaintCategoryController
    )
    .to(ComplaintCategoryController);

  container
    .bind<LeadStatusController>(INTERFACE_TYPE.LeadStatusController)
    .to(LeadStatusController);

  container
    .bind<SetupStatusController>(INTERFACE_TYPE.SetupStatusController)
    .to(SetupStatusController);

  container
    .bind<SoftwareController>(INTERFACE_TYPE.SoftwareController)
    .to(SoftwareController);

  container
    .bind<SubscriptionTypeController>(INTERFACE_TYPE.SubscriptionTypeController)
    .to(SubscriptionTypeController);

  container
    .bind<ComplaintTypeController>(INTERFACE_TYPE.ComplaintTypeController)
    .to(ComplaintTypeController);

  container
    .bind<AuthController>(INTERFACE_TYPE.AuthController)
    .to(AuthController);
};
