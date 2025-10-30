import { inject, injectable } from "inversify";
import type { LeadStatusInteractorImpl } from "../../../application/interactors/index.js";
import type { ILeadStatus } from "../../../entities/lookups/LeadStatus.js";
import { BaseLookupController } from "./BaseLookupController.js";
import { INTERFACE_TYPE } from "../../../utils/constants/bindings.js";

@injectable()
export class LeadStatusController extends BaseLookupController<ILeadStatus> {
  constructor(
    @inject(INTERFACE_TYPE.LeadStatusInteractorImpl)
    leadStatusInteractor: LeadStatusInteractorImpl
  ) {
    super(leadStatusInteractor);
  }
}
