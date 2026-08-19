import type { Container } from "inversify";
import type { ICustomer } from "../../entities/Customer.js";
import type {
  ICallStatus,
  IStore,
  IComplaintCategory,
  ICustomerComplaint,
  ICustomerOutreach,
  ICustomerSetup,
  IFeatureRequest,
  ILeadNextStep,
  ILeadStatus,
  INotification,
  IOutreachType,
  IPayment,
  IReschedule,
  ISetupStatus,
  ISoftware,
  ISubscription,
  ISubscriptionReminder,
  ISubscriptionType,
  ITicket,
  IVisitor,
} from "../../entities/index.js";
import type { ILead } from "../../entities/Lead.js";
import {
  type IBaseLookupRepository,
  CallStatusRepositoryImpl,
  ComplaintCategoryRepositoryImpl,
  type IComplaintTypeRepository,
  ComplaintTypeRepositoryImpl,
  LeadNextStepRepositoryImpl,
  LeadStatusRepositoryImpl,
  SetupStatusRepositoryImpl,
  SoftwareRepositoryImpl,
  SubscriptionTypeRepositoryImpl,
  LeadRepositoryImpl,
  type IAuthRepository,
  type IRoleRepository,
  type IUserRepository,
  type IPermissionRepository,
  CustomerComplaintRepositoryImpl,
  CustomerOutreachRepositoryImpl,
  OutreachTypeRepositoryImpl,
  RescheduleRepositoryImpl,
  PaymentRepositoryImpl,
  type IBaseRepository,
  FeatureRequestRepositoryImpl,
  SubscriptionReminderRepositoryImpl,
  CustomerSetupRepositoryImpl,
  NotificationRepositoryImpl,
  VisitorRepositoryImpl,
  TicketRepositoryImpl,
  DashboardRepoImpl,
  type IDashboardRepo,
  StoreRepositoryImpl,
} from "../../framework/mongodb/index.js";
import { AuthRepositoryImpl as PostgresAuthRepositoryImpl } from "../../framework/postgresql/repositories/auth/AuthRepositoryImpl.js";
import { PermissionRepositoryImpl as PostgresPermissionRepositoryImpl } from "../../framework/postgresql/repositories/permission/PermissionRepositoryImpl.js";
import { RoleRepositoryImpl as PostgresRoleRepositoryImpl } from "../../framework/postgresql/repositories/role/RoleRepositoryImpl.js";
import { UserRepositoryImpl as PostgresUserRepositoryImpl } from "../../framework/postgresql/repositories/user/UserRepositoryImpl.js";
import { CustomerRepositoryImpl } from "../../framework/postgresql/repositories/customer/CustomerRepositoryImpl.js";
import { SubscriptionRepositoryImpl } from "../../framework/postgresql/repositories/subscription/SubscriptionRepositoryImpl.js";
import { LeadRepositoryImpl as PostgresLeadRepositoryImpl } from "../../framework/postgresql/repositories/lead/LeadRepositoryImpl.js";
import { VisitorRepositoryImpl as PostgresVisitorRepositoryImpl } from "../../framework/postgresql/repositories/visitor/VisitorRepositoryImpl.js";
import { PaymentRepositoryImpl as PostgresPaymentRepositoryImpl } from "../../framework/postgresql/repositories/payment/PaymentRepositoryImpl.js";
import { SubscriptionReminderRepositoryImpl as PostgresSubscriptionReminderRepositoryImpl } from "../../framework/postgresql/repositories/subscription_reminder/SubscriptionReminderRepositoryImpl.js";
import { INTERFACE_TYPE } from "../../utils/constants/bindings.js";

