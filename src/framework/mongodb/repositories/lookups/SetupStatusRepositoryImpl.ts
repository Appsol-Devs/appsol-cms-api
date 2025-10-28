import { injectable } from "inversify";
import type { ISetupStatus } from "../../../../entities/index.js";
import {
  SetupStatusModel,
  SetupStatusModelMapper,
} from "../../models/lookups/setupStatus.js";
import { BaseLookupRepoistoryImpl } from "../base/BaseLookupRepositoryImpl.js";

@injectable()
export class SetupStatusRepositoryImpl extends BaseLookupRepoistoryImpl<ISetupStatus> {
  constructor() {
    super(SetupStatusModel, SetupStatusModelMapper);
  }
}
