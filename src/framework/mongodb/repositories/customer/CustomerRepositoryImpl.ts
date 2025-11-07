import type { ICustomer } from "../../../../entities/Customer.js";
import { BaseRepoistoryImpl } from "../base/BaseRepositoryImpl.js";
import { CustomerModel, CustomerModelMapper } from "../../models/customer.js";
import { injectable } from "inversify";

@injectable()
export class CustomerRepositoryImpl extends BaseRepoistoryImpl<ICustomer> {
  constructor() {
    super(CustomerModel, CustomerModelMapper);
  }
}
