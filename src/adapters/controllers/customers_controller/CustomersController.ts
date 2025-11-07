import { inject, injectable } from "inversify";
import type { CustomerInteractorImpl } from "../../../application/interactors/index.js";

import { INTERFACE_TYPE } from "../../../utils/constants/bindings.js";
import { BaseController } from "../base/BaseController.js";
import type { ICustomer } from "../../../entities/Customer.js";

@injectable()
export class CustomersController extends BaseController<ICustomer> {
  constructor(
    @inject(INTERFACE_TYPE.CustomerInteractorImpl)
    interactor: CustomerInteractorImpl
  ) {
    super(interactor);
  }
}
