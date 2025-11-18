import type { Container } from "inversify";
import type { ICustomer } from "../../entities/Customer.js";
import type {
  ICallStatus,
  IComplaintCategory,
  ICustomerComplaint,
  ILeadNextStep,
  ILeadStatus,
  ISetupStatus,
  ISoftware,
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
} from "../../framework/mongodb/index.js";
import { INTERFACE_TYPE } from "../../utils/constants/bindings.js";

export const bindRepositories = (container: Container) => {
  container
    .bind<IBaseLookupRepository<ICustomerComplaint>>(
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
