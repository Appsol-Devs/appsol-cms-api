import { inject, injectable } from "inversify";
import type { SoftwareInteractorImpl } from "../../../application/interactors/index.js";
import type { ISoftware } from "../../../entities/lookups/Software.js";
import { BaseLookupController } from "./BaseLookupController.js";
import { INTERFACE_TYPE } from "../../../utils/constants/bindings.js";

@injectable()
export class SoftwareController extends BaseLookupController<ISoftware> {
  constructor(
    @inject(INTERFACE_TYPE.SoftwareInteractorImpl)
    softwareInteractor: SoftwareInteractorImpl
  ) {
    super(softwareInteractor);
  }
}
