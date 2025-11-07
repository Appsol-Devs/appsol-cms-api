import { inject } from "inversify";
import type { ICustomer } from "../../../entities/index.js";
import { INTERFACE_TYPE } from "../../../utils/constants/bindings.js";
import { BaseInteractorImpl } from "../base/BaseInteractorImpl.js";
import type { CustomerRepositoryImpl } from "../../../framework/mongodb/repositories/customer/CustomerRepositoryImpl.js";

export class CustomerInteractorImpl extends BaseInteractorImpl<ICustomer> {
  constructor(
    @inject(INTERFACE_TYPE.CustomerRepositoryImpl)
    customerRepositoryImpl: CustomerRepositoryImpl
  ) {
    super(customerRepositoryImpl);
  }
}
