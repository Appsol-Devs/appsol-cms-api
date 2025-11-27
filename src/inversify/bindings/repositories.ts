import type { Container } from "inversify";
import type { ICustomer } from "../../entities/Customer.js";
import type {
  ICallStatus,
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
  ISubscriptionReminder,
  ISubscriptionType,
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
  CustomerRepositoryImpl,
  LeadRepositoryImpl,
  type IAuthRepository,
  type IRoleRepository,
  type IUserRepository,
  AuthRepositoryImpl,
  RoleRepositoryImpl,
  UserRepositoryImpl,
  type IPermissionRepository,
  PermissionRepositoryImpl,
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
} from "../../framework/mongodb/index.js";
import { INTERFACE_TYPE } from "../../utils/constants/bindings.js";

export const bindRepositories = (container: Container) => {
  container
    .bind<IBaseRepository<INotification>>(
      INTERFACE_TYPE.NotificationRepositoryImpl
    )
    .to(NotificationRepositoryImpl);
  container
    .bind<IBaseRepository<ICustomerSetup>>(
      INTERFACE_TYPE.CustomerSetupRepositoryImpl
    )
    .to(CustomerSetupRepositoryImpl);

  container
    .bind<IBaseRepository<ISubscriptionReminder>>(
      INTERFACE_TYPE.SubscriptionReminderRepositoryImpl
    )
    .to(SubscriptionReminderRepositoryImpl);

  container
    .bind<IBaseRepository<IFeatureRequest>>(
      INTERFACE_TYPE.FeatureRequestRepositoryImpl
    )
    .to(FeatureRequestRepositoryImpl);

  container
    .bind<IBaseRepository<IPayment>>(INTERFACE_TYPE.PaymentRepositoryImpl)
    .to(PaymentRepositoryImpl);

  container
    .bind<IBaseRepository<IReschedule>>(INTERFACE_TYPE.RescheduleRepositoryImpl)
    .to(RescheduleRepositoryImpl);

  container
    .bind<IBaseRepository<ICustomerOutreach>>(
      INTERFACE_TYPE.CustomerOutreachRepositoryImpl
    )
    .to(CustomerOutreachRepositoryImpl);

  container
    .bind<IBaseLookupRepository<IOutreachType>>(
      INTERFACE_TYPE.OutreachTypeRepositoryImpl
    )
    .to(OutreachTypeRepositoryImpl);

  container
    .bind<IBaseRepository<ICustomerComplaint>>(
      INTERFACE_TYPE.CustomerComplaintRepositoryImpl
    )
    .to(CustomerComplaintRepositoryImpl);

  container
    .bind<IPermissionRepository>(INTERFACE_TYPE.PermissionRepositoryImpl)
    .to(PermissionRepositoryImpl);

  container
    .bind<IAuthRepository>(INTERFACE_TYPE.AuthRepositoryImpl)
    .to(AuthRepositoryImpl);

  container
    .bind<IRoleRepository>(INTERFACE_TYPE.RoleRepositoryImpl)
    .to(RoleRepositoryImpl);

  container
    .bind<IUserRepository>(INTERFACE_TYPE.UserRepositoryImpl)
    .to(UserRepositoryImpl);

  container
    .bind<IBaseLookupRepository<ICallStatus>>(
      INTERFACE_TYPE.CallStatusRepositoryImpl
    )
    .to(CallStatusRepositoryImpl);

  container
    .bind<IBaseLookupRepository<IComplaintCategory>>(
      INTERFACE_TYPE.ComplaintCategoryRepositoryImpl
    )
    .to(ComplaintCategoryRepositoryImpl);

  container
    .bind<IComplaintTypeRepository>(INTERFACE_TYPE.ComplaintTypeRepository)
    .to(ComplaintTypeRepositoryImpl);

  container
    .bind<IBaseLookupRepository<ILeadNextStep>>(
      INTERFACE_TYPE.LeadNextStepRepositoryImpl
    )
    .to(LeadNextStepRepositoryImpl);

  container
    .bind<IBaseLookupRepository<ILeadStatus>>(
      INTERFACE_TYPE.LeadStatusRepositoryImpl
    )
    .to(LeadStatusRepositoryImpl);

  container
    .bind<IBaseLookupRepository<ISetupStatus>>(
      INTERFACE_TYPE.SetupStatusRepositoryImpl
    )
    .to(SetupStatusRepositoryImpl);

  container
    .bind<IBaseLookupRepository<ISoftware>>(
      INTERFACE_TYPE.SoftwareRepositoryImpl
    )
    .to(SoftwareRepositoryImpl);

  container
    .bind<IBaseLookupRepository<ISubscriptionType>>(
      INTERFACE_TYPE.SubscriptionTypeRepositoryImpl
    )
    .to(SubscriptionTypeRepositoryImpl);

  container
    .bind<IBaseLookupRepository<ICustomer>>(
      INTERFACE_TYPE.CustomerRepositoryImpl
    )
    .to(CustomerRepositoryImpl);

  container
    .bind<IBaseLookupRepository<ILead>>(INTERFACE_TYPE.LeadRepositoryImpl)
    .to(LeadRepositoryImpl);
};
