import { inject } from "inversify";
import type { ICustomerSetup } from "../../../entities/index.js";
import { INTERFACE_TYPE } from "../../../utils/constants/bindings.js";
import { BaseInteractorImpl } from "../base/BaseInteractorImpl.js";
import type { CustomerSetupRepositoryImpl } from "../../../framework/mongodb/repositories/customer_setup/CustomerSetupRepoImpl.js";

export class CustomerSetupInteractorImpl extends BaseInteractorImpl<ICustomerSetup> {
  constructor(
    @inject(INTERFACE_TYPE.CustomerSetupRepositoryImpl)
    customerSetupRepositoryImpl: CustomerSetupRepositoryImpl
  ) {
    super(customerSetupRepositoryImpl);
  }
}
