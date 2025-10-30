import { LeadNextStepRepositoryImpl } from "./../../../framework/mongodb/repositories/lookups/LeadNextStepRepoImpl.js";
import { inject } from "inversify";
import type { ILeadNextStep } from "../../../entities/index.js";
import { BaseLookupInteractorImpl } from "./base/BaseLookupInteractorImpl.js";
import { INTERFACE_TYPE } from "../../../utils/constants/bindings.js";

export class LeadNextStepInteractorImpl extends BaseLookupInteractorImpl<ILeadNextStep> {
  constructor(
    @inject(INTERFACE_TYPE.LeadNextStepRepositoryImpl)
    leadNextStepRepositoryImpl: LeadNextStepRepositoryImpl
  ) {
    super(leadNextStepRepositoryImpl);
  }
}
