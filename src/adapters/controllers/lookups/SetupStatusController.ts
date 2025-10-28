import { inject, injectable } from "inversify";
import type { SetupStatusInteractorImpl } from "../../../application/interactors/index.js";
import type { ISetupStatus } from "../../../entities/lookups/SetupStatus.js";
import { BaseLookupController } from "./BaseLookupController.js";
import { INTERFACE_TYPE } from "../../../utils/constants/bindings.js";

@injectable()
export class SetupStatusController extends BaseLookupController<ISetupStatus> {
  constructor(
    @inject(INTERFACE_TYPE.SetupStatusInteractorImpl)
    SetupStatusInteractor: SetupStatusInteractorImpl
  ) {
    super(SetupStatusInteractor);
  }
}
