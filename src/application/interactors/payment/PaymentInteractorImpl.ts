import { inject } from "inversify";
import type { IPayment } from "../../../entities/index.js";
import { INTERFACE_TYPE } from "../../../utils/constants/bindings.js";
import { BaseInteractorImpl } from "../base/BaseInteractorImpl.js";
import type { PaymentRepositoryImpl } from "../../../framework/mongodb/repositories/index.js";

export class PaymentInteractorImpl extends BaseInteractorImpl<IPayment> {
  constructor(
    @inject(INTERFACE_TYPE.PaymentRepositoryImpl)
    paymentRepositoryImpl: PaymentRepositoryImpl
  ) {
    super(paymentRepositoryImpl);
  }
}
