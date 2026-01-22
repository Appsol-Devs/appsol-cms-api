import type { Container } from "inversify";
import {
  type IBaseLookupInteractor,
  LeadInteractorImpl,
  CustomerInteractorImpl,
  CallStatusInteractorImpl,
  ComplaintCategoryInteractorImpl,
  ComplaintTypeInteractorImpl,
  type IComplaintTypeInteractor,
  LeadNextStepInteractorImpl,
  LeadStatusInteractorImpl,
  SetupStatusInteractorImpl,
  SoftwareInteractorImpl,
  SubscriptionTypeInteractorImpl,
  type IPermissionInteractor,
  type IRoleInteractor,
  type IUserInteractor,
  RoleInteractorImpl,
  UserInteractorImpl,
  CustomerComplaintInteractorImpl,
  CustomerOutreachInteractorImpl,
  OutreachTypeInteractorImpl,
  PaymentInteractorImpl,
  RescheduleInteractorImpl,
  FeatureRequestInteractorImpl,
  type IBaseInteractor,
  PermissionInteractorImpl,
  SubscriptionReminderInteractorImpl,
  CustomerSetupInteractorImpl,
  NotificationInteractorImpl,
  AuthInteractorImpl,
  type IAuthInteractor,
  SubscriptionInteractorImpl,
  VisitorInteractorImpl,
  TicketInteractorImpl,
} from "../../application/interactors/index.js";
import type { ICustomer } from "../../entities/Customer.js";
import type { ILead } from "../../entities/Lead.js";
import { INTERFACE_TYPE } from "../../utils/constants/bindings.js";
import type {
  ISubscriptionType,
  ISoftware,
  ISetupStatus,
  ILeadStatus,
  ILeadNextStep,
  IComplaintCategory,
  ICallStatus,
  ICustomerComplaint,
  ICustomerOutreach,
  IOutreachType,
  IReschedule,
  IPayment,
  IFeatureRequest,
  ISubscriptionReminder,
  ICustomerSetup,
  INotification,
  ISubscription,
  IVisitor,
  ITicket,
} from "../../entities/index.js";

export const bindAllInteractors = (container: Container) => {
  container
    .bind<IBaseInteractor<ITicket>>(INTERFACE_TYPE.TicketInteractorImpl)
    .to(TicketInteractorImpl);
  container
    .bind<IBaseInteractor<IVisitor>>(INTERFACE_TYPE.VisitorInteractorImpl)
    .to(VisitorInteractorImpl);

  container
    .bind<
      IBaseInteractor<ISubscription>
    >(INTERFACE_TYPE.SubscriptionInteractorImpl)
    .to(SubscriptionInteractorImpl);

  container
    .bind<
      IBaseInteractor<INotification>
    >(INTERFACE_TYPE.NotificationInteractorImpl)
    .to(NotificationInteractorImpl);

  container
    .bind<
      IBaseInteractor<ICustomerSetup>
    >(INTERFACE_TYPE.CustomerSetupInteractorImpl)
    .to(CustomerSetupInteractorImpl);

  container
    .bind<
      IBaseInteractor<ISubscriptionReminder>
    >(INTERFACE_TYPE.SubscriptionReminderInteractorImpl)
    .to(SubscriptionReminderInteractorImpl);

  container
    .bind<
      IBaseInteractor<IFeatureRequest>
    >(INTERFACE_TYPE.FeatureRequestInteractorImpl)
    .to(FeatureRequestInteractorImpl);

  container
    .bind<IBaseInteractor<IPayment>>(INTERFACE_TYPE.PaymentInteractorImpl)
    .to(PaymentInteractorImpl);

  container
    .bind<IBaseInteractor<IReschedule>>(INTERFACE_TYPE.RescheduleInteractorImpl)
    .to(RescheduleInteractorImpl);

  container
    .bind<
      IBaseInteractor<ICustomerOutreach>
    >(INTERFACE_TYPE.CustomerOutreachInteractorImpl)
    .to(CustomerOutreachInteractorImpl);

  container
    .bind<
      IBaseInteractor<ICustomerComplaint>
    >(INTERFACE_TYPE.CustomerComplaintInteractorImpl)
    .to(CustomerComplaintInteractorImpl);

  container
    .bind<IPermissionInteractor>(INTERFACE_TYPE.PermissionInteractorImpl)
    .to(PermissionInteractorImpl);

  container
    .bind<IRoleInteractor>(INTERFACE_TYPE.RoleInteractorImpl)
    .to(RoleInteractorImpl);

  container
    .bind<IUserInteractor>(INTERFACE_TYPE.UserInteractor)
    .to(UserInteractorImpl);

  container
    .bind<
      IBaseLookupInteractor<IOutreachType>
    >(INTERFACE_TYPE.OutreachTypeInteractorImpl)
    .to(OutreachTypeInteractorImpl);

  container
    .bind<IBaseLookupInteractor<ILead>>(INTERFACE_TYPE.LeadInteractorImpl)
    .to(LeadInteractorImpl);

  container
    .bind<
      IBaseLookupInteractor<ICustomer>
    >(INTERFACE_TYPE.CustomerInteractorImpl)
    .to(CustomerInteractorImpl);

  container
    .bind<
      IBaseLookupInteractor<ISubscriptionType>
    >(INTERFACE_TYPE.SubscriptionTypeInteractorImpl)
    .to(SubscriptionTypeInteractorImpl);

  container
    .bind<
      IBaseLookupInteractor<ISoftware>
    >(INTERFACE_TYPE.SoftwareInteractorImpl)
    .to(SoftwareInteractorImpl);
  container
    .bind<
      IBaseLookupInteractor<ISetupStatus>
    >(INTERFACE_TYPE.SetupStatusInteractorImpl)
    .to(SetupStatusInteractorImpl);
  container
    .bind<
      IBaseLookupInteractor<ILeadStatus>
    >(INTERFACE_TYPE.LeadStatusInteractorImpl)
    .to(LeadStatusInteractorImpl);

  container
    .bind<
      IBaseLookupInteractor<ILeadNextStep>
    >(INTERFACE_TYPE.LeadNextStepInteractorImpl)
    .to(LeadNextStepInteractorImpl);
  container
    .bind<IComplaintTypeInteractor>(INTERFACE_TYPE.ComplaintTypeInteractor)
    .to(ComplaintTypeInteractorImpl);

  container
    .bind<
      IBaseLookupInteractor<IComplaintCategory>
    >(INTERFACE_TYPE.ComplaintCategoryInteractorImpl)
    .to(ComplaintCategoryInteractorImpl);

  container
    .bind<
      IBaseLookupInteractor<ICallStatus>
    >(INTERFACE_TYPE.CallStatusInteractorImpl)
    .to(CallStatusInteractorImpl);

  container
    .bind<IAuthInteractor>(INTERFACE_TYPE.AuthInteractorImpl)
    .to(AuthInteractorImpl);
};
