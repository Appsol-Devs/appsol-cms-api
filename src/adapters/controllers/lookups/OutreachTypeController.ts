import { inject, injectable } from "inversify";
import type { OutreachTypeInteractorImpl } from "../../../application/interactors/index.js";
import type { IOutreachType } from "../../../entities/lookups/OutreachType.js";
import { BaseLookupController } from "./BaseLookupController.js";
import { INTERFACE_TYPE } from "../../../utils/constants/bindings.js";

@injectable()
export class OutreachTypeController extends BaseLookupController<IOutreachType> {
  constructor(
    @inject(INTERFACE_TYPE.OutreachTypeInteractorImpl)
    OutreachTypeInteractor: OutreachTypeInteractorImpl
  ) {
    super(OutreachTypeInteractor);
  }
}
