import { CallStatusRepositoryImpl } from "../../../framework/mongodb/repositories/lookups/CallStatusRepositoryImpl.js";
import { inject } from "inversify";
import type { ICallStatus } from "../../../entities/index.js";
import { BaseLookupInteractorImpl } from "./base/BaseLookupInteractorImpl.js";
import { INTERFACE_TYPE } from "../../../utils/constants/bindings.js";

export class CallStatusInteractorImpl extends BaseLookupInteractorImpl<ICallStatus> {
  constructor(
    @inject(INTERFACE_TYPE.CallStatusRepositoryImpl)
    CallStatusRepositoryImpl: CallStatusRepositoryImpl
  ) {
    super(CallStatusRepositoryImpl);
  }
}
