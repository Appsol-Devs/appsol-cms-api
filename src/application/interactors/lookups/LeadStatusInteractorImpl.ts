import { LeadStatusRepositoryImpl } from "./../../../framework/mongodb/repositories/lookups/LeadStatusRepositoryImpl.js";
import { inject } from "inversify";
import type { ILeadStatus } from "../../../entities/index.js";
import { BaseLookupInteractorImpl } from "./base/BaseLookupInteractorImpl.js";
import { INTERFACE_TYPE } from "../../../utils/constants/bindings.js";

export class LeadStatusInteractorImpl extends BaseLookupInteractorImpl<ILeadStatus> {
  constructor(
    @inject(INTERFACE_TYPE.LeadStatusRepositoryImpl)
    leadStatusRepositoryImpl: LeadStatusRepositoryImpl
  ) {
    super(leadStatusRepositoryImpl);
  }
}
