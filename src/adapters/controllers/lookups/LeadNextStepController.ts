import { inject, injectable } from "inversify";
import type { LeadNextStepInteractorImpl } from "../../../application/interactors/index.js";
import type { ILeadNextStep } from "../../../entities/lookups/LeadNextStep.js";
import { BaseLookupController } from "./BaseLookupController.js";
import { INTERFACE_TYPE } from "../../../utils/constants/bindings.js";

@injectable()
export class LeadNextStepController extends BaseLookupController<ILeadNextStep> {
  constructor(
    @inject(INTERFACE_TYPE.LeadNextStepInteractorImpl)
    leadNextStepInteractor: LeadNextStepInteractorImpl
  ) {
    super(leadNextStepInteractor);
  }
}
