import type { Container } from "inversify";
import { CustomersController } from "../../adapters/controllers/customers_controller/CustomersController.js";
import { LeadsController } from "../../adapters/controllers/leads_controller/LeadsController.js";
import { INTERFACE_TYPE } from "../../utils/constants/bindings.js";
import { CallStatusController } from "../../adapters/controllers/lookups/CallStatusController.js";
import { ComplaintCategoryController } from "../../adapters/controllers/lookups/ComplaintCategoryController.js";
import { LeadNextStepController } from "../../adapters/controllers/lookups/LeadNextStepController.js";
import { LeadStatusController } from "../../adapters/controllers/lookups/LeadStatusController.js";
import { SetupStatusController } from "../../adapters/controllers/lookups/SetupStatusController.js";
import { SoftwareController } from "../../adapters/controllers/lookups/SoftwareController.js";
import { SubscriptionTypeController } from "../../adapters/controllers/lookups/SubscriptionTypeController.js";
import { ComplaintTypeController } from "../../adapters/controllers/lookups/ComplaintTypeController.js";
import { PermissionController } from "../../adapters/controllers/permission_controller/PermissionController.js";
import { RoleController } from "../../adapters/controllers/role_controller/RoleController.js";
import { UserController } from "../../adapters/controllers/users_controller/UserController.js";
import { CustomerComplaintController } from "../../adapters/controllers/customer_complaints/CustomerComplaintsController.js";

export const bindAllControllers = (container: Container) => {
  container
    .bind<CustomerComplaintController>(
      INTERFACE_TYPE.CustomerComplaintController
    )
    .to(CustomerComplaintController);

  container.bind<RoleController>(RoleController).to(RoleController);

  container
    .bind<UserController>(INTERFACE_TYPE.UserController)
    .to(UserController);

  container
    .bind<PermissionController>(PermissionController)
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
};
