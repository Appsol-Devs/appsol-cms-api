import { injectable } from "inversify";
import type { ILeadStatus } from "../../../../entities/index.js";
import {
  LeadStatusModel,
  LeadStatusModelMapper,
} from "../../models/lookups/leadStatus.js";
import { BaseLookupRepoistoryImpl } from "../base/BaseLookupRepositoryImpl.js";

@injectable()
export class LeadStatusRepositoryImpl extends BaseLookupRepoistoryImpl<ILeadStatus> {
  constructor() {
    super(LeadStatusModel, LeadStatusModelMapper);
  }
}