export const bindRepositories = (container: Container) => {
  container
    .bind<IDashboardRepo>(INTERFACE_TYPE.DashboardRepoImpl)
    .to(DashboardRepoImpl);

  container
    .bind<IBaseRepository<IStore>>(INTERFACE_TYPE.StoreRepositoryImpl)
    .to(StoreRepositoryImpl);
  container
    .bind<IBaseRepository<ITicket>>(INTERFACE_TYPE.TicketRepositoryImpl)
    .to(TicketRepositoryImpl);

  container
    .bind<IBaseRepository<IVisitor>>(INTERFACE_TYPE.VisitorRepositoryImpl)
    .to(PostgresVisitorRepositoryImpl);

  container
    .bind<
      IBaseRepository<ISubscription>
    >(INTERFACE_TYPE.SubscriptionRepositoryImpl)
    .to(SubscriptionRepositoryImpl);

  container
    .bind<
      IBaseRepository<INotification>
    >(INTERFACE_TYPE.NotificationRepositoryImpl)
    .to(NotificationRepositoryImpl);

  container
    .bind<
      IBaseRepository<ICustomerSetup>
    >(INTERFACE_TYPE.CustomerSetupRepositoryImpl)
    .to(CustomerSetupRepositoryImpl);

  container
    .bind<
      IBaseRepository<ISubscriptionReminder>
    >(INTERFACE_TYPE.SubscriptionReminderRepositoryImpl)
    .to(PostgresSubscriptionReminderRepositoryImpl);

  container
    .bind<
      IBaseRepository<IFeatureRequest>
    >(INTERFACE_TYPE.FeatureRequestRepositoryImpl)
    .to(FeatureRequestRepositoryImpl);

  container
    .bind<IBaseRepository<IPayment>>(INTERFACE_TYPE.PaymentRepositoryImpl)
    .to(PostgresPaymentRepositoryImpl);

  container
    .bind<IBaseRepository<IReschedule>>(INTERFACE_TYPE.RescheduleRepositoryImpl)
    .to(RescheduleRepositoryImpl);

  container
    .bind<
      IBaseRepository<ICustomerOutreach>
    >(INTERFACE_TYPE.CustomerOutreachRepositoryImpl)
    .to(CustomerOutreachRepositoryImpl);

  container
    .bind<
      IBaseLookupRepository<IOutreachType>
    >(INTERFACE_TYPE.OutreachTypeRepositoryImpl)
    .to(OutreachTypeRepositoryImpl);

  container
    .bind<
      IBaseRepository<ICustomerComplaint>
    >(INTERFACE_TYPE.CustomerComplaintRepositoryImpl)
    .to(CustomerComplaintRepositoryImpl);

  container
    .bind<IPermissionRepository>(INTERFACE_TYPE.PermissionRepositoryImpl)
    .to(PostgresPermissionRepositoryImpl);

  container
    .bind<IAuthRepository>(INTERFACE_TYPE.AuthRepositoryImpl)
    .to(PostgresAuthRepositoryImpl);

  container
    .bind<IRoleRepository>(INTERFACE_TYPE.RoleRepositoryImpl)
    .to(PostgresRoleRepositoryImpl);

  container
    .bind<IUserRepository>(INTERFACE_TYPE.UserRepositoryImpl)
    .to(PostgresUserRepositoryImpl);

  container
    .bind<
      IBaseLookupRepository<ICallStatus>
    >(INTERFACE_TYPE.CallStatusRepositoryImpl)
    .to(CallStatusRepositoryImpl);

  container
    .bind<
      IBaseLookupRepository<IComplaintCategory>
    >(INTERFACE_TYPE.ComplaintCategoryRepositoryImpl)
    .to(ComplaintCategoryRepositoryImpl);

  container
    .bind<IComplaintTypeRepository>(INTERFACE_TYPE.ComplaintTypeRepository)
    .to(ComplaintTypeRepositoryImpl);

  container
    .bind<
      IBaseLookupRepository<ILeadNextStep>
    >(INTERFACE_TYPE.LeadNextStepRepositoryImpl)
    .to(LeadNextStepRepositoryImpl);

  container
    .bind<
      IBaseLookupRepository<ILeadStatus>
    >(INTERFACE_TYPE.LeadStatusRepositoryImpl)
    .to(LeadStatusRepositoryImpl);

  container
    .bind<
      IBaseLookupRepository<ISetupStatus>
    >(INTERFACE_TYPE.SetupStatusRepositoryImpl)
    .to(SetupStatusRepositoryImpl);

  container
    .bind<
      IBaseLookupRepository<ISoftware>
    >(INTERFACE_TYPE.SoftwareRepositoryImpl)
    .to(SoftwareRepositoryImpl);

  container
    .bind<
      IBaseLookupRepository<ISubscriptionType>
    >(INTERFACE_TYPE.SubscriptionTypeRepositoryImpl)
    .to(SubscriptionTypeRepositoryImpl);

  container
    .bind<IBaseRepository<ICustomer>>(INTERFACE_TYPE.CustomerRepositoryImpl)
    .to(CustomerRepositoryImpl);

  container
    .bind<IBaseLookupRepository<ILead>>(INTERFACE_TYPE.LeadRepositoryImpl)
    .to(PostgresLeadRepositoryImpl);
};
