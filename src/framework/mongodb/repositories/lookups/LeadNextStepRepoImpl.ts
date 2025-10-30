import { injectable } from "inversify";
import type { ILeadNextStep } from "../../../../entities/index.js";
import {
  LeadNextStepModel,
  LeadNextStepModelMapper,
} from "../../models/lookups/leadNextStep.js";
import { BaseLookupRepoistoryImpl } from "../base/BaseLookupRepositoryImpl.js";

@injectable()
export class LeadNextStepRepositoryImpl extends BaseLookupRepoistoryImpl<ILeadNextStep> {
  constructor() {
    super(LeadNextStepModel, LeadNextStepModelMapper);
  }
}
