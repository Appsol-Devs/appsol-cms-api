import { inject, injectable } from "inversify";
import type { CallStatusInteractorImpl } from "../../../application/interactors/index.js";
import type { ICallStatus } from "../../../entities/lookups/CallStatus.js";
import { BaseLookupController } from "./BaseLookupController.js";
import { INTERFACE_TYPE } from "../../../utils/constants/bindings.js";

@injectable()
export class CallStatusController extends BaseLookupController<ICallStatus> {
  constructor(
    @inject(INTERFACE_TYPE.CallStatusInteractorImpl)
    callStatusInteractor: CallStatusInteractorImpl
  ) {
    super(callStatusInteractor);
  }
}
